import { useEffect, useMemo, useState } from 'react';
import { Calendar, Image as ImageIcon, Tag } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import { newsService } from '../services/newsService';
import type { News } from '../types';
import './Announcements.css';

const ITEMS_PER_PAGE = 10;

const CATEGORY_LABELS: Record<News['category'], string> = {
  announcement: 'Achievements',
  event: 'Events',
  activity: 'Activities',
  partnership: 'Partnerships',
};

const NewsPage = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await newsService.getAll();
        setNews(data);
        setCurrentPage(1);
      } catch (error) {
        console.error('Error loading news:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const filteredNews = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return news.filter((item) => {
      const textContent = item.contentHtml ?? item.content.join(' ');

      return (
        item.title.toLowerCase().includes(query) ||
        item.date.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        textContent.toLowerCase().includes(query)
      );
    });
  }, [news, searchQuery]);

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNews = filteredNews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getCategoryLabel = (category: News['category']) => CATEGORY_LABELS[category] ?? category;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="announcements-page">
      <section className="announcements-hero">
        <h1>All News</h1>
        <p>College of Information Technology</p>
        <p>Stories, updates, and highlights from the CIT community</p>
      </section>

      <section className="announcements-search-section">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search news by title or date..."
        />
      </section>

      <section className="announcements-list">
        <div className="announcements-container">
          {loading ? (
            <div className="loading-state">Loading news...</div>
          ) : filteredNews.length === 0 ? (
            <div className="empty-state">
              <p>{searchQuery ? 'No news matches your search.' : 'No news available yet.'}</p>
            </div>
          ) : (
            paginatedNews.map((item) => (
              <article
                id={item.id}
                key={item.id}
                className={`announcement-item ${item.category}`}
              >
                {item.image?.url && (
                  <div className="announcement-image">
                    <img
                      src={item.image.url}
                      alt={item.title}
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="announcement-header">
                  <div className="announcement-meta">
                    <span className="announcement-date-badge">
                      <Calendar size={14} />
                      {item.date}
                    </span>
                  </div>
                  <span className={`announcement-type-badge ${item.category}`}>
                    <Tag size={12} />
                    {getCategoryLabel(item.category)}
                  </span>
                </div>
                <h2>{item.title}</h2>
                {!item.image?.url && (
                  <div className="announcement-placeholder-icon">
                    <ImageIcon size={32} />
                  </div>
                )}
                <div className="announcement-content">
                  {item.contentHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: item.contentHtml }} />
                  ) : (
                    item.content.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))
                  )}
                </div>
              </article>
            ))
          )}
        </div>

        {filteredNews.length > 0 && totalPages > 1 && (
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

export default NewsPage;
