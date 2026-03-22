import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import type { Event } from '../types';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await eventService.getAll();
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = (event: Event) => {
    setSelectedEvent(event);
    setShowRegistrationForm(true);
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setIsSubmitting(true);
    try {
      await registrationService.create({
        eventId: selectedEvent.id,
        eventTitle: selectedEvent.title,
        ...registrationData
      });
      alert('Registration successful! We will send you a confirmation email.');
      setRegistrationData({ name: '', email: '', phone: '' });
      setShowRegistrationForm(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('Failed to register. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const communityEventImages = [
    '/community_events_images/597478583_1361822645957116_3458253094588781467_n.jpg',
    '/community_events_images/597737157_1361822642623783_6960097381551651774_n.jpg',
    '/community_events_images/597775316_1361822549290459_3722301270097540960_n.jpg',
    '/community_events_images/597854651_1361822552623792_8411448789423785385_n.jpg',
    '/community_events_images/597932517_1361822649290449_2811507370633927311_n.jpg',
    '/community_events_images/597945574_1361822245957156_6553648366429472119_n.jpg',
    '/community_events_images/598028925_1361822339290480_5889155525264263028_n.jpg',
    '/community_events_images/600140091_1361822269290487_9192617567910788173_n.jpg'
  ];

  const studentActivityImages = [
    '/student_activities_images/Student Activities.jpg',
    '/student_activities_images/Student Activities1.jpg',
    '/student_activities_images/486260025_1137436368395746_1262322134438329341_n.jpg',
    '/student_activities_images/486481229_1137436315062418_6289813631646890680_n.jpg',
    '/student_activities_images/486640201_1137436055062444_2113061809207738559_n.jpg',
    '/student_activities_images/486709516_1137436028395780_6846826846539764922_n.jpg',
    '/student_activities_images/589953396_1347998430672871_601116659293660751_n.jpg',
    '/student_activities_images/591750812_1348005974005450_2170312604018908075_n.jpg'
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'seminar': return '#9c27b0';
      case 'workshop': return '#2196f3';
      case 'competition': return '#f44336';
      case 'conference': return '#ff9800';
      default: return '#1a237e';
    }
  };

  return (
    <div className="events-page">
      {/* Hero Section */}
      <section className="events-hero">
        <h1>Events</h1>
        <p>College of Information Technology</p>
        <p>Discover workshops, seminars, competitions, and conferences at CIT</p>
      </section>

      {/* Events Grid */}
      <section className="events-section">
        <div className="events-container">
          <div className="events-header">
            <h2>Upcoming Events</h2>
            <p>Mark your calendar for these exciting opportunities</p>
          </div>
          
          {loading ? (
            <div className="loading-state">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="empty-state">
              <p>No events available at this time. Check back soon!</p>
            </div>
          ) : (
            <div className="events-grid">
              {events.map((event) => (
              <article key={event.id} className="event-card">
                <div 
                  className="event-category-bar"
                  style={{ backgroundColor: getCategoryColor(event.category) }}
                />
                <div className="event-content">
                  <span 
                    className="event-category-badge"
                    style={{ 
                      backgroundColor: `${getCategoryColor(event.category)}15`,
                      color: getCategoryColor(event.category)
                    }}
                  >
                    {event.category}
                  </span>
                  <h3>{event.title}</h3>
                  <p className="event-description">{event.description}</p>
                  
                  <div className="event-details">
                    <div className="event-detail">
                      <Calendar size={16} />
                      <span>{event.date}</span>
                    </div>
                    <div className="event-detail">
                      <Clock size={16} />
                      <span>{event.time}</span>
                    </div>
                    <div className="event-detail">
                      <MapPin size={16} />
                      <span>{event.location}</span>
                    </div>
                    {event.attendees && (
                      <div className="event-detail">
                        <Users size={16} />
                        <span>{event.attendees} expected attendees</span>
                      </div>
                    )}
                  </div>

                  <button 
                    className="event-register-btn"
                    onClick={() => handleRegisterClick(event)}
                  >
                    Register Now <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* Community Events Gallery */}
      <section className="events-gallery-section">
        <div className="gallery-container">
          <h2>Community Events</h2>
          <p>CIT students engaging with the community through outreach programs and service activities</p>
          <div className="events-image-gallery">
            {communityEventImages.map((img, index) => (
              <div key={index} className="gallery-image-item">
                <img src={img} alt={`Community Event ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Activities Gallery */}
      <section className="student-activities-section">
        <div className="gallery-container">
          <h2>Student Activities</h2>
          <p>Capturing moments of learning, collaboration, and growth at CIT</p>
          <div className="events-image-gallery">
            {studentActivityImages.map((img, index) => (
              <div key={index} className="gallery-image-item">
                <img src={img} alt={`Student Activity ${index + 1}`} />
              </div>
            ))}

      {/* Registration Modal */}
      {showRegistrationForm && selectedEvent && (
        <div className="registration-modal-overlay" onClick={() => setShowRegistrationForm(false)}>
          <div className="registration-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Register for Event</h2>
            <h3>{selectedEvent.title}</h3>
            <p className="event-info">{selectedEvent.date} • {selectedEvent.time}</p>
            
            <form onSubmit={handleRegistrationSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={registrationData.name}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={registrationData.phone}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setShowRegistrationForm(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="register-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Registering...' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
