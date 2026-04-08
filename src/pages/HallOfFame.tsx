import { useEffect, useMemo, useState } from 'react';
import { Image as ImageIcon, User } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { imageService } from '../services/imageService';
import { capstoneService } from '../services/capstoneService';
import type { GalleryImage, CapstoneProject } from '../types';
import './HallOfFame.css';

const HallOfFame = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [awardsImages, setAwardsImages] = useState<GalleryImage[]>([]);
  const [projects, setProjects] = useState<CapstoneProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [awardsData, projectsData] = await Promise.all([
          imageService.getByCategory('awards-recognitions'),
          capstoneService.getAll()
        ]);
        setAwardsImages(awardsData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error loading data:', error);
        // Set empty arrays on error so the page still renders
        setAwardsImages([]);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Group projects by year
  const projectsByYear = useMemo(() => {
    const filtered = projects.filter((project) => {
      if (!normalizedQuery) return true;
      return (
        project.title.toLowerCase().includes(normalizedQuery) ||
        project.description.toLowerCase().includes(normalizedQuery) ||
        project.author.toLowerCase().includes(normalizedQuery)
      );
    });

    return filtered.reduce((acc, project) => {
      if (!acc[project.year]) {
        acc[project.year] = [];
      }
      acc[project.year].push(project);
      return acc;
    }, {} as Record<string, CapstoneProject[]>);
  }, [projects, normalizedQuery]);

  const years = Object.keys(projectsByYear).sort((a, b) => parseInt(b) - parseInt(a));

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

      {/* Capstone Projects by Year */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading projects...</p>
        </div>
      ) : years.length > 0 ? (
        years.map(year => (
          <section key={year} className="featured-projects">
            <h2>{year} Capstone Projects</h2>
            <div className="featured-grid">
              {projectsByYear[year]
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((project) => (
                  <article key={project.id} className="featured-project-card">
                    <div className="featured-image-container">
                      <img src={project.image.url} alt={project.title} className="featured-image" />
                    </div>
                    <div className="featured-info">
                      <h3>{project.title}</h3>
                      <p className="featured-description">{project.description}</p>
                      <div className="project-author">
                        <User size={14} />
                        <span>{project.author} - Class of {project.year}</span>
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          </section>
        ))
      ) : (
        <section className="featured-projects">
          <h2>Capstone Projects</h2>
          <p className="no-projects">
            {normalizedQuery
              ? 'No projects match your search.'
              : 'Capstone projects will be added soon.'}
          </p>
        </section>
      )}

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
