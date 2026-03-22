import { useEffect, useMemo, useState } from 'react';
import { Image as ImageIcon, User } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { imageService } from '../services/imageService';
import type { GalleryImage } from '../types';
import './HallOfFame.css';

interface Project {
  id: number;
  title: string;
  description: string;
  author: string;
  year: string;
  image: string;
}

const HallOfFame = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [awardsImages, setAwardsImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    const loadAwardsImages = async () => {
      try {
        const data = await imageService.getByCategory('awards-recognitions');
        setAwardsImages(data);
      } catch (error) {
        console.error('Error loading awards images:', error);
      }
    };

    loadAwardsImages();
  }, []);

  const projects2024: Project[] = [
    {
      id: 1,
      title: 'ResiLinked',
      description: 'A comprehensive resident management system that streamlines communication between residents and local government units for better community services.',
      author: 'CIT Research Team',
      year: 'Class of 2024',
      image: '/research_projects_images/ResiLinked.jpg'
    },
    {
      id: 2,
      title: 'SoilScope',
      description: 'An innovative IoT-based soil monitoring system that helps farmers optimize crop yields through real-time soil analysis and data-driven recommendations.',
      author: 'CIT Research Team',
      year: 'Class of 2024',
      image: '/research_projects_images/SoilScope.jpg'
    },
    {
      id: 3,
      title: 'UA Clinic System',
      description: 'A digital healthcare management platform designed to modernize university clinic operations with appointment scheduling, patient records, and health monitoring.',
      author: 'CIT Research Team',
      year: 'Class of 2024',
      image: '/research_projects_images/UAClinicSystem.jpg'
    }
  ];

  const projects2025: Project[] = [
    // 2025 capstone projects to be added
  ];

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredProjects2024 = useMemo(
    () =>
      projects2024.filter((project) => {
        if (!normalizedQuery) {
          return true;
        }

        return (
          project.title.toLowerCase().includes(normalizedQuery) ||
          project.description.toLowerCase().includes(normalizedQuery) ||
          project.author.toLowerCase().includes(normalizedQuery)
        );
      }),
    [normalizedQuery]
  );

  const filteredProjects2025 = useMemo(
    () =>
      projects2025.filter((project) => {
        if (!normalizedQuery) {
          return true;
        }

        return (
          project.title.toLowerCase().includes(normalizedQuery) ||
          project.description.toLowerCase().includes(normalizedQuery) ||
          project.author.toLowerCase().includes(normalizedQuery)
        );
      }),
    [normalizedQuery]
  );

  const filteredAwards = useMemo(
    () =>
      awardsImages.filter((image) => {
        if (!normalizedQuery) {
          return true;
        }

        return image.title.toLowerCase().includes(normalizedQuery);
      }),
    [awardsImages, normalizedQuery]
  );

  return (
    <div className="hall-of-fame-page">
      {/* Hero Section */}
      <section className="hof-hero">
        <h1>Hall of Fame</h1>
        <p>College of Information Technology</p>
        <p>Outstanding capstone projects and student innovations</p>
      </section>

      <section className="hof-search-section">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search projects or awards..."
        />
      </section>

      {/* 2025 Capstone Projects */}
      <section className="featured-projects">
        <h2>2025 Capstone Projects</h2>
        <div className="featured-grid">
          {filteredProjects2025.length > 0 ? (
            filteredProjects2025.map((project) => (
              <article key={project.id} className="featured-project-card">
                <div className="featured-image-container">
                  <img src={project.image} alt={project.title} className="featured-image" />
                </div>
                <div className="featured-info">
                  <h3>{project.title}</h3>
                  <p className="featured-description">{project.description}</p>
                  <div className="project-author">
                    <User size={14} />
                    <span>{project.author} - {project.year}</span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="no-projects">2025 capstone projects will be added soon.</p>
          )}
        </div>
      </section>

      {/* 2024 Capstone Projects */}
      <section className="featured-projects">
        <h2>2024 Capstone Projects</h2>
        <div className="featured-grid">
          {filteredProjects2024.length > 0 ? (
            filteredProjects2024.map((project) => (
              <article key={project.id} className="featured-project-card">
                <div className="featured-image-container">
                  <img src={project.image} alt={project.title} className="featured-image" />
                </div>
                <div className="featured-info">
                  <h3>{project.title}</h3>
                  <p className="featured-description">{project.description}</p>
                  <div className="project-author">
                    <User size={14} />
                    <span>{project.author} - {project.year}</span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="no-projects">No 2024 projects match your search.</p>
          )}
        </div>
      </section>

      {/* Awards Gallery */}
      <section className="awards-gallery">
        <h2>Awards & Recognition</h2>
        <p className="awards-subtitle">Celebrating our students' achievements and excellence</p>
        <div className="awards-grid">
          {filteredAwards.length > 0 ? (
            filteredAwards.map((award) => (
              <div key={award.id} className="award-card">
                <img src={award.url} alt={award.title} className="award-image" />
                <p className="award-title">{award.title}</p>
              </div>
            ))
          ) : (
            <div className="awards-empty">
              <ImageIcon size={28} />
              <p>No award images match your search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HallOfFame;
