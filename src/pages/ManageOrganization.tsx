import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { staffService } from '../services/staffService';
import { cloudinaryService } from '../services/cloudinaryService';
import AdminLayout from '../components/AdminLayout';
import ImageUploader from '../components/ImageUploader';
import type { Staff } from '../types';
import type { CloudinaryUploadResponse } from '../services/cloudinaryService';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import './ManageOrganization.css';

type StaffRole = 'Dean' | 'Faculty' | 'Secretary' | 'SSITE Officer';

const ManageOrganization = () => {
  const { currentUser } = useAuth();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Faculty' as StaffRole,
    position: '',
    fullTime: true,
    department: '',
    displayOrder: 1,
    image: undefined as { url: string; cloudinaryId?: string } | undefined,
  });
  const isCloudinaryConfigured = cloudinaryService.isConfigured();

  const roles: StaffRole[] = ['Dean', 'Faculty', 'Secretary', 'SSITE Officer'];

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const data = await staffService.getAll();
      setStaff(data);
    } catch (error) {
      console.error('Error loading staff:', error);
      alert('Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (uploadResponse: CloudinaryUploadResponse) => {
    setFormData(prev => ({
      ...prev,
      image: {
        url: uploadResponse.secure_url,
        cloudinaryId: uploadResponse.public_id,
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await staffService.update(editingId, formData);
        alert('Staff member updated!');
      } else {
        const maxOrder = Math.max(...staff.map(s => s.displayOrder), 0);
        await staffService.create({
          ...formData,
          displayOrder: maxOrder + 1,
        });
        alert('Staff member added!');
      }
      resetForm();
      loadStaff();
    } catch (error) {
      console.error('Error saving staff:', error);
      alert('Failed to save staff member');
    }
  };

  const handleEdit = (staffMember: Staff) => {
    setFormData({
      name: staffMember.name,
      role: staffMember.role as StaffRole,
      position: staffMember.position,
      fullTime: staffMember.fullTime,
      department: staffMember.department || '',
      displayOrder: staffMember.displayOrder,
      image: staffMember.image,
    });
    setEditingId(staffMember.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;

    try {
      await staffService.delete(id);
      loadStaff();
      alert('Staff member deleted!');
    } catch (error) {
      console.error('Error deleting staff:', error);
      alert('Failed to delete staff member');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: 'Faculty',
      position: '',
      fullTime: true,
      department: '',
      displayOrder: 1,
      image: undefined,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (!currentUser) {
    return null;
  }

  const groupedStaff = staff.reduce((acc, member) => {
    if (!acc[member.role]) {
      acc[member.role] = [];
    }
    acc[member.role].push(member);
    return acc;
  }, {} as Record<string, Staff[]>);

  return (
    <AdminLayout>
    <div className="manage-organization">
      <header className="page-header">
        <h1>Manage Organization</h1>
        <button onClick={() => setShowForm(!showForm)} className="add-button">
          <Plus size={20} />
          Add Staff Member
        </button>
      </header>

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header">
              <h2>{editingId ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
              <button onClick={resetForm} className="close-button">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-left">
                  <div className="form-group full-width">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Role *</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as typeof formData.role }))}
                      >
                        {roles.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Position/Title *</label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                        placeholder="e.g., Computer Science Head"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Department</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                    <div className="form-group">
                      <label>Display Order</label>
                      <input
                        type="number"
                        value={formData.displayOrder}
                        onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) }))}
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="checkbox-wrapper">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.fullTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, fullTime: e.target.checked }))}
                        />
                        <span className="checkbox-text">Full-time Position</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-right">
                  <div className="form-group">
                    <label>Profile Picture</label>
                    <div className="image-upload-section">
                      {formData.image?.url && (
                        <div className="image-preview">
                          <img src={formData.image.url} alt="Preview" />
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => setFormData(prev => ({ ...prev, image: undefined }))}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      {isCloudinaryConfigured ? (
                        <ImageUploader
                          onImageUpload={handleImageUpload}
                          folder="staff_images"
                          maxSizeMB={5}
                        />
                      ) : (
                        <>
                          <input
                            type="url"
                            value={formData.image?.url || ''}
                            onChange={(e) => {
                              const value = e.target.value.trim();
                              setFormData((prev) => ({
                                ...prev,
                                image: value ? { url: value } : undefined,
                              }));
                            }}
                            placeholder="Paste image URL (optional)"
                          />
                          <small>Cloudinary is not configured. You can still save staff without a photo, or paste an image URL.</small>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="submit-btn">
                <Save size={18} />
                {editingId ? 'Update' : 'Add'} Staff Member
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="staff-container">
        {loading ? (
          <div className="loading-state">Loading staff...</div>
        ) : staff.length === 0 ? (
          <div className="empty-state">
            <p>No staff members added yet.</p>
          </div>
        ) : (
          <div className="staff-sections">
            {roles.map(role => (
              groupedStaff[role] && groupedStaff[role].length > 0 && (
                <div key={role} className="staff-section">
                  <h2 className={`section-title role-${role.toLowerCase().replace(/\s+/g, '-')}`}>
                    {role}
                  </h2>
                  <div className="staff-table">
                    <div className="table-header">
                      <div className="col-name">Name</div>
                      <div className="col-position">Position</div>
                      <div className="col-department">Department</div>
                      <div className="col-type">Type</div>
                      <div className="col-order">Order</div>
                      <div className="col-actions">Actions</div>
                    </div>
                    {groupedStaff[role]
                      .sort((a, b) => a.displayOrder - b.displayOrder)
                      .map(member => (
                        <div key={member.id} className="table-row">
                          <div className="col-name">
                            <div className="name-cell">
                              {member.image?.url ? (
                                <img src={member.image.url} alt={member.name} className="table-avatar" />
                              ) : (
                                <div className="table-avatar-placeholder">
                                  {member.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <span>{member.name}</span>
                            </div>
                          </div>
                          <div className="col-position">{member.position}</div>
                          <div className="col-department">{member.department || '-'}</div>
                          <div className="col-type">
                            <span className={`badge ${member.fullTime ? 'full-time' : 'part-time'}`}>
                              {member.fullTime ? 'Full-time' : 'Part-time'}
                            </span>
                          </div>
                          <div className="col-order">{member.displayOrder}</div>
                          <div className="col-actions">
                            <button
                              onClick={() => handleEdit(member)}
                              className="edit-btn"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(member.id)}
                              className="delete-btn"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
    </AdminLayout>
  );
};

export default ManageOrganization;
