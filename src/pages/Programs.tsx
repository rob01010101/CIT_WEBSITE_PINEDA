import { GraduationCap, BookOpen, FileText, Award, Briefcase, Download } from 'lucide-react';
import './Programs.css';

const Programs = () => {
  const curriculumPdfUrl = '/bsit-curriculum.pdf';

  const summaryStats = [
    { value: '1', label: 'Degree Program Offered' },
    { value: '4', label: 'Academic Years' },
    { value: '120+', label: 'Total Units' },
    { value: '100%', label: 'Future-Ready' }
  ];

  const navItems = [
    { label: 'BS in Information Technology', href: '#program-overview', isPrimary: true },
    { label: 'Program Overview', href: '#program-overview' },
    { label: 'Curriculum Overview', href: '#curriculum-overview' },
    { label: 'Program Outcomes', href: '#program-outcomes' },
    { label: 'Career Opportunities', href: '#career-opportunities' }
  ];

  const programMeta = [
    { label: 'Duration', value: '4 Years' },
    { label: 'Total Units', value: '120+ Units' },
    { label: 'Modality', value: 'Full-Time' },
    { label: 'Accreditation', value: 'CHED Approved Program' }
  ];

  const curriculumYears = [
    {
      year: '1st Year',
      subjects: [
        'Introduction to Computing',
        'Programming 1',
        'Discrete Mathematics',
        'Communication Skills',
        'Purposive Communication'
      ]
    },
    {
      year: '2nd Year',
      subjects: [
        'Data Structures and Algorithms',
        'Object-Oriented Programming',
        'Database Systems',
        'Network Fundamentals',
        'Information Management'
      ]
    },
    {
      year: '3rd Year',
      subjects: [
        'Web Development',
        'Software Engineering',
        'Operating Systems',
        'Information Assurance',
        'Systems Analysis and Design'
      ]
    },
    {
      year: '4th Year',
      subjects: [
        'Capstone Project 1 & 2',
        'IT Electives',
        'Practicum / Internship',
        'IT Project Management',
        'Emerging Technologies'
      ]
    }
  ];

  const outcomes = [
    'Graduates are equipped with the knowledge and skills to design solutions, innovate technologies, and lead in the ever-evolving IT industry.',
    'Students develop strong problem-solving, communication, and ethical decision-making skills aligned with professional standards.',
    'Hands-on learning prepares learners for real-world projects, internships, and industry collaboration.'
  ];

  const careerOpportunities = [
    'Software Developer',
    'Network Administrator',
    'Systems Analyst',
    'IT Support Specialist',
    'Web Developer',
    'Database Administrator',
    'QA Engineer',
    'IT Project Coordinator'
  ];

  return (
    <div className="programs-page">
      <section className="programs-hero">
        <div className="programs-hero-content">
          <h1>Our Programs</h1>
          <p>
            Explore the Bachelor of Science in Information Technology program designed to equip students with knowledge, skills, and values for a future-ready IT career.
          </p>
        </div>
      </section>

      <section className="programs-summary">
        <div className="summary-grid">
          {summaryStats.map((stat) => (
            <div key={stat.label} className="summary-card">
              <div className="summary-value">{stat.value}</div>
              <div className="summary-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="programs-layout">
        <aside className="programs-sidebar">
          <h3>Programs</h3>
          <ul className="programs-nav">
            {navItems.map((item) => (
              <li key={item.label}>
                <a href={item.href} className={item.isPrimary ? 'primary' : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="programs-download">
            <h4>Download Full Curriculum</h4>
            <p>View or download the complete curriculum guide (PDF).</p>
            <a href={curriculumPdfUrl} className="programs-download-button" download>
              <Download size={16} />
              Download PDF
            </a>
          </div>
        </aside>

        <div className="programs-main">
          <section className="program-overview" id="program-overview">
            <div className="program-overview-header">
              <GraduationCap size={28} />
              <div>
                <h2>Bachelor of Science in Information Technology</h2>
                <p className="program-subtitle">BSIT Program Overview</p>
              </div>
            </div>
            <div className="program-overview-content">
              <div className="program-overview-text">
                <div className="program-section-header">
                  <BookOpen size={20} />
                  <h3>Program Overview</h3>
                </div>
                <p>
                  The BSIT program develops competent IT professionals equipped with technical expertise, problem-solving skills, and a strong foundation in computing to address real-world challenges.
                </p>
                <p>
                  This content can be refined with the official description, learning outcomes, and accreditation details as needed.
                </p>
              </div>
              <div className="program-meta">
                {programMeta.map((item) => (
                  <div key={item.label} className="program-meta-item">
                    <span className="program-meta-label">{item.label}</span>
                    <span className="program-meta-value">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="program-actions">
                <a href={curriculumPdfUrl} className="program-action" target="_blank" rel="noreferrer">
                  View Full Curriculum
                </a>
                <a href={curriculumPdfUrl} className="program-action secondary" download>
                  Download PDF
                </a>
              </div>
            </div>
          </section>

          <section className="curriculum-overview" id="curriculum-overview">
            <div className="program-section-header">
              <FileText size={20} />
              <h3>Curriculum Overview</h3>
            </div>
            <p className="section-description">
              A simplified overview of the subjects per year level. Replace or expand the lists below as needed.
            </p>
            <div className="curriculum-grid">
              {curriculumYears.map((year) => (
                <div key={year.year} className="curriculum-year-card">
                  <h4>{year.year}</h4>
                  <ul className="curriculum-subjects">
                    {year.subjects.map((subject) => (
                      <li key={subject}>{subject}</li>
                    ))}
                  </ul>
                  <a href="#" className="curriculum-link">View all subjects</a>
                </div>
              ))}
            </div>
          </section>

          <section className="program-outcomes" id="program-outcomes">
            <div className="program-section-header">
              <Award size={20} />
              <h3>Program Outcomes</h3>
            </div>
            <p className="section-description">
              Highlight the outcomes you want to feature for the BSIT program.
            </p>
            <ul>
              {outcomes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="program-outcomes-actions">
              <a href="#" className="program-action">View Program Outcomes</a>
            </div>
          </section>

          <section className="career-opportunities" id="career-opportunities">
            <div className="program-section-header">
              <Briefcase size={20} />
              <h3>Career Opportunities</h3>
            </div>
            <p className="section-description">
              Sample career paths for BSIT graduates. Update the list as needed.
            </p>
            <div className="career-list">
              {careerOpportunities.map((career) => (
                <div key={career} className="career-chip">{career}</div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default Programs;
