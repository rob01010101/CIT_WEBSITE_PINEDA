import { useNavigate } from 'react-router-dom';
import { FileText, Image, Users, Mail, UserCheck, ChevronRight, Award } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const quickAccessCards = [
    { icon: FileText, label: 'Announcements', color: '#3949ab', path: '/admin/announcements' },
    { icon: Image, label: 'Galleries', color: '#5e35b1', path: '/admin/galleries' },
    { icon: Award, label: 'Projects', color: '#7b1fa2', path: '/admin/projects' },
    { icon: Users, label: 'Organization', color: '#7e57c2', path: '/admin/organization' },
    { icon: Mail, label: 'Messages', color: '#9575cd', path: '/admin/contacts' },
  ];

  return (
    <AdminLayout>
      <div className="dashboard-page">
        {/* Welcome Card */}
        <div className="welcome-card">
          <div>
            <h2>Welcome back! 👋</h2>
            <p>Manage your website content and stay in control</p>
          </div>
        </div>

        {/* Quick Access Section */}
        <section className="content-section">
          <div className="section-header">
            <h3>Quick Access</h3>
          </div>
          <div className="quick-access-grid">
            {quickAccessCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <button
                  key={idx}
                  onClick={() => navigate(card.path)}
                  className="quick-access-card"
                  style={{ '--card-color': card.color } as React.CSSProperties}
                >
                  <div className="card-icon-wrapper">
                    <Icon size={28} />
                  </div>
                  <span>{card.label}</span>
                  <ChevronRight size={16} className="card-arrow" />
                </button>
              );
            })}
          </div>
        </section>

        {/* Detailed Management Section */}
        <section className="content-section">
          <div className="section-header">
            <h3>Management Tools</h3>
          </div>
          <div className="management-grid">
            <div className="management-item" onClick={() => navigate('/admin/announcements')}>
              <div className="item-icon">
                <FileText size={32} />
              </div>
              <div className="item-content">
                <h4>Announcements</h4>
                <p>Create, edit, and manage announcements. Keep your community updated with latest news.</p>
              </div>
              <ChevronRight className="item-arrow" size={20} />
            </div>

            <div className="management-item" onClick={() => navigate('/admin/galleries')}>
              <div className="item-icon">
                <Image size={32} />
              </div>
              <div className="item-content">
                <h4>Galleries</h4>
                <p>Upload and organize images for Home, About, and Hall of Fame sections.</p>
              </div>
              <ChevronRight className="item-arrow" size={20} />
            </div>

            <div className="management-item" onClick={() => navigate('/admin/projects')}>
              <div className="item-icon">
                <Award size={32} />
              </div>
              <div className="item-content">
                <h4>Capstone Projects</h4>
                <p>Manage and showcase student capstone projects in the Hall of Fame.</p>
              </div>
              <ChevronRight className="item-arrow" size={20} />
            </div>

            <div className="management-item" onClick={() => navigate('/admin/organization')}>
              <div className="item-icon">
                <Users size={32} />
              </div>
              <div className="item-content">
                <h4>Organization</h4>
                <p>Manage staff members, faculty, and organization structure.</p>
              </div>
              <ChevronRight className="item-arrow" size={20} />
            </div>

            <div className="management-item" onClick={() => navigate('/admin/contacts')}>
              <div className="item-icon">
                <Mail size={32} />
              </div>
              <div className="item-content">
                <h4>Messages</h4>
                <p>View and respond to contact inquiries from your website visitors.</p>
              </div>
              <ChevronRight className="item-arrow" size={20} />
            </div>

            <div className="management-item" onClick={() => navigate('/admin/registrations')}>
              <div className="item-icon">
                <UserCheck size={32} />
              </div>
              <div className="item-content">
                <h4>Registrations</h4>
                <p>Track and manage event registrations and Sign-ups.</p>
              </div>
              <ChevronRight className="item-arrow" size={20} />
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
