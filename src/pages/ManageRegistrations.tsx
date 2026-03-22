import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { registrationService } from '../services/registrationService';
import AdminLayout from '../components/AdminLayout';
import type { EventRegistration } from '../types';
import { Users, Trash2, Calendar, Mail, Phone } from 'lucide-react';
import './ManageRegistrations.css';

const ManageRegistrations = () => {
  const { currentUser } = useAuth();
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupByEvent, setGroupByEvent] = useState(true);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      const data = await registrationService.getAll();
      setRegistrations(data);
    } catch (error) {
      console.error('Error loading registrations:', error);
      alert('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) return;
    
    try {
      await registrationService.delete(id);
      loadRegistrations();
      alert('Registration deleted!');
    } catch (error) {
      console.error('Error deleting registration:', error);
      alert('Failed to delete registration');
    }
  };

  const groupedRegistrations = groupByEvent
    ? registrations.reduce((acc, reg) => {
        if (!acc[reg.eventTitle]) {
          acc[reg.eventTitle] = [];
        }
        acc[reg.eventTitle].push(reg);
        return acc;
      }, {} as Record<string, EventRegistration[]>)
    : {};

  if (!currentUser) {
    return null;
  }

  return (
    <AdminLayout>
    <div className="manage-registrations">
      <header className="page-header">
        <h1>Event Registrations</h1>
        <button 
          onClick={() => setGroupByEvent(!groupByEvent)} 
          className="toggle-button"
        >
          {groupByEvent ? 'Show All' : 'Group by Event'}
        </button>
      </header>

      <div className="registrations-container">
        {loading ? (
          <div className="loading">Loading registrations...</div>
        ) : registrations.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <p>No registrations yet.</p>
          </div>
        ) : groupByEvent ? (
          Object.entries(groupedRegistrations).map(([eventTitle, regs]) => (
            <div key={eventTitle} className="event-group">
              <div className="event-group-header">
                <div>
                  <h2>{eventTitle}</h2>
                  <p className="registration-count">
                    <Users size={16} />
                    {regs.length} {regs.length === 1 ? 'registration' : 'registrations'}
                  </p>
                </div>
              </div>
              
              <div className="registrations-grid">
                {regs.map(registration => (
                  <div key={registration.id} className="registration-card">
                    <div className="card-header">
                      <h3>{registration.name}</h3>
                      <button 
                        onClick={() => handleDelete(registration.id)}
                        className="delete-button"
                        title="Delete registration"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="card-content">
                      <div className="info-row">
                        <Mail size={16} />
                        <a href={`mailto:${registration.email}`}>{registration.email}</a>
                      </div>
                      {registration.phone && (
                        <div className="info-row">
                          <Phone size={16} />
                          <a href={`tel:${registration.phone}`}>{registration.phone}</a>
                        </div>
                      )}
                      <div className="info-row">
                        <Calendar size={16} />
                        <span>{new Date(registration.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="registrations-list">
            {registrations.map(registration => (
              <div key={registration.id} className="registration-item">
                <div className="item-header">
                  <div>
                    <h3>{registration.name}</h3>
                    <p className="event-title">{registration.eventTitle}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(registration.id)}
                    className="delete-button"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="item-content">
                  <div className="info-row">
                    <Mail size={16} />
                    <a href={`mailto:${registration.email}`}>{registration.email}</a>
                  </div>
                  {registration.phone && (
                    <div className="info-row">
                      <Phone size={16} />
                      <a href={`tel:${registration.phone}`}>{registration.phone}</a>
                    </div>
                  )}
                  <div className="info-row">
                    <Calendar size={16} />
                    <span>{new Date(registration.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </AdminLayout>
  );
};

export default ManageRegistrations;
