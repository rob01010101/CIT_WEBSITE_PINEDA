import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, FileText, Users, Home, Mail, UserCheck, Image, Menu, LayoutDashboard, Award } from 'lucide-react';
import './AdminLayout.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const menuSections = [
    {
      title: 'Content Management',
      items: [
        { icon: FileText, label: 'Announcements', path: '/admin/announcements' },
        { icon: Image, label: 'Galleries', path: '/admin/galleries' },
        { icon: Award, label: 'Capstone Projects', path: '/admin/projects' },
      ]
    },
    {
      title: 'People & Organization',
      items: [
        { icon: Users, label: 'Organization', path: '/admin/organization' },
      ]
    },
    {
      title: 'Communications',
      items: [
        { icon: Mail, label: 'Contact Messages', path: '/admin/contacts' },
        { icon: UserCheck, label: 'Registrations', path: '/admin/registrations' },
      ]
    }
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <LayoutDashboard size={24} />
            <h2>Admin Panel</h2>
          </div>
        </div>

        <nav className="sidebar-nav">
          {/* Dashboard - Always at top */}
          <div className="nav-section dashboard-section">
            <button 
              onClick={() => navigate('/admin/dashboard')} 
              className="nav-item dashboard-item"
              title="Dashboard"
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>
          </div>

          {menuSections.map((section, idx) => (
            <div key={idx} className="nav-section">
              <h3>{section.title}</h3>
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIdx}
                    onClick={() => navigate(item.path)}
                    className="nav-item"
                    title={item.label}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button 
            onClick={() => navigate('/')} 
            className="sidebar-action"
            title="Return to Website"
          >
            <Home size={20} />
            <span>Website</span>
          </button>
          <button 
            onClick={handleLogout} 
            className="sidebar-action logout"
            title="Logout"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Top Bar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button 
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
          <div className="topbar-right">
            <span className="user-badge">{currentUser?.email}</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
