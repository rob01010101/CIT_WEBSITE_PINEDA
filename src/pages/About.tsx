import { useEffect, useState } from 'react';
import { 
  Target, 
  Eye, 
  History,
  Star,
  Building2,
  Cpu,
  GraduationCap,
  Lightbulb,
  Image as ImageIcon
} from 'lucide-react';
import { imageService } from '../services/imageService';
import type { GalleryImage } from '../types';
import './About.css';

const About = () => {
  const [featuredImages, setFeaturedImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    const loadFeaturedImages = async () => {
      try {
        const data = await imageService.getByCategory('about-featured');
        setFeaturedImages(data);
      } catch (error) {
        console.error('Error loading about featured images:', error);
      }
    };

    loadFeaturedImages();
  }, []);

  const whyChooseItems = [
    {
      icon: Building2,
      title: 'Industry Connections',
      description: 'Strong partnerships with leading tech companies provide internship opportunities and career pathways.'
    },
    {
      icon: Cpu,
      title: 'Cutting-Edge Facilities',
      description: 'State-of-the-art labs equipped with the latest technology for hands-on learning experiences.'
    },
    {
      icon: GraduationCap,
      title: 'Expert Faculty',
      description: 'Learn from experienced professors and industry practitioners who bring real-world expertise.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation Focus',
      description: 'Emphasis on innovation, entrepreneurship, and creative problem-solving in all programs.'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <h1>About CIT</h1>
        <p>College of Information Technology</p>
        <p>Leading the way in technology education and innovation</p>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="mv-container">
          <div className="mv-card mission">
            <div className="mv-icon">
              <Target size={32} />
            </div>
            <h2>Our Mission</h2>
            <p>
              The College of Information Technology at the University of the Assumption
              provides world-class technology education that 
              empowers students to become innovative leaders, skilled 
              practitioners, and ethical technologists who can shape 
              the future of our digital world.
            </p>
          </div>
          <div className="mv-card vision">
            <div className="mv-icon">
              <Eye size={32} />
            </div>
            <h2>Our Vision</h2>
            <p>
              To be recognized as the premier College of Information Technology 
              in the Philippines under the University of the Assumption, known for producing 
              graduates who drive technological innovation and 
              positive change in society.
            </p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="history-section">
        <div className="history-container">
          <div className="history-header">
            <History size={32} />
            <h2>Our History</h2>
          </div>
          <div className="history-content">
            <p>
                The University of the Assumption in the Philippines is an Archdiocesan Catholic university, founded in 1963, which has evolved to include the College of Information Technology, The program has been structured to include both technological knowledge and, as a Catholic institution, a focus on ethics. The institution has maintained its focus on Information Technology as part of its curriculum updates through the years.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose CIT Section */}
      <section className="why-choose-about">
        <div className="why-choose-container">
          <div className="why-header">
            <Star size={28} />
            <h2>Why Choose CIT?</h2>
          </div>
          <div className="why-items">
            {whyChooseItems.map((item, index) => (
              <div key={index} className="why-item">
                <div className="why-icon">
                  <item.icon size={32} />
                </div>
                <div className="why-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Life Gallery */}
      <section className="campus-life-section">
        <div className="campus-container">
          <h2>Life at CIT</h2>
          <p>Experience the vibrant community of innovators and future tech leaders</p>
          <div className="campus-gallery">
            {featuredImages.length === 0 ? (
              <div className="campus-gallery-item large empty">
                <div className="campus-placeholder">
                  <ImageIcon size={30} />
                  <span>No featured images available yet.</span>
                </div>
              </div>
            ) : (
              featuredImages.slice(0, 5).map((image, index) => (
                <div key={image.id} className={`campus-gallery-item ${index === 0 ? 'large' : ''}`}>
                  <img src={image.url} alt={image.title} />
                  <div className="campus-overlay">
                    <span>{image.title}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
