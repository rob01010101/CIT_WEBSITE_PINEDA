import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { imageService } from '../services/imageService';
import type { CloudinaryUploadResponse } from '../services/cloudinaryService';
import ImageUploader from '../components/ImageUploader';
import AdminLayout from '../components/AdminLayout';
import type { GalleryImage } from '../types';
import { Plus, Trash2, X } from 'lucide-react';
import './ManageGalleries.css';

const ManageGalleries = () => {
  const { currentUser } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<GalleryImage['category']>('home-gallery');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'home-gallery' as GalleryImage['category'],
    previewIcon: '',
  });
  const [uploadedImages, setUploadedImages] = useState<CloudinaryUploadResponse[]>([]);

  const categories: { value: GalleryImage['category']; label: string }[] = [
    { value: 'home-gallery', label: 'Home Gallery' },
    { value: 'about-featured', label: 'About Featured Images' },
    { value: 'awards-recognitions', label: 'Hall of Fame Awards' },
    { value: 'announcements', label: 'Announcement Thumbnails' },
  ];

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await imageService.getAll();
      setImages(data);
    } catch (error) {
      console.error('Error loading images:', error);
      alert('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleImagesUpload = (imagesData: CloudinaryUploadResponse[]) => {
    setUploadedImages(prev => [...prev, ...imagesData]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedImages.length === 0) {
      alert('Please upload at least one image first');
      return;
    }

    try {
      const categoryCount = images.filter(img => img.category === formData.category).length;

      const createPayloads: Omit<GalleryImage, 'id' | 'uploadedAt'>[] = uploadedImages.map((image, index) => ({
        title: uploadedImages.length > 1 ? `${formData.title} ${index + 1}` : formData.title,
        url: image.secure_url,
        cloudinaryId: image.public_id,
        category: formData.category,
        previewIcon: formData.previewIcon,
        displayOrder: categoryCount + index + 1,
      }));

      await Promise.all(createPayloads.map(payload => imageService.create(payload)));
      resetForm();
      loadImages();
      alert(`${uploadedImages.length} image(s) added to gallery!`);
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Failed to save image');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await imageService.delete(id);
      loadImages();
      alert('Image deleted!');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'home-gallery',
      previewIcon: '',
    });
    setUploadedImages([]);
    setShowForm(false);
  };

  if (!currentUser) {
    return null;
  }

  const categoryImages = images.filter(img => img.category === selectedCategory);

  return (
    <AdminLayout>
    <div className="manage-galleries">
      <header className="page-header">
        <h1>Manage Galleries</h1>
        <button onClick={() => setShowForm(!showForm)} className="add-button">
          <Plus size={20} />
          Add Images
        </button>
      </header>

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header">
              <h2>Add Images to Gallery</h2>
              <button onClick={resetForm} className="close-button">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Image Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter image title"
                    required
                  />
                  <small className="form-hint">For multiple images, numbers will be appended automatically</small>
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as GalleryImage['category'] }))}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Upload Images *</label>
                  <ImageUploader
                    onImagesUpload={handleImagesUpload}
                    folder="cit_gallery"
                    maxSizeMB={0}
                    multiple
                  />
                  {uploadedImages.length > 0 && (
                    <div className="upload-summary">
                      <div className="summary-badge">
                        {uploadedImages.length} {uploadedImages.length === 1 ? 'image' : 'images'} ready to upload
                      </div>
                      <div className="uploaded-previews">
                        {uploadedImages.map((image, index) => (
                          <div className="uploaded-preview" key={`${image.public_id}-${index}`}>
                            <img src={image.secure_url} alt={`Preview ${index + 1}`} />
                            <div className="preview-overlay">
                              <span>#{index + 1}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="submit-btn">
                <Plus size={18} />
                Save {uploadedImages.length > 0 ? uploadedImages.length : ''} Image{uploadedImages.length !== 1 ? 's' : ''} to Gallery
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="gallery-container">
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`tab ${selectedCategory === cat.value ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading images...</p>
          </div>
        ) : categoryImages.length === 0 ? (
          <div className="empty-state">
            <p>No images in this category yet.</p>
            <small>Click "Add Images" above to upload images to this gallery</small>
          </div>
        ) : (
          <div className="images-grid">
            {categoryImages
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((image) => (
              <div key={image.id} className="image-card">
                <div className="image-preview">
                  <img src={image.url} alt={image.title} />
                  <div className="image-overlay">
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="delete-overlay-btn"
                      title="Delete image"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <div className="image-info">
                  <h3>{image.title}</h3>
                  <div className="image-meta">
                    <span className="order-badge">#{image.displayOrder}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </AdminLayout>
  );
};

export default ManageGalleries;
