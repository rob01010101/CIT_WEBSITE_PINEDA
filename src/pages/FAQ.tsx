import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import './FAQ.css';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData: FAQItem[] = [
    {
      question: 'What programs does the College of Information Technology offer?',
      answer: 'CIT offers Bachelor of Science in Information Technology (BSIT) and Bachelor of Science in Computer Science (BSCS) programs. Both programs are designed to provide comprehensive education in technology, software development, and IT management.'
    },
    {
      question: 'What are the admission requirements for CIT?',
      answer: 'Admission requirements include completion of senior high school (Grade 12), passing the University entrance examination, submission of academic records, and good moral character certificate. Specific requirements may vary, so please contact the admissions office for detailed information.'
    },
    {
      question: 'Does CIT offer scholarships?',
      answer: 'Yes, the University of the Assumption offers various scholarship programs including academic scholarships, athletic scholarships, and financial assistance programs. Visit the scholarship office or check our website for current scholarship opportunities and application procedures.'
    },
    {
      question: 'What career opportunities are available for CIT graduates?',
      answer: 'CIT graduates can pursue careers as software developers, systems analysts, database administrators, network engineers, IT consultants, web developers, mobile app developers, cybersecurity specialists, and many other technology-related positions in various industries.'
    },
    {
      question: 'Does CIT have internship or OJT programs?',
      answer: 'Yes, CIT has partnerships with various tech companies and organizations for On-the-Job Training (OJT) programs. Students typically undergo their OJT in their later years, gaining practical experience in real-world IT environments.'
    },
    {
      question: 'What facilities and laboratories does CIT have?',
      answer: 'CIT is equipped with modern computer laboratories, software development facilities, networking labs, and multimedia rooms. Students have access to industry-standard software, hardware, and development tools for hands-on learning.'
    },
    {
      question: 'Are there student organizations in CIT?',
      answer: 'Yes, CIT has various student organizations focused on technology, programming, innovation, and community service. These organizations provide opportunities for networking, skill development, and leadership experience.'
    },
    {
      question: 'How can I contact the CIT department?',
      answer: 'You can reach CIT through email at cit@ua.edu.ph, call the UA main line at +63 (45) 961-1196 and ask for extension 314, or visit our office at the University of the Assumption campus in San Fernando, Pampanga.'
    },
    {
      question: 'What is the difference between BSIT and BSCS programs?',
      answer: 'BSIT focuses more on the practical application of technology, system implementation, and IT management, while BSCS emphasizes theoretical foundations, algorithms, and software engineering principles. Both programs prepare students for successful careers in technology.'
    },
    {
      question: 'Does CIT participate in competitions and hackathons?',
      answer: 'Yes, CIT students regularly participate in local and national programming competitions, hackathons, and tech challenges. The college has won various awards and recognition for student projects and innovations.'
    }
  ];

  return (
    <div className="faq-page">
      {/* Hero Section */}
      <section className="faq-hero">
        <HelpCircle size={48} />
        <h1>Frequently Asked Questions</h1>
        <p>College of Information Technology</p>
        <p>Find answers to common questions about CIT</p>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-container">
          <div className="faq-list">
            {faqData.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              >
                <button 
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  {activeIndex === index ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
                <div className={`faq-answer ${activeIndex === index ? 'expanded' : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="faq-cta">
        <div className="cta-content">
          <h2>Still have questions?</h2>
          <p>Feel free to reach out to us directly</p>
          <div className="cta-buttons">
            <a href="/contacts" className="btn btn-primary">
              Contact Us
            </a>
            <a href="mailto:cit@ua.edu.ph" className="btn btn-outline">
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
