import { useState, useEffect } from 'react';
import { Users, UserCheck } from 'lucide-react';
import { staffService } from '../services/staffService';
import type { Staff } from '../types';
import './Organization.css';

const Organization = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const data = await staffService.getAll();
      setStaffList(data);
    } catch (error) {
      console.error('Error loading staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupStaffByRole = () => {
    const grouped: { [key: string]: Staff[] } = {};
    staffList.forEach((staff) => {
      if (!grouped[staff.role]) {
        grouped[staff.role] = [];
      }
      grouped[staff.role].push(staff);
    });
    return grouped;
  };

  const roleOrder = ['Dean', 'Faculty', 'SSITE Officer'];
  const sortedRoles = roleOrder.filter((role) => Object.keys(groupStaffByRole()).includes(role));

  return (
    <div className="organization-page">
      {/* Hero Section */}
      <section className="organization-hero">
        <Users size={48} />
        <h1>Our Organization</h1>
        <p>College of Information Technology</p>
        <p>Meet the dedicated professionals leading CIT</p>
      </section>

      {/* Staff Directory */}
      <section className="organization-section">
        <div className="organization-container">
          {loading ? (
            <div className="loading-state">Loading staff information...</div>
          ) : staffList.length === 0 ? (
            <div className="empty-state">
              <p>No staff information available at this time.</p>
            </div>
          ) : (
            <div className="staff-directory">
              {sortedRoles.map((role) => (
                <div key={role} className="staff-section">
                  <h2 className={`staff-section-title role-${role.toLowerCase().replace(/\s+/g, '-')}`}>
                    <UserCheck size={24} />
                    {role}
                  </h2>
                  <div className="staff-grid">
                    {groupStaffByRole()[role]?.map((staff) => (
                      <div key={staff.id} className="staff-card">
                        <div className="staff-avatar">
                          {staff.image?.url ? (
                            <img
                              src={staff.image.url}
                              alt={staff.name}
                              className="staff-image"
                            />
                          ) : (
                            <div className="avatar-placeholder">
                              {staff.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <h3 className="staff-name">{staff.name}</h3>
                        <p className="staff-position">{staff.position}</p>
                        <div className="staff-meta">
                          <span className={`staff-type ${staff.fullTime ? 'full-time' : 'part-time'}`}>
                            {staff.fullTime ? 'Full-time' : 'Part-time'}
                          </span>
                          {staff.department && (
                            <span className="staff-department">{staff.department}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Organization;
