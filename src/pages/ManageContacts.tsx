import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { contactService } from '../services/contactService';
import AdminLayout from '../components/AdminLayout';
import type { ContactMessage } from '../types';
import { Mail, Trash2, Check, Eye } from 'lucide-react';
import './ManageContacts.css';

const ManageContacts = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAll();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
      alert('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: ContactMessage['status']) => {
    try {
      await contactService.updateStatus(id, status);
      loadMessages();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await contactService.delete(id);
      setSelectedMessage(null);
      loadMessages();
      alert('Message deleted!');
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <AdminLayout>
    <div className="manage-contacts">
      <header className="page-header">
        <h1>Contact Messages</h1>
        <div></div>
      </header>

      <div className="contacts-container">
        <div className="messages-list">
          {loading ? (
            <div className="loading">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="empty-state">
              <Mail size={48} />
              <p>No messages yet.</p>
            </div>
          ) : (
            messages.map(message => (
              <div 
                key={message.id} 
                className={`message-item ${message.status} ${selectedMessage?.id === message.id ? 'selected' : ''}`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="message-header">
                  <div>
                    <h3>{message.name}</h3>
                    <p className="message-email">{message.email}</p>
                  </div>
                  <span className={`status-badge ${message.status}`}>
                    {message.status}
                  </span>
                </div>
                <p className="message-subject"><strong>Subject:</strong> {message.subject}</p>
                <p className="message-preview">{message.message.substring(0, 100)}...</p>
                <p className="message-date">
                  {new Date(message.createdAt).toLocaleDateString()} • {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>
            ))
          )}
        </div>

        {selectedMessage && (
          <div className="message-detail">
            <div className="detail-header">
              <h2>Message Details</h2>
              <button onClick={() => setSelectedMessage(null)} className="close-detail">×</button>
            </div>

            <div className="detail-content">
              <div className="detail-row">
                <label>From:</label>
                <p>{selectedMessage.name}</p>
              </div>

              <div className="detail-row">
                <label>Email:</label>
                <p><a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a></p>
              </div>

              <div className="detail-row">
                <label>Subject:</label>
                <p>{selectedMessage.subject}</p>
              </div>

              <div className="detail-row">
                <label>Date:</label>
                <p>{new Date(selectedMessage.createdAt).toLocaleString()}</p>
              </div>

              <div className="detail-row">
                <label>Status:</label>
                <span className={`status-badge ${selectedMessage.status}`}>
                  {selectedMessage.status}
                </span>
              </div>

              <div className="detail-message">
                <label>Message:</label>
                <div className="message-text">{selectedMessage.message}</div>
              </div>

              <div className="detail-actions">
                <button 
                  onClick={() => handleStatusChange(selectedMessage.id, 'read')}
                  className="action-button read"
                  disabled={selectedMessage.status === 'read'}
                >
                  <Eye size={18} />
                  Mark as Read
                </button>
                <button 
                  onClick={() => handleStatusChange(selectedMessage.id, 'replied')}
                  className="action-button replied"
                  disabled={selectedMessage.status === 'replied'}
                >
                  <Check size={18} />
                  Mark as Replied
                </button>
                <button 
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="action-button delete"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </AdminLayout>
  );
};

export default ManageContacts;
