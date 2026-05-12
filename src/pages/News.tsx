import { useEffect, useMemo, useState } from 'react';
import { Calendar, Image as ImageIcon, Tag } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import { announcementService } from '../services/announcementService';
import type { Announcement } from '../types';
import './News.css';

const ITEMS_PER_PAGE = 9;

const CATEGORY_LABELS: Record<Announcement['type'], string> = {
  important: 'Achievements',
  event: 'Events',
  achievement: 'Activities',
  facility: 'Partnerships',
};

const NewsPage = () => {
  const [news, setNews] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | Announcement['type']>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await announcementService.getAll();
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
      const matchesCategory = activeCategory === 'all' || item.type === activeCategory;
      if (!matchesCategory) return false;

      const textContent = item.contentHtml
        ? new DOMParser().parseFromString(item.contentHtml, 'text/html').body.textContent || ''
        : item.content.join(' ');

      return (
        item.title.toLowerCase().includes(query) ||
        item.date.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query) ||
        textContent.toLowerCase().includes(query)
      );
    });
  }, [activeCategory, news, searchQuery]);

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNews = filteredNews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getExcerpt = (item: Announcement) => {
    const textContent = item.contentHtml
      ? new DOMParser().parseFromString(item.contentHtml, 'text/html').body.textContent || ''
      : item.content.join(' ');
    const trimmed = textContent.trim();
    if (!trimmed) return 'Stay tuned for more details about this update.';
    return trimmed.length > 160 ? `${trimmed.slice(0, 160)}...` : trimmed;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const categories: Array<{ value: 'all' | Announcement['type']; label: string }> = [
    { value: 'all', label: 'All News' },
    { value: 'important', label: 'Achievements' },
    { value: 'event', label: 'Events' },
    { value: 'achievement', label: 'Activities' },
    { value: 'facility', label: 'Partnerships' },
  ];

  return (
    <div className="news-page">
      <section className="news-hero">
        <h1>News</h1>
        <p>College of Information Technology</p>
        <p>Stories, updates, and highlights from the CIT community</p>
      </section>

      <section className="news-section">
        <div className="news-layout">
          <aside className="news-sidebar">
            <h3>Categories</h3>
            <div className="news-filter-list">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  className={`news-filter-item ${activeCategory === category.value ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(category.value);
                    setCurrentPage(1);
                  }}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </aside>

          <div className="news-content">
            <div className="news-search">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search news by title, category, or date..."
              />
            </div>

            {loading ? (
              <div className="loading-state">Loading news...</div>
            ) : filteredNews.length === 0 ? (
              <div className="empty-state">
                <p>{searchQuery ? 'No news matches your search.' : 'No news available yet.'}</p>
              </div>
            ) : (
              <div className="news-grid">
                {paginatedNews.map((item) => (
                  <article key={item.id} className="news-card">
                    <div className="news-card-image">
                      {item.image?.url ? (
                        <img src={item.image.url} alt={item.title} />
                      ) : (
                        <div className="news-image-placeholder">
                          <ImageIcon size={32} />
                        </div>
                      )}
                    </div>
                    <div className="news-card-body">
                      <div className="news-meta">
                        <span className="news-date">
                          <Calendar size={14} />
                          {item.date}
                        </span>
                        <span className={`news-category ${item.type}`}>
                          <Tag size={12} />
                          {CATEGORY_LABELS[item.type]}
                        </span>
                      </div>
                      <h2>{item.title}</h2>
                      <p>{getExcerpt(item)}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
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
