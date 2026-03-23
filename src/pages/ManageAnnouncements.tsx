import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { announcementService } from '../services/announcementService';
import type { Announcement } from '../types';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import Pagination from '../components/Pagination';
import RichTextEditor from '../components/RichTextEditor';
import ImageUploader from '../components/ImageUploader';
import { cloudinaryService } from '../services/cloudinaryService';
import type { CloudinaryUploadResponse } from '../services/cloudinaryService';
import AdminLayout from '../components/AdminLayout';
import './ManageAnnouncements.css';

const ITEMS_PER_PAGE = 8;

const toHtmlFromContent = (content: string[]): string =>
  content
    .filter((line) => line.trim())
    .map((line) => `<p>${line}</p>`)
    .join('');

const getPlainTextFromHtml = (html: string): string => {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent?.trim() || '';
};

const extractParagraphsFromHtml = (html: string): string[] => {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  const blockNodes = temp.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6');

  const lines = Array.from(blockNodes)
    .map((node) => node.textContent?.trim() || '')
    .filter(Boolean);

  if (lines.length > 0) {
    return lines;
  }

  const fallback = temp.textContent?.trim();
  return fallback ? [fallback] : [];
};

const ManageAnnouncements = () => {
  const { currentUser } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    type: 'important' as Announcement['type'],
    contentHtml: '',
    imageUrl: '',
    imageCloudinaryId: '',
  });
  const isCloudinaryConfigured = cloudinaryService.isConfigured();

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await announcementService.getAll();
      setAnnouncements(data);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error loading announcements:', error);
      alert('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const contentLines = extractParagraphsFromHtml(formData.contentHtml);
      const announcementData = {
        title: formData.title,
        date: formData.date,
        type: formData.type,
        content: contentLines.length > 0 ? contentLines : [''],
        contentHtml: formData.contentHtml,
        image: formData.imageUrl
          ? {
              url: formData.imageUrl,
              cloudinaryId: formData.imageCloudinaryId || undefined,
            }
          : undefined,
      };

      if (editingId) {
        await announcementService.update(editingId, announcementData);
      } else {
        await announcementService.create(announcementData);
      }

      resetForm();
      loadAnnouncements();
      alert(editingId ? 'Announcement updated!' : 'Announcement created!');
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Failed to save announcement');
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      date: announcement.date,
      type: announcement.type,
      contentHtml: announcement.contentHtml || toHtmlFromContent(announcement.content),
      imageUrl: announcement.image?.url || '',
      imageCloudinaryId: announcement.image?.cloudinaryId || '',
    });
    setEditingId(announcement.id);
    setShowForm(true);
  };

  const handleImageUpload = (imageData: CloudinaryUploadResponse) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: imageData.secure_url,
      imageCloudinaryId: imageData.public_id,
    }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      await announcementService.delete(id);
      loadAnnouncements();
      alert('Announcement deleted!');
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Failed to delete announcement');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      type: 'important',
      contentHtml: '',
      imageUrl: '',
      imageCloudinaryId: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const totalPages = Math.ceil(announcements.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAnnouncements = announcements.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (!currentUser) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="manage-announcements">
        <header className="page-header">
          <h1>Manage Announcements</h1>
          <button onClick={() => setShowForm(!showForm)} className="add-button">
            <Plus size={20} />
            New Announcement
          </button>
        </header>

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header">
              <h2>{editingId ? 'Edit Announcement' : 'New Announcement'}</h2>
              <button onClick={resetForm} className="close-button">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-left">
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter announcement title"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Date *</label>
                      <input
                        type="text"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        placeholder="e.g., March 15, 2024"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Type *</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Announcement['type'] }))}
                      >
                        <option value="important">Important</option>
                        <option value="achievement">Achievement</option>
                        <option value="event">Event</option>
                        <option value="facility">Facility Update</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Content *</label>
                    <RichTextEditor
                      value={formData.contentHtml}
                      onChange={(value) => setFormData((prev) => ({ ...prev, contentHtml: value }))}
                      placeholder="Write the announcement content here..."
                    />
                  </div>
                </div>

                <div className="form-right">
                  <div className="form-group">
                    <label>Thumbnail Image</label>
                    <div className="image-upload-section">
                      {formData.imageUrl && (
                        <div className="image-preview">
                          <img src={formData.imageUrl} alt="Preview" />
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => setFormData(prev => ({ ...prev, imageUrl: '', imageCloudinaryId: '' }))}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      {isCloudinaryConfigured ? (
                        <ImageUploader
                          onImageUpload={handleImageUpload}
                          folder="cit_announcements"
                        />
                      ) : (
                        <>
                          <input
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                imageUrl: e.target.value.trim(),
                                imageCloudinaryId: '',
                              }))
                            }
                            placeholder="Paste image URL (optional)"
                          />
                          <small>Cloudinary is not configured. You can still publish without an image, or paste an image URL.</small>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  <Save size={18} />
                  {editingId ? 'Update' : 'Create'} Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="announcements-list">
        {loading ? (
          <div className="loading-state">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="empty-state">
            <p>No announcements yet. Create your first one!</p>
          </div>
        ) : (
          paginatedAnnouncements.map(announcement => (
            <div key={announcement.id} className="announcement-card">
              {announcement.image?.url && (
                <div className="announcement-image">
                  <img src={announcement.image.url} alt={announcement.title} />
                </div>
              )}
              <div className="announcement-details">
                <div className="announcement-header">
                  <div className="announcement-header-content">
                    <h3>{announcement.title}</h3>
                    <div className="announcement-meta">
                      <span className={`type-badge ${announcement.type}`}>
                        {announcement.type}
                      </span>
                      <span className="date">{announcement.date}</span>
                    </div>
                  </div>
                  <div className="announcement-actions">
                    <button onClick={() => handleEdit(announcement)} className="edit-btn">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(announcement.id)} className="delete-btn">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="announcement-content">
                  <p>
                    {(announcement.contentHtml
                      ? getPlainTextFromHtml(announcement.contentHtml)
                      : announcement.content.join(' ')
                    ).slice(0, 220)}
                    ...
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {!loading && announcements.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
    </AdminLayout>
  );
};

export default ManageAnnouncements;
