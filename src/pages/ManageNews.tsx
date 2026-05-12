import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { newsService } from '../services/newsService';
import type { News } from '../types';
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

const getCategoryLabel = (category: News['category']) => {
  switch (category) {
    case 'announcement':
      return 'Achievements';
    case 'event':
      return 'Event';
    case 'activity':
      return 'Activity';
    case 'partnership':
      return 'Partnership';
    default:
      return category;
  }
};

const ManageNews = () => {
  const { currentUser } = useAuth();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    category: 'announcement' as News['category'],
    contentHtml: '',
    imageUrl: '',
    imageCloudinaryId: '',
  });
  const isCloudinaryConfigured = cloudinaryService.isConfigured();

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const data = await newsService.getAll();
      setNews(data);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error loading news:', error);
      alert('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const contentLines = extractParagraphsFromHtml(formData.contentHtml);
      const newsData = {
        title: formData.title,
        date: formData.date,
        category: formData.category,
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
        await newsService.update(editingId, newsData);
      } else {
        await newsService.create(newsData);
      }

      resetForm();
      loadNews();
      alert(editingId ? 'News updated!' : 'News created!');
    } catch (error) {
      console.error('Error saving news:', error);
      alert('Failed to save news');
    }
  };

  const handleEdit = (newsItem: News) => {
    setFormData({
      title: newsItem.title,
      date: newsItem.date,
      category: newsItem.category,
      contentHtml: newsItem.contentHtml || toHtmlFromContent(newsItem.content),
      imageUrl: newsItem.image?.url || '',
      imageCloudinaryId: newsItem.image?.cloudinaryId || '',
    });
    setEditingId(newsItem.id);
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
    if (!confirm('Are you sure you want to delete this news item?')) return;

    try {
      await newsService.delete(id);
      loadNews();
      alert('News deleted!');
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('Failed to delete news');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      category: 'announcement',
      contentHtml: '',
      imageUrl: '',
      imageCloudinaryId: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const totalPages = Math.ceil(news.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNews = news.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (!currentUser) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="manage-announcements">
        <header className="page-header">
          <h1>Manage News</h1>
          <button onClick={() => setShowForm(!showForm)} className="add-button">
            <Plus size={20} />
            New Article
          </button>
        </header>

        {showForm && (
          <div className="form-overlay">
            <div className="form-container">
              <div className="form-header">
                <h2>{editingId ? 'Edit News' : 'New News'}</h2>
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
                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter news title"
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Date *</label>
                        <input
                          type="text"
                          value={formData.date}
                          onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                          placeholder="e.g., March 15, 2024"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Category *</label>
                        <select
                          value={formData.category}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              category: e.target.value as News['category'],
                            }))
                          }
                        >
                          <option value="announcement">Achievements</option>
                          <option value="event">Event</option>
                          <option value="activity">Activity</option>
                          <option value="partnership">Partnership</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Content *</label>
                      <RichTextEditor
                        value={formData.contentHtml}
                        onChange={(value) => setFormData((prev) => ({ ...prev, contentHtml: value }))}
                        placeholder="Write the news content here..."
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
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, imageUrl: '', imageCloudinaryId: '' }))
                              }
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                        {isCloudinaryConfigured ? (
                          <ImageUploader
                            onImageUpload={handleImageUpload}
                            folder="cit_news"
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
                            <small>
                              Cloudinary is not configured. You can still publish without an image, or paste an image URL.
                            </small>
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
                    {editingId ? 'Update' : 'Create'} News
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="announcements-list">
          {loading ? (
            <div className="loading-state">Loading news...</div>
          ) : news.length === 0 ? (
            <div className="empty-state">
              <p>No news yet. Create your first one!</p>
            </div>
          ) : (
            paginatedNews.map((newsItem) => (
              <div key={newsItem.id} className="announcement-card">
                {newsItem.image?.url && (
                  <div className="announcement-image">
                    <img src={newsItem.image.url} alt={newsItem.title} />
                  </div>
                )}
                <div className="announcement-details">
                  <div className="announcement-header">
                    <div className="announcement-header-content">
                      <h3>{newsItem.title}</h3>
                      <div className="announcement-meta">
                        <span className={`type-badge ${newsItem.category}`}>
                          {getCategoryLabel(newsItem.category)}
                        </span>
                        <span className="date">{newsItem.date}</span>
                      </div>
                    </div>
                    <div className="announcement-actions">
                      <button onClick={() => handleEdit(newsItem)} className="edit-btn">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(newsItem.id)} className="delete-btn">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="announcement-content">
                    <p>
                      {(newsItem.contentHtml
                        ? getPlainTextFromHtml(newsItem.contentHtml)
                        : newsItem.content.join(' ')
                      ).slice(0, 220)}
                      ...
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {!loading && news.length > 0 && totalPages > 1 && (
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

export default ManageNews;
