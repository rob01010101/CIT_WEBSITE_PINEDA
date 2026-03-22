import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Lock } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About us' },
    { path: '/programs', label: 'Programs' },
    { path: '/announcements', label: 'Announcements' },
    { path: '/hall-of-fame', label: 'Hall of Fame' },
    { path: '/organization', label: 'Organization' },
    { path: '/faq', label: 'FAQ' },
    { path: '/contacts', label: 'Contacts' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-circle">
            <img src="/cit_logo.png" alt="College of Information Technology Logo" className="logo-image" />
          </div>
          <div className="logo-text">
            <span className="logo-title">College of Information Technology</span>
            <span className="logo-university">University of the Assumption</span>
          </div>
        </Link>

        <div className="navbar-right">
          <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link 
            to="/admin/login" 
            className="admin-login-icon"
            aria-label="Admin Login"
            title="Admin Login"
          >
            <Lock size={18} />
          </Link>

          <button 
            className="navbar-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
