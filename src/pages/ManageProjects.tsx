import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { capstoneService } from '../services/capstoneService';
import type { CloudinaryUploadResponse } from '../services/cloudinaryService';
import ImageUploader from '../components/ImageUploader';
import AdminLayout from '../components/AdminLayout';
import type { CapstoneProject } from '../types';
import { Plus, Trash2, X, Edit2 } from 'lucide-react';
import './ManageProjects.css';

const ManageProjects = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState<CapstoneProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<CapstoneProject | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: 'CIT Research Team',
    year: new Date().getFullYear().toString(),
  });
  const [uploadedImage, setUploadedImage] = useState<CloudinaryUploadResponse | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await capstoneService.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
      alert('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (imagesData: CloudinaryUploadResponse[]) => {
    if (imagesData.length > 0) {
      setUploadedImage(imagesData[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingProject && !uploadedImage) {
      alert('Please upload a project image');
      return;
    }

    try {
      const projectData = {
        title: formData.title,
        description: formData.description,
        author: formData.author,
        year: formData.year,
        image: uploadedImage
          ? {
              url: uploadedImage.secure_url,
              cloudinaryId: uploadedImage.public_id,
            }
          : editingProject!.image,
        displayOrder: editingProject
          ? editingProject.displayOrder
          : projects.filter(p => p.year === formData.year).length + 1,
      };

      if (editingProject) {
        await capstoneService.update(editingProject.id, projectData);
        alert('Project updated successfully!');
      } else {
        await capstoneService.create(projectData);
        alert('Project added successfully!');
      }

      resetForm();
      loadProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    }
  };

  const handleEdit = (project: CapstoneProject) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      author: project.author,
      year: project.year,
    });
    setUploadedImage(null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await capstoneService.delete(id);
      loadProjects();
      alert('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      author: 'CIT Research Team',
      year: new Date().getFullYear().toString(),
    });
    setUploadedImage(null);
    setEditingProject(null);
    setShowForm(false);
  };

  if (!currentUser) {
    return null;
  }

  // Group projects by year
  const projectsByYear = projects.reduce((acc, project) => {
    if (!acc[project.year]) {
      acc[project.year] = [];
    }
    acc[project.year].push(project);
    return acc;
  }, {} as Record<string, CapstoneProject[]>);

  const years = Object.keys(projectsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  const currentYear = new Date().getFullYear();
  const suggestedYears = Array.from(
    new Set([
      ...years,
      (currentYear - 1).toString(),
      currentYear.toString(),
      (currentYear + 1).toString(),
    ])
  ).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <AdminLayout>
      <div className="manage-projects">
        <header className="page-header">
          <h1>Manage Capstone Projects</h1>
          <button onClick={() => setShowForm(!showForm)} className="add-button">
            <Plus size={20} />
            Add Project
          </button>
        </header>

        {showForm && (
          <div className="form-overlay">
            <div className="form-container">
              <div className="form-header">
                <h2>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
                <button onClick={resetForm} className="close-button">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Project Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., ResiLinked"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Year *</label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                      placeholder="e.g., 2024"
                      min="2000"
                      max="2100"
                      step="1"
                      list="project-year-options"
                      required
                    />
                    <datalist id="project-year-options">
                      {suggestedYears.map((year) => (
                        <option key={year} value={year} />
                      ))}
                    </datalist>
                  </div>

                  <div className="form-group full-width">
                    <label>Author/Team *</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                      placeholder="e.g., CIT Research Team"
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the capstone project..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Project Image {!editingProject && '*'}</label>
                    {editingProject && !uploadedImage && (
                      <div className="current-image">
                        <img src={editingProject.image.url} alt={editingProject.title} />
                        <small>Current image (upload a new one to replace)</small>
                      </div>
                    )}
                    <ImageUploader
                      onImagesUpload={handleImageUpload}
                      folder="cit_website/research_projects"
                      maxSizeMB={2}
                      multiple={false}
                    />
                    {uploadedImage && (
                      <div className="upload-preview">
                        <img src={uploadedImage.secure_url} alt="Preview" />
                        <small>New image ready to upload</small>
                      </div>
                    )}
                  </div>
                </div>

                <button type="submit" className="submit-btn">
                  <Plus size={18} />
                  {editingProject ? 'Update Project' : 'Add Project'}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="projects-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <p>No capstone projects yet.</p>
              <small>Click "Add Project" above to create your first project</small>
            </div>
          ) : (
            years.map(year => (
              <section key={year} className="year-section">
                <h2>{year} Capstone Projects</h2>
                <div className="projects-grid">
                  {projectsByYear[year]
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((project) => (
                      <div key={project.id} className="project-card">
                        <div className="project-image">
                          <img src={project.image.url} alt={project.title} />
                          <div className="image-overlay">
                            <button
                              onClick={() => handleEdit(project)}
                              className="edit-btn"
                              title="Edit project"
                            >
                              <Edit2 size={20} />
                            </button>
                            <button
                              onClick={() => handleDelete(project.id)}
                              className="delete-btn"
                              title="Delete project"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                        <div className="project-info">
                          <h3>{project.title}</h3>
                          <p className="project-description">{project.description}</p>
                          <div className="project-meta">
                            <span className="author">{project.author}</span>
                            <span className="order-badge">#{project.displayOrder}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageProjects;
