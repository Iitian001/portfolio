import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Send, Star } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import ScrollToTop from './ScrollToTop';

const SketchbookLayout = () => {
  const [mounted, setMounted] = useState(false);
  const [sketchPath, setSketchPath] = useState(null);

  useEffect(() => {
    setMounted(true);
    fetch('/sketch-avatar.svg')
      .then(res => res.text())
      .then(text => {
        const match = text.match(/<path[^>]+d="([^"]+)"/i);
        if (match) {
          setSketchPath(match[1]);
        }
      })
      .catch(e => console.error("Error loading vector avatar", e));
  }, []);

  return (
    <div className="sketch-body">
      <div className="sketch-container">

        <header className="sketch-header">
          <Link to="/" className="sketch-logo">Portfolio.</Link>
          <nav className="sketch-nav">
            <Link to="/">Home</Link>
            <Link to="/certificates">Certificates</Link>
            <Link to="/projects">Work</Link>
            <a href="mailto:shreyash.aiml.dev@gmail.com">Contact</a>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="sketch-hero">
          <div className="sketch-hero-text">
            <span className="sketch-greeting">Hi, I am</span>
            <h1 className="sketch-title">Shreyash</h1>
            <h2 className="sketch-subtitle">Full Stack Developer & AI Engineer</h2>
            <p className="sketch-description">
              I build robust web applications and intelligent systems. Currently available for freelance work and new opportunities!
            </p>
            <div className="sketch-socials">
              <a href="https://github.com/Iitian001" target="_blank" rel="noreferrer"><FaGithub size={28} /></a>
              <a href="https://www.linkedin.com/in/shreyashautomation" target="_blank" rel="noreferrer"><FaLinkedin size={28} /></a>
              <a href="mailto:shreyash.aiml.dev@gmail.com"><Mail size={28} /></a>
            </div>
            <Link to="/projects" className="sketch-btn">Explore Projects <ArrowRight size={22} /></Link>
          </div>

          <div className="sketch-hero-visual">
            <div className="sketch-avatar-frame">
              <div className="sketch-paper-backdrop"></div>
              <img src="/shreyash.png" alt="Shreyash" className="sketch-avatar" onError={(e) => { e.target.style.display='none'; }} />
              {sketchPath && (
                <svg viewBox="0 0 819 1024" preserveAspectRatio="xMidYMid slice" className="sketch-pencil-svg">
                  <path d={sketchPath} fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset="1">
                    <animate attributeName="stroke-dashoffset" from="1" to="0" dur="5.5s" fill="freeze" calcMode="linear" />
                    <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.9;1" dur="6s" fill="freeze" />
                  </path>
                  <g opacity="1">
                    <animateMotion dur="5.5s" fill="freeze" path={sketchPath} calcMode="linear" />
                    <animateTransform attributeName="transform" type="translate" values="0,0;0,0;50,100" keyTimes="0;0.9;1" dur="6s" fill="freeze" />
                    <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.95;1" dur="6s" fill="freeze" />
                    <g transform="scale(5) rotate(35)">
                      <polygon points="0,0 -2,-12 2,-12" fill="#2c2c2c" />
                      <polygon points="-2,-12 2,-12 6,-25 -6,-25" fill="#d4a373" />
                      <rect x="-6" y="-60" width="12" height="35" fill="#2c2c2c" />
                      <rect x="-6" y="-68" width="12" height="8" fill="#d4af37" />
                      <path d="M -6,-68 L -6,-72 Q 0,-78 6,-72 L 6,-68 Z" fill="#e76f51" />
                    </g>
                  </g>
                </svg>
              )}
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
              <div className="sketch-fact"><strong>Experience:</strong> Full Stack & AI</div>
              <div className="sketch-fact"><strong>Status:</strong> Open to Work</div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="sketch-section">
          <h2 className="sketch-section-title">My Skills</h2>
          <div className="sketch-skills-grid">
            {[
              { name: 'React', color: 'blue' },
              { name: 'JavaScript / TypeScript', color: 'red' },
              { name: 'Python', color: 'green' },
              { name: 'Machine Learning', color: 'orange' },
              { name: 'AI Development', color: 'blue' },
              { name: 'Workflow Automation', color: 'red' },
              { name: 'UI / UX Design', color: 'green' },
              { name: 'Node.js', color: 'orange' },
              { name: 'Tailwind CSS', color: 'blue' },
            ].map((skill, i) => (
              <span key={i} className={`sketch-pill sketch-pill--${skill.color}`}>{skill.name}</span>
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
              <input type="text" name="name" placeholder="Your Name" required className="sketch-input" />
              <input type="email" name="email" placeholder="Your Email" required className="sketch-input" />
              <textarea name="message" placeholder="What's on your mind?" required rows="4" className="sketch-input sketch-textarea"></textarea>
              <button type="submit" className="sketch-btn sketch-submit-btn">Send It <Send size={20} /></button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="sketch-footer">
          <div className="sketch-footer-signature">Handcrafted by Shreyash</div>
          <div className="sketch-footer-copy">&copy; 2026 All rights reserved</div>
        </footer>

        <ScrollToTop />
      </div>
    </div>
  );
};

export default SketchbookLayout;
