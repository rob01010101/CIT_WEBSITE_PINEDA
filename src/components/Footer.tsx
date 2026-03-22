import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Youtube, MessageCircle } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-section">
            <h3>About CIT</h3>
            <p>
              College of Information Technology at the University of the Assumption.
              Empowering the next generation of IT professionals through quality 
              education, innovation, and hands-on experience.
            </p>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/announcements">Announcements</Link></li>
              <li><Link to="/hall-of-fame">Hall of Fame</Link></li>
              <li><Link to="/events">Events</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Us</h3>
            <ul className="contact-list">
              <li>
                <Mail size={16} />
                <a href="mailto:cit@ua.edu.ph">cit@ua.edu.ph</a>
              </li>
              <li>
                <Phone size={16} />
                <span>+63 (45) 961-1196</span>
              </li>
              <li>
                <Phone size={16} />
                <span>UA: 9613617 | CIT Local: 314</span>
              </li>
              <li>
                <MapPin size={16} />
                <span>University of the Assumption, MacArthur Highway, City of San Fernando, Pampanga</span>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="#" aria-label="Facebook" className="social-link">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="YouTube" className="social-link">
                <Youtube size={20} />
              </a>
              <a href="#" aria-label="Discord" className="social-link">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-content">
            <div className="footer-contact-bar">
              <span><Mail size={14} /> cit@ua.edu.ph</span>
              <span><Phone size={14} /> +63 (45) 961-1196</span>
              <span><MapPin size={14} /> San Fernando, Pampanga</span>
            </div>
            <p>&copy; 2025 College of Information Technology, University of the Assumption. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
