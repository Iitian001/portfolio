import React from 'react';
import { Mail, ArrowRight, Send } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import './sketchbook.css';

const SketchbookLayout = () => {
  return (
    <div className="sketch-body">
      <div className="sketch-container">
        
        {/* Header */}
        <header className="sketch-header">
          <div className="sketch-logo">Portfolio.</div>
          <nav className="sketch-nav">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Work</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        {/* Hero Section */}
        <section id="home" className="sketch-hero">
          <div className="sketch-hero-text">
            <span className="sketch-greeting">Hi, I am</span>
            <h1 className="sketch-title">Shreyash</h1>
            <h2 className="sketch-subtitle">Full Stack Developer & AI Engineer</h2>
            
            <p className="sketch-description">
              I build robust web applications and intelligent systems. 
              <br/>Currently available for freelance work and new opportunities!
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
              <a href="https://github.com/Iitian001" target="_blank" rel="noreferrer" style={{ color: 'var(--ink)' }}><FaGithub size={30} /></a>
              <a href="https://www.linkedin.com/in/shreyashautomation" target="_blank" rel="noreferrer" style={{ color: 'var(--ink)' }}><FaLinkedin size={30} /></a>
              <a href="mailto:shreyash.aiml.dev@gmail.com" style={{ color: 'var(--ink)' }}><Mail size={30} /></a>
            </div>

            <a href="#projects" className="sketch-btn">
              Explore Projects <ArrowRight size={24} />
            </a>
          </div>

          <div className="sketch-hero-visual">
            <div className="sketch-avatar-container">
              <img src="/sketch-avatar.jpg" alt="Shreyash" className="sketch-avatar" />
            </div>
            <div className="sketch-arrow-annotation">
              That's me! &uarr;
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" style={{ marginTop: '8rem' }}>
          <h2 className="sketch-section-title">Who Am I?</h2>
          
          <div style={{ display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="sketch-box" style={{ flex: '1', fontSize: '1.6rem', lineHeight: '1.6' }}>
              <p style={{ margin: '0 0 1rem 0' }}>
                I'm Shreyash, a passionate creative developer specializing in building stunning, high-performance web applications and intelligent systems. 
              </p>
              <p style={{ margin: 0 }}>
                I blend bleeding-edge technology with bold, unapologetic design. When I'm not writing code or automating workflows, you can find me exploring new AI architectures or refining my design systems.
              </p>
            </div>
            <div className="sketch-box" style={{ flex: '0.6', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--marker-blue)' }}>Fast Facts</h3>
              <div style={{ fontSize: '1.4rem' }}><strong>Location:</strong> India</div>
              <div style={{ fontSize: '1.4rem' }}><strong>Email:</strong> shreyash.aiml.dev@gmail.com</div>
              <div style={{ fontSize: '1.4rem' }}><strong>Experience:</strong> Full Stack & AI</div>
              <div style={{ fontSize: '1.4rem' }}><strong>Status:</strong> Open to Work</div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" style={{ marginTop: '8rem' }}>
          <h2 className="sketch-section-title">My Skills</h2>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', marginTop: '2rem' }}>
            {['React', 'JavaScript / TypeScript', 'Python', 'Machine Learning', 'AI Development', 'Workflow Automation', 'UI / UX Design', 'Node.js', 'Tailwind CSS'].map((skill, index) => (
              <div key={index} className="sketch-box" style={{ padding: '0.8rem 1.5rem', fontSize: '1.5rem', color: index % 2 === 0 ? 'var(--marker-blue)' : 'var(--marker-red)' }}>
                {skill}
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" style={{ marginTop: '8rem' }}>
          <h2 className="sketch-section-title">Things I've Built</h2>
          
          <div className="sketch-grid">
            
            {/* Project 1 */}
            <div className="sketch-box">
              <h3 className="sketch-project-title">Palak AI Stock Expert</h3>
              <div className="sketch-project-tech">AI / Data / Finance</div>
              <p className="sketch-project-desc">
                An advanced financial analytics dashboard that uses AI to provide actionable stock market insights and predictions.
              </p>
              <a href="https://github.com/Iitian001/Palak_Ai_stock-expert" target="_blank" rel="noreferrer" className="sketch-btn" style={{ padding: '0.4rem 1rem', fontSize: '1.2rem' }}>
                View Source <FaGithub size={16} />
              </a>
            </div>

            {/* Project 2 */}
            <div className="sketch-box">
              <h3 className="sketch-project-title">n8n Templates</h3>
              <div className="sketch-project-tech">Automation / Workflows</div>
              <p className="sketch-project-desc">
                A highly organized collection of ready-to-use n8n automation workflows designed to streamline complex business logic.
              </p>
              <a href="https://github.com/Iitian001/N8N_tamplets" target="_blank" rel="noreferrer" className="sketch-btn" style={{ padding: '0.4rem 1rem', fontSize: '1.2rem' }}>
                View Source <FaGithub size={16} />
              </a>
            </div>

            {/* Project 3 */}
            <div className="sketch-box">
              <h3 className="sketch-project-title">3D Portfolio</h3>
              <div className="sketch-project-tech">React / Three.js / WebGL</div>
              <p className="sketch-project-desc">
                An immersive 3D interactive web portfolio built to showcase creative development and complex rendering techniques.
              </p>
              <a href="https://shreyashmishra.in" target="_blank" rel="noreferrer" className="sketch-btn" style={{ padding: '0.4rem 1rem', fontSize: '1.2rem' }}>
                Live Site <ArrowRight size={16} />
              </a>
            </div>

            {/* Project 4 */}
            <div className="sketch-box">
              <h3 className="sketch-project-title">Shreyash Code</h3>
              <div className="sketch-project-tech">Python / Scripts</div>
              <p className="sketch-project-desc">
                A suite of powerful Python scripts utilized for data processing, automation, and backend system tasks.
              </p>
              <a href="https://github.com/Iitian001/Shreyash_code-" target="_blank" rel="noreferrer" className="sketch-btn" style={{ padding: '0.4rem 1rem', fontSize: '1.2rem' }}>
                View Source <FaGithub size={16} />
              </a>
            </div>

          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" style={{ marginTop: '8rem', marginBottom: '4rem' }}>
          <h2 className="sketch-section-title">Let's Talk</h2>
          
          <div className="sketch-box" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem' }}>
            <h3 style={{ fontSize: '2rem', marginTop: 0, marginBottom: '1rem', color: 'var(--ink)' }}>Send me a message</h3>
            <p style={{ fontSize: '1.4rem', marginBottom: '2rem' }}>Interested in collaborating or just want to say hi? Drop a message below.</p>
            
            <form action="https://api.web3forms.com/submit" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <input type="hidden" name="access_key" value="32325e99-d553-4bad-a24a-50f938ffbd0c" />
              
              <input 
                type="text" 
                name="name" 
                placeholder="Your Name" 
                required 
                className="sketch-box"
                style={{ fontFamily: 'inherit', fontSize: '1.4rem', padding: '1rem', outline: 'none' }}
              />
              
              <input 
                type="email" 
                name="email" 
                placeholder="Your Email" 
                required 
                className="sketch-box"
                style={{ fontFamily: 'inherit', fontSize: '1.4rem', padding: '1rem', outline: 'none' }}
              />
              
              <textarea 
                name="message" 
                placeholder="What's on your mind?" 
                required 
                rows="4" 
                className="sketch-box"
                style={{ fontFamily: 'inherit', fontSize: '1.4rem', padding: '1rem', outline: 'none', resize: 'vertical' }}
              ></textarea>
              
              <button type="submit" className="sketch-btn" style={{ justifyContent: 'center', marginTop: '1rem', width: '100%' }}>
                Send It <Send size={20} />
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="sketch-footer">
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: '2.5rem', color: 'var(--ink)' }}>Handcrafted by Shreyash</div>
          <div style={{ fontSize: '1.2rem', color: 'var(--ink-light)', marginTop: '0.5rem' }}>© 2026 All rights reserved</div>
        </footer>

      </div>
    </div>
  );
};

export default SketchbookLayout;
