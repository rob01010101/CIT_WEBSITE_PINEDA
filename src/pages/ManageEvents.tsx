import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../services/eventService';
import type { Event } from '../types';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import './ManageEvents.css';

const ManageEvents = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    attendees: 0,
    type: 'upcoming' as Event['type'],
    category: 'seminar' as Event['category']
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAll();
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
      alert('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await eventService.update(editingId, formData);
      } else {
        await eventService.create(formData);
      }

      resetForm();
      loadEvents();
      alert(editingId ? 'Event updated!' : 'Event created!');
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event');
    }
  };

  const handleEdit = (event: Event) => {
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      attendees: event.attendees || 0,
      type: event.type,
      category: event.category
    });
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await eventService.delete(id);
      loadEvents();
      alert('Event deleted!');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      attendees: 0,
      type: 'upcoming',
      category: 'seminar'
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <AdminLayout>
    <div className="manage-events">
      <header className="page-header">
        <h1>Manage Events</h1>
        <button onClick={() => setShowForm(!showForm)} className="add-button">
          <Plus size={20} />
          New Event
        </button>
      </header>

      {showForm && (
        <div className="form-container">
          <div className="form-header">
            <h2>{editingId ? 'Edit Event' : 'New Event'}</h2>
            <button onClick={resetForm} className="close-button">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  placeholder="e.g., March 20, 2024"
                  required
                />
              </div>

              <div className="form-group">
                <label>Time</label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  placeholder="e.g., 9:00 AM - 4:00 PM"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expected Attendees</label>
                <input
                  type="number"
                  value={formData.attendees}
                  onChange={(e) => setFormData(prev => ({ ...prev, attendees: parseInt(e.target.value) || 0 }))}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Event['type'] }))}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="past">Past</option>
                </select>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Event['category'] }))}
                >
                  <option value="seminar">Seminar</option>
                  <option value="workshop">Workshop</option>
                  <option value="competition">Competition</option>
                  <option value="conference">Conference</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={resetForm} className="cancel-button">
                Cancel
              </button>
              <button type="submit" className="save-button">
                <Save size={20} />
                {editingId ? 'Update' : 'Create'} Event
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="events-list">
        {loading ? (
          <div className="loading">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <p>No events yet. Create your first one!</p>
          </div>
        ) : (
          events.map(event => (
            <div key={event.id} className="event-item">
              <div className="event-header">
                <div>
                  <h3>{event.title}</h3>
                  <p className="event-meta">
                    <span className={`category-badge ${event.category}`}>{event.category}</span>
                    <span className={`type-badge ${event.type}`}>{event.type}</span>
                    <span className="date">{event.date} • {event.time}</span>
                  </p>
                </div>
                <div className="event-actions">
                  <button onClick={() => handleEdit(event)} className="edit-button">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(event.id)} className="delete-button">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="event-content">
                <p><strong>Location:</strong> {event.location}</p>
                <p>{event.description}</p>
                {event.attendees && event.attendees > 0 && (
                  <p><strong>Expected Attendees:</strong> {event.attendees}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>    </AdminLayout>  );
};

export default ManageEvents;
