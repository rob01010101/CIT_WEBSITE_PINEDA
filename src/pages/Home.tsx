import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Laptop, 
  Calendar,
  ArrowRight,
  Image as ImageIcon,
  Lightbulb,
  Award,
  Briefcase,
  GraduationCap,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './Home.css';
import { announcementService } from '../services/announcementService';
import { imageService } from '../services/imageService';
import type { Announcement, GalleryImage } from '../types';

const Home = () => {
  const [activeGallery, setActiveGallery] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [galleryLoading, setGalleryLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await announcementService.getAll();
        // Get only the latest 3 announcements
        setAnnouncements(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const data = await imageService.getByCategory('home-gallery');
        setGalleryImages(data);
      } catch (error) {
        console.error('Error fetching home gallery images:', error);
      } finally {
        setGalleryLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  const whyChoose = [
    {
      icon: Briefcase,
      title: 'Industry-Relevant Skills',
      description: 'Hands-on learning using modern tools, frameworks, and technologies.'
    },
    {
      icon: Award,
      title: 'Student Excellence',
      description: 'Award-winning projects, hackathons, and academic achievements.'
    },
    {
      icon: GraduationCap,
      title: 'Expert Faculty',
      description: 'Guidance from experienced instructors and IT professionals.'
    },
    {
      icon: Lightbulb,
      title: 'Career-Ready Graduates',
      description: 'Preparing students for real-world challenges and IT careers.'
    }
  ];

  const openGallery = (categoryId: string) => {
    setActiveGallery(categoryId);
    setCurrentImageIndex(0);
  };

  const closeGallery = () => {
    setActiveGallery(null);
  };

  const nextImage = () => {
    if (galleryImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }
  };

  const prevImage = () => {
    if (galleryImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              College of Information<br />
              Technology
            </h1>
            <p className="hero-subtitle">Empowering the next generation of tech leaders</p>
            <div className="hero-buttons">
              <Link to="/hall-of-fame" className="btn btn-primary">
                Explore Student Projects
              </Link>
              <Link to="/announcements" className="btn btn-outline">
                View Announcements
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-icon-container">
              <Laptop size={80} />
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="announcements-section">
        <div className="section-header">
          <h2>Latest Announcements</h2>
          <Link to="/announcements" className="view-all">
            View all Announcements <ArrowRight size={16} />
          </Link>
        </div>
        <div className="announcements-grid">
          {loading ? (
            <p>Loading announcements...</p>
          ) : announcements.length === 0 ? (
            <p>No announcements available at the moment.</p>
          ) : (
            announcements.map((item) => (
              <article key={item.id} className="announcement-card">
                {item.image?.url ? (
                  <img src={item.image.url} alt={item.title} className="announcement-thumbnail" />
                ) : (
                  <div className="announcement-thumbnail-placeholder">
                    <ImageIcon size={36} />
                  </div>
                )}
                <div className="announcement-date">
                  <Calendar size={14} />
                  <span>{item.date}</span>
                </div>
                <h3>{item.title}</h3>
                <Link to={`/announcements#${item.id}`} className="announcement-read-more">
                  Read more &gt;
                </Link>
              </article>
            ))
          )}
        </div>
      </section>

      {/* CIT Life Gallery */}
      <section className="gallery-section">
        <div className="section-header centered">
          <h2>CIT Life Gallery</h2>
          <p>Moments that define our community</p>
        </div>
        <div className="gallery-grid">
          {galleryLoading ? (
            <p>Loading gallery...</p>
          ) : galleryImages.length === 0 ? (
            <p>No gallery images uploaded yet.</p>
          ) : (
            galleryImages.map((item, index) => (
              <div 
                key={item.id} 
                className="gallery-card"
                onClick={() => openGallery(String(index))}
              >
                <div className="gallery-image-wrapper">
                  <img src={item.url} alt={item.title} className="gallery-preview-image" />
                  <div className="gallery-overlay">
                    <ImageIcon size={32} />
                    <span className="gallery-title">{item.title}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Image Lightbox Modal */}
      {activeGallery && (
        <div className="lightbox-modal" onClick={closeGallery}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeGallery}>
              <X size={24} />
            </button>
            <h3 className="lightbox-title">CIT Life Gallery</h3>
            <div className="lightbox-image-container">
              <button className="lightbox-nav prev" onClick={prevImage}>
                <ChevronLeft size={32} />
              </button>
              <img 
                src={galleryImages[currentImageIndex]?.url} 
                alt={galleryImages[currentImageIndex]?.title || 'Gallery'} 
                className="lightbox-image"
              />
              <button className="lightbox-nav next" onClick={nextImage}>
                <ChevronRight size={32} />
              </button>
            </div>
            <div className="lightbox-thumbnails">
              {galleryImages.map((img, index) => (
                <img 
                  key={img.id}
                  src={img.url} 
                  alt={`Thumbnail ${index + 1}`}
                  className={`lightbox-thumb ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
            <p className="lightbox-counter">
              {currentImageIndex + 1} / {galleryImages.length}
            </p>
          </div>
        </div>
      )}

      {/* Why Choose CIT */}
      <section className="why-choose-section">
        <div className="section-header centered">
          <h2>Why Choose CIT?</h2>
          <p>Building future-ready IT professionals through innovation and excellence</p>
        </div>
        <div className="features-grid">
          {whyChoose.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                <feature.icon size={28} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
