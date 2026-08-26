import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Send } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
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
  return (
    <div className="sketch-body">
      <div className="sketch-container">

        <SiteHeader />

        {/* Hero Section */}
        <section className="sketch-hero">
          <div className="sketch-hero-text">
            <span className="sketch-greeting">Hi, I am</span>
            <h1 className="sketch-title">Shreyash</h1>
            <h2 className="sketch-subtitle">Full Stack Developer &amp; AI Engineer</h2>
            <p className="sketch-description">
              I build robust web applications and intelligent systems. Currently available for freelance work and new opportunities!
            </p>
            <div className="sketch-socials">
              <a href="https://github.com/Iitian001" target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub size={28} /></a>
              <a href="https://www.linkedin.com/in/shreyashautomation" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin size={28} /></a>
              <a href="mailto:shreyash.aiml.dev@gmail.com" aria-label="Email"><Mail size={28} /></a>
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
              <div className="sketch-fact"><strong>Location:</strong> India</div>
              <div className="sketch-fact"><strong>Email:</strong> shreyash.aiml.dev@gmail.com</div>
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
          <div className="sketch-box sketch-contact-card">
            <h3 className="sketch-contact-heading">Send me a message</h3>
            <p className="sketch-contact-sub">Interested in collaborating or just want to say hi? Drop a message below.</p>
            <form action="https://api.web3forms.com/submit" method="POST" className="sketch-contact-form">
              <input type="hidden" name="access_key" value="32325e99-d553-4bad-a24a-50f938ffbd0c" />
              <input type="text" name="name" placeholder="Your Name" aria-label="Your name" required className="sketch-input" />
              <input type="email" name="email" placeholder="Your Email" aria-label="Your email address" required className="sketch-input" />
              <textarea name="message" placeholder="What's on your mind?" aria-label="Your message" required rows="4" className="sketch-input sketch-textarea"></textarea>
              <button type="submit" className="sketch-btn sketch-submit-btn">Send It <Send size={20} /></button>
            </form>
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
};

export default SketchbookLayout;
