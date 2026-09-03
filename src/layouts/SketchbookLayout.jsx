import { Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import ContactForm from '../components/ContactForm';
import { site } from '../data/site';
import { usePageTitle } from '../hooks/usePageTitle';
import './sketchbook.css';

const skills = [
  { name: 'React', color: 'blue' },
  { name: 'JavaScript / TypeScript', color: 'red' },
  { name: 'Python', color: 'green' },
  { name: 'Machine Learning', color: 'orange' },
  { name: 'AI Development', color: 'blue' },
  { name: 'Workflow Automation', color: 'red' },
  { name: 'UI / UX Design', color: 'green' },
  { name: 'Node.js', color: 'orange' },
  { name: 'Tailwind CSS', color: 'blue' },
];

const SketchbookLayout = () => {
  usePageTitle(null);

  return (
    <div className="sketch-body">
      <a href="#about" className="sketch-skip-link">Skip to content</a>

      <div className="sketch-container">

        <SiteHeader />

        {/* Hero Section */}
        <section className="sketch-hero">
          <div className="sketch-hero-text">
            <span className="sketch-greeting">Hi, I am</span>
            <h1 className="sketch-title">{site.name}</h1>
            <h2 className="sketch-subtitle">Full Stack Developer &amp; AI Engineer</h2>
            <p className="sketch-description">
              I build robust web applications and intelligent systems. Currently available for freelance work and new opportunities!
            </p>
            <div className="sketch-socials">
              <a href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub size={28} /></a>
              <a href={site.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin size={28} /></a>
              <a href={`mailto:${site.email}`} aria-label={`Email ${site.email}`}><Mail size={28} /></a>
            </div>
            <Link to="/projects" className="sketch-btn">Explore Projects <ArrowRight size={22} /></Link>
          </div>

          <div className="sketch-hero-visual">
            <div className="sketch-avatar-frame">
              <img
                src="/sketch-avatar.jpg"
                alt="Pencil sketch portrait of Shreyash"
                className="sketch-avatar"
                width="819"
                height="1024"
                fetchPriority="high"
                decoding="sync"
              />
            </div>
            <div className="sketch-arrow-annotation">That's me! &uarr;</div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="sketch-section">
          <h2 className="sketch-section-title">Who Am I?</h2>
          <div className="sketch-about-grid">
            <div className="sketch-box sketch-about-bio">
              <p>I'm Shreyash, a passionate creative developer specializing in building stunning, high-performance web applications and intelligent systems.</p>
              <p>I blend bleeding-edge technology with bold, unapologetic design. When I'm not writing code or automating workflows, you can find me exploring new AI architectures or refining my design systems.</p>
            </div>
            <div className="sketch-box sketch-fast-facts">
              <h3 className="sketch-facts-title">Fast Facts</h3>
              <div className="sketch-fact"><strong>Location:</strong> {site.location}</div>
              <div className="sketch-fact">
                <strong>Email:</strong>{' '}
                <a className="sketch-contact-link" href={`mailto:${site.email}`}>{site.email}</a>
              </div>
              <div className="sketch-fact"><strong>Experience:</strong> Full Stack &amp; AI</div>
              <div className="sketch-fact"><strong>Status:</strong> Open to Work</div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="sketch-section">
          <h2 className="sketch-section-title">My Skills</h2>
          <div className="sketch-skills-grid">
            {skills.map((skill) => (
              <span key={skill.name} className={`sketch-pill sketch-pill--${skill.color}`}>{skill.name}</span>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="sketch-section">
          <h2 className="sketch-section-title">Let's Talk</h2>
          <ContactForm />
        </section>

        <SiteFooter />
      </div>
    </div>
  );
};

export default SketchbookLayout;
