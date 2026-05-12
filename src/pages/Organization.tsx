import { useState, useEffect } from 'react';
import { Users, UserCheck, FileText, Building2, Search, Target, Eye } from 'lucide-react';
import { staffService } from '../services/staffService';
import type { Staff } from '../types';
import './Organization.css';

const Organization = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const normalize = (value: string) => value.toLowerCase();
  const searchValue = normalize(searchTerm.trim());

  const filteredStaff = staffList.filter((staff) => {
    if (!searchValue) return true;
    const haystack = normalize(
      `${staff.name} ${staff.position} ${staff.department ?? ''} ${staff.role}`
    );
    return haystack.includes(searchValue);
  });

  const groupedStaff = filteredStaff.reduce((acc, staff) => {
    if (!acc[staff.role]) {
      acc[staff.role] = [];
    }
    acc[staff.role].push(staff);
    return acc;
  }, {} as Record<string, Staff[]>);

  const getRoleCount = (role: string) => staffList.filter((staff) => staff.role === role).length;
  const deanCount = getRoleCount('Dean');
  const secretaryCount = getRoleCount('Secretary');
  const facultyCount = getRoleCount('Faculty');

  const leadershipRoles = ['Dean', 'Secretary'];
  const facultyRole = 'Faculty';

  const summaryStats = [
    { icon: UserCheck, label: 'Dean', value: deanCount || 0 },
    { icon: FileText, label: 'Secretary', value: secretaryCount || 0 },
    { icon: Users, label: 'Faculty', value: facultyCount || 0 },
    { icon: Building2, label: 'College', value: 'CIT' }
  ];

  const sortByOrder = (items: Staff[]) =>
    [...items].sort((a, b) => a.displayOrder - b.displayOrder);

  const leadershipData = leadershipRoles
    .map((role) => ({
      role,
      members: groupedStaff[role] ? sortByOrder(groupedStaff[role]) : []
    }))
    .filter((section) => section.members.length > 0);

  const getRoleClassName = (role: string) => role.toLowerCase().replace(/\s+/g, '-');

  const renderStaffCard = (staff: Staff, variant: 'leadership' | 'faculty') => (
    <div
      key={staff.id}
      className={`staff-card ${variant === 'leadership' ? 'leadership-card' : 'faculty-card'}`}
    >
      <div className="staff-avatar">
        {staff.image?.url ? (
          <img src={staff.image.url} alt={staff.name} className="staff-image" />
        ) : (
          <div className="avatar-placeholder">{staff.name.charAt(0).toUpperCase()}</div>
        )}
      </div>
      <div className="staff-info">
        <h3>{staff.name}</h3>
        <p className="staff-position">{staff.position}</p>
        <div className="staff-tags">
          <span className={`staff-tag ${staff.fullTime ? 'full-time' : 'part-time'}`}>
            {staff.fullTime ? 'Full-time' : 'Part-time'}
          </span>
          {staff.department && <span className="staff-tag neutral">{staff.department}</span>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="organization-page">
      <section className="organization-hero">
        <div className="organization-hero-content">
          <div className="organization-hero-text">
            <span className="organization-pill">College of Information Technology</span>
            <h1>Our Organization</h1>
            <p>
              The College of Information Technology is composed of dedicated leaders, faculty, and staff who work together to deliver quality education, foster innovation, and inspire future IT professionals.
            </p>
          </div>
          <div className="organization-hero-stats">
            {summaryStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="hero-stat">
                  <div className="hero-stat-icon">
                    <Icon size={20} />
                  </div>
                  <div className="hero-stat-value">{stat.value}</div>
                  <div className="hero-stat-label">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="organization-section">
        <div className="organization-container">
          <div className="organization-search">
            <div className="search-input">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by name, position, department, or role..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="loading-state">Loading staff information...</div>
          ) : filteredStaff.length === 0 ? (
            <div className="empty-state">
              <p>No staff information available at this time.</p>
            </div>
          ) : (
            <div className="organization-content">
              <div className="organization-main">
                {leadershipData.length > 0 && (
                  <section className="organization-tree">
                    <div className="tree-title-wrap">
                      <h2>Organization Tree</h2>
                      <p>Leadership structure of the College of Information Technology</p>
                    </div>
                    <div className="tree-structure">
                      {leadershipData.map((section, index) => (
                        <div
                          key={section.role}
                          className={`tree-level tree-level-${getRoleClassName(section.role)}`}
                        >
                          <span className="role-badge">{section.role}</span>
                          <div className={`tree-row ${section.members.length > 1 ? 'multiple' : 'single'}`}>
                            {section.members.map((staff) => renderStaffCard(staff, 'leadership'))}
                          </div>
                          {index < leadershipData.length - 1 && (
                            <div className="tree-connector" aria-hidden="true" />
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {groupedStaff[facultyRole] && groupedStaff[facultyRole].length > 0 && (
                  <section className="faculty-section">
                    <div className="faculty-header">
                      <h2>Faculty</h2>
                      <span>{groupedStaff[facultyRole].length} members</span>
                    </div>
                    <div className="faculty-grid">
                      {sortByOrder(groupedStaff[facultyRole]).map((staff) =>
                        renderStaffCard(staff, 'faculty')
                      )}
                    </div>
                  </section>
                )}

                <section className="organization-highlights">
                  <div className="info-card">
                    <div className="info-card-icon">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3>About Our College</h3>
                      <p>The College of Information Technology is committed to academic excellence, innovation, and the development of future-ready IT professionals.</p>
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-card-icon">
                      <Target size={20} />
                    </div>
                    <div>
                      <h3>Our Mission</h3>
                      <p>To provide quality IT education that develops innovative, ethical, and globally competitive professionals.</p>
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-card-icon">
                      <Eye size={20} />
                    </div>
                    <div>
                      <h3>Our Vision</h3>
                      <p>To be a premier center of excellence in information technology education and research.</p>
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-card-icon">
                      <Users size={20} />
                    </div>
                    <div>
                      <h3>Our Commitment</h3>
                      <p>We are committed to academic excellence, continuous improvement, and nation-building through technology.</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Organization;
