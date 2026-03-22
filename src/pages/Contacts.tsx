import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { contactService } from '../services/contactService';
import './Contacts.css';

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await contactService.create(formData);
      alert('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'cit@ua.edu.ph',
      link: 'mailto:cit@ua.edu.ph'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+63 (45) 961-1196',
      link: 'tel:+63459611196'
    },
    {
      icon: MapPin,
      title: 'Address',
      value: '2MQX+573, 11th Avenue\nSan Fernando City, Pampanga\nPhilippines',
      link: null
    }
  ];

  return (
    <div className="contacts-page">
      {/* Hero Section */}
      <section className="contacts-hero">
        <h1>Contact Us</h1>
        <p>College of Information Technology</p>
        <p>University of the Assumption</p>
      </section>

      {/* Contact Cards */}
      <section className="contacts-section">
        <div className="contacts-grid">
          {contactInfo.map((contact, index) => (
            <div key={index} className="contact-card">
              <div className="contact-icon">
                <contact.icon size={32} />
              </div>
              <h3>{contact.title}</h3>
              {contact.link ? (
                <a href={contact.link} className="contact-value">
                  {contact.value}
                </a>
              ) : (
                <p className="contact-value">{contact.value}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="map-container">
          <iframe
            title="CIT Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3855.5644089745584!2d120.68089731484407!3d15.027731089580456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396f7b7dbe7d09d%3A0x5e0f5b7b7d9e6e0a!2sSan%20Fernando%2C%20Pampanga!5e0!3m2!1sen!2sph!4v1620000000000!5m2!1sen!2sph"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="form-container">
          <h2>Send us a Message</h2>
          <p>Have questions? We'd love to hear from you!</p>
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  placeholder="Enter your name" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="Enter your email" 
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select 
                id="subject" 
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                required 
              >
                <option value="">-- Select a Subject --</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Admissions & Enrollment">Admissions & Enrollment</option>
                <option value="Others">Others</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                rows={5} 
                placeholder="Write your message here..."
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                required
              />
            </div>
            
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contacts;
