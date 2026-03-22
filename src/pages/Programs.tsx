import { GraduationCap, BookOpen, Lightbulb, Laptop, Lock, Database, Briefcase, FileText, Award, Target, Users, Trophy } from 'lucide-react';
import './Programs.css';

const Programs = () => {
  const specializations = [
    {
      icon: <Laptop size={40} />,
      title: 'Web & Mobile Development',
      description: 'Master the art of creating responsive websites, progressive web applications, and native mobile applications. Learn modern frameworks, UI/UX design principles, and full-stack development methodologies.',
      skills: ['HTML/CSS/JavaScript', 'React/Vue/Angular', 'iOS/Android Development', 'Node.js', 'UI/UX Design']
    },
    {
      icon: <Lock size={40} />,
      title: 'Networking & Cybersecurity',
      description: 'Become a guardian of digital infrastructure. Learn to design secure networks, implement security protocols, detect threats, and protect organizations from cyber attacks using cutting-edge security technologies.',
      skills: ['Network Architecture', 'Ethical Hacking', 'Penetration Testing', 'Firewall Management', 'Cryptography']
    },
    {
      icon: <Database size={40} />,
      title: 'Data & Systems',
      description: 'Harness raw data and systems insights. Learn database design, big data analytics, system administration, and how to build robust systems that process and analyze massive amounts of information.',
      skills: ['Database Management', 'Data Analytics', 'System Administration', 'Cloud Computing', 'Big Data Tools']
    }
  ];

  const careers = [
    { icon: <Laptop size={24} />, title: 'Full-Stack Developer', description: 'Build end-to-end web applications and systems' },
    { icon: <Briefcase size={24} />, title: 'Cybersecurity Analyst', description: 'Protect systems and analyze security threats' },
    { icon: <Laptop size={24} />, title: 'Mobile App Developer', description: 'Create innovative mobile applications' },
    { icon: <Lock size={24} />, title: 'Network Engineer', description: 'Design and maintain network infrastructure' },
    { icon: <Database size={24} />, title: 'Data Analyst', description: 'Transform data into actionable business insights' },
    { icon: <Lock size={24} />, title: 'Cloud Solutions Architect', description: 'Design and implement cloud-based solutions' },
    { icon: <Briefcase size={24} />, title: 'Systems Administrator', description: 'Manage and maintain IT infrastructure' },
    { icon: <Award size={24} />, title: 'UI/UX Designer', description: 'Create beautiful and user-friendly interfaces' },
    { icon: <Target size={24} />, title: 'DevOps Engineer', description: 'Automate deployment and infrastructure management' }
  ];

  const curriculumYears = [
    {
      year: 'Year 1',
      title: 'Foundations',
      description: 'Focus basic computing skills and programming fundamentals',
      subjects: [
        'Introduction to Computing',
        'Computer Programming 1',
        'Fundamentals of Information Technology',
        'Mathematics in the Modern World',
        'Purposive Communication'
      ]
    },
    {
      year: 'Year 2',
      title: 'Core IT Skills',
      description: 'Build advanced programming and core IT knowledge',
      subjects: [
        'Computer Programming 2',
        'Data Structures and Algorithms',
        'Object-Oriented Programming',
        'Database Management Systems',
        'Computer Networks and Security'
      ]
    },
    {
      year: 'Year 3',
      title: 'Applied IT & Specialization',
      description: 'Develop expertise in specialized IT domains',
      subjects: [
        'Web Technologies',
        'Mobile Application Development',
        'Networking Fundamentals',
        'System Analysis and Design',
        'Elective Courses'
      ]
    },
    {
      year: 'Year 4',
      title: 'Integration & Practice',
      description: 'Apply and integrate skills in real-world scenarios',
      subjects: [
        'Project Management',
        'Capstone Project',
        'IT Service Management',
        'Internship/Practicum',
        'Emerging Technologies'
      ]
    }
  ];

  const learningOutcomes = [
    {
      icon: <Award size={32} />,
      title: 'High-quality education',
      description: 'Industry-recognized curriculum aligned with global standards'
    },
    {
      icon: <Users size={32} />,
      title: 'Expert faculty mentors',
      description: 'Learn from experienced professionals and academics'
    },
    {
      icon: <Trophy size={32} />,
      title: 'Hands-on experience',
      description: 'Real-world projects and practical applications'
    },
    {
      icon: <Target size={32} />,
      title: 'Adapt to innovation',
      description: 'Develop critical thinking and problem-solving skills for emerging technologies'
    },
    {
      icon: <Briefcase size={32} />,
      title: 'Lifelong and accountable',
      description: 'Build professional ethics and continuous learning mindset'
    }
  ];

  return (
    <div className="programs-page">
      {/* Hero Section */}
      <section className="programs-hero">
        <div className="programs-hero-content">
          <h1>Our Programs</h1>
          <p>Explore our comprehensive technology programs designed for the future</p>
        </div>
      </section>

      {/* Main Program Card */}
      <section className="program-highlight">
        <div className="program-card">
          <div className="program-header">
            <GraduationCap size={48} />
            <div>
              <h2>Bachelor of Science in Information Technology</h2>
              <p className="program-label">BSIT Program</p>
            </div>
          </div>

          <div className="program-description-section">
            <div className="section-icon">
              <BookOpen size={24} />
            </div>
            <div className="section-content">
              <h3>Program Description</h3>
              <p>
                The <strong>Bachelor of Science in Information Technology (BSIT)</strong> program is designed to develop highly skilled technology professionals equipped with both 
                theoretical knowledge and practical hands-on experience. Our curriculum emphasizes hands-on learning, industry collaboration, and real-world problem-solving 
                to prepare graduates for successful careers in the ever-evolving field of information technology.
              </p>
              <p>
                Students will gain comprehensive knowledge in software development, systems analysis, network administration, database management, and 
                emerging technologies. Through project-based learning and industry partnerships, graduates emerge as well-rounded IT professionals ready to tackle 
                complex technological challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Areas of Focus */}
      <section className="specializations-section">
        <div className="section-header">
          <Lightbulb size={40} />
          <h2>Areas of Focus / Specializations</h2>
          <p>Choose your focus area and become an expert in your field of interest</p>
        </div>

        <div className="specializations-grid">
          {specializations.map((spec, index) => (
            <div key={index} className="specialization-card">
              <div className="spec-icon">{spec.icon}</div>
              <h3>{spec.title}</h3>
              <p>{spec.description}</p>
              <div className="key-skills">
                <h4>Key Skills:</h4>
                <div className="skills-tags">
                  {spec.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Career Opportunities */}
      <section className="careers-section">
        <div className="section-header">
          <Briefcase size={40} />
          <h2>Career Opportunities</h2>
          <p>Our graduates excel in diverse roles across various industries</p>
        </div>

        <div className="careers-grid">
          {careers.map((career, index) => (
            <div key={index} className="career-card">
              <div className="career-icon">{career.icon}</div>
              <h3>{career.title}</h3>
              <p>{career.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum Overview */}
      <section className="curriculum-section" id="curriculum">
        <div className="section-header">
          <FileText size={40} />
          <h2>Curriculum Overview</h2>
          <p>Our comprehensive curriculum covers 4 years of intensive technical study, progressive skill building, and hands-on application of concepts</p>
        </div>

        <div className="curriculum-timeline">
          {curriculumYears.map((year, index) => (
            <div key={index} className="curriculum-year">
              <div className="year-badge">
                <span className="year-number">{year.year}</span>
                <span className="year-title">{year.title}</span>
              </div>
              <div className="year-content">
                <h3>{year.title}</h3>
                <p className="year-description">{year.description}</p>
                <ul className="subjects-list">
                  {year.subjects.map((subject, idx) => (
                    <li key={idx}>{subject}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="curriculum-action">
          <button 
            className="view-curriculum-btn"
            onClick={() => document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Back to Curriculum Top ↑
          </button>
        </div>
      </section>

      {/* Learning Outcomes */}
      <section className="outcomes-section">
        <div className="section-header">
          <Award size={40} />
          <h2>Learning Outcomes</h2>
          <p>What you'll gain from our BSIT program</p>
        </div>

        <div className="outcomes-grid">
          {learningOutcomes.map((outcome, index) => (
            <div key={index} className="outcome-card">
              <div className="outcome-icon">{outcome.icon}</div>
              <h3>{outcome.title}</h3>
              <p>{outcome.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Important Note */}
      <section className="program-note">
        <div className="note-content">
          <div className="note-icon">⚠️</div>
          <div>
            <h4>Important Note</h4>
            <p>Course titles and sequencing may be subject to curriculum updates and institutional guidelines.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="programs-cta">
        <h2>Ready to Begin Your IT Journey?</h2>
        <p>Join us and become part of the next generation of technology leaders</p>
        <button 
          className="cta-button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Back to Top ↑
        </button>
      </section>
    </div>
  );
};

export default Programs;
