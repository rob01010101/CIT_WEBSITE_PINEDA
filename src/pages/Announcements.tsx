import { useState, useEffect, useMemo } from 'react';
import { Calendar, Tag, Image as ImageIcon } from 'lucide-react';
import { announcementService } from '../services/announcementService';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import type { Announcement } from '../types';
import './Announcements.css';

const ITEMS_PER_PAGE = 10;

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  useEffect(() => {
    if (announcements.length === 0) {
      return;
    }

    const hash = window.location.hash.replace('#', '');
    if (!hash) {
      return;
    }

    const target = document.getElementById(hash);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [announcements]);

  const loadAnnouncements = async () => {
    try {
      const data = await announcementService.getAll();
      setAnnouncements(data);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((announcement) =>
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (announcement.contentHtml || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.join(' ').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [announcements, searchQuery]);

  const totalPages = Math.ceil(filteredAnnouncements.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAnnouncements = filteredAnnouncements.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'important': return 'Important';
      case 'achievement': return 'Achievement';
      case 'event': return 'Event';
      case 'facility': return 'Facility Update';
      default: return type;
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="announcements-page">
      {/* Hero Section */}
      <section className="announcements-hero">
        <h1>All Announcements</h1>
        <p>College of Information Technology</p>
        <p>Stay updated with the latest news and events from CIT</p>
      </section>

      {/* Search Bar */}
      <section className="announcements-search-section">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search announcements by title or date..."
        />
      </section>

      {/* Announcements List */}
      <section className="announcements-list">
        <div className="announcements-container">
          {loading ? (
            <div className="loading-state">Loading announcements...</div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="empty-state">
              <p>
                {searchQuery
                  ? 'No announcements match your search.'
                  : 'No announcements available at this time.'}
              </p>
            </div>
          ) : (
            paginatedAnnouncements.map((announcement) => (
              <article id={announcement.id} key={announcement.id} className={`announcement-item ${announcement.type}`}>
                {announcement.image?.url && (
                  <div className="announcement-image">
                    <img
                      src={announcement.image.url}
                      alt={announcement.title}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="announcement-header">
                  <div className="announcement-meta">
                    <span className="announcement-date-badge">
                      <Calendar size={14} />
                      {announcement.date}
                    </span>
                  </div>
                  <span className={`announcement-type-badge ${announcement.type}`}>
                    <Tag size={12} />
                    {getTypeLabel(announcement.type)}
                  </span>
                </div>
                <h2>{announcement.title}</h2>
                {!announcement.image?.url && (
                  <div className="announcement-placeholder-icon">
                    <ImageIcon size={32} />
                  </div>
                )}
                <div className="announcement-content">
                  {announcement.contentHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: announcement.contentHtml }} />
                  ) : (
                    announcement.content.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))
                  )}
                </div>
              </article>
            ))
          )}
        </div>

        {filteredAnnouncements.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </section>
    </div>
  );
};

export default Announcements;
