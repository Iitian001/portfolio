import React, { useState } from 'react';
import { Mail, Briefcase, Star, User, Home, ArrowRight, PenTool, Monitor, Code, Target, MapPin, Phone } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import './anime.css';

const AnimeLayout = () => {
  const [activePage, setActivePage] = useState('home');

  const renderHome = () => (
    <>
      {/* HERO */}
      <section id="home" className="anime-hero stagger-1">
        <div className="anime-hero-content">
          <h2 className="anime-greeting">YO! I'M</h2>
          <h1 className="anime-title">SHREYASH</h1>
          <h3 className="anime-subtitle">
            DESIGNER <span>•</span> DEVELOPER <span>•</span> CREATIVE THINKER
          </h3>
          <p className="anime-desc">
            I craft bold, modern and user focused digital experiences that leave a lasting impact.
          </p>
          <button className="anime-btn-yellow" onClick={() => setActivePage('projects')}>
            <span>VIEW MY WORK</span> <ArrowRight size={20} />
          </button>
        </div>
        
        {/* Hero Image Container */}
        <div style={{ position: 'absolute', right: '-3rem', top: '-5rem', width: '750px', height: '750px', pointerEvents: 'none', zIndex: 0 }}>
          <img src="/anime-hero.jpg" alt="Shreyash Anime" className="anime-hero-image levitate" style={{ right: 0, top: 0, position: 'absolute' }} />
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="stagger-2">
        <h2 className="anime-section-title">FEATURED PROJECTS</h2>
        <div className="anime-projects-grid">
          <div className="anime-project-card">
            <div className="anime-project-number">01</div>
            <img src="/palak.jpg" alt="Palak AI" className="anime-project-img" />
            <h3 className="anime-project-title">PALAK AI</h3>
            <div className="anime-project-category">AI / FINANCE</div>
            <a href="https://github.com/Iitian001/Palak_Ai_stock-expert" target="_blank" rel="noreferrer" className="anime-project-arrow"><ArrowRight size={16} /></a>
          </div>
          <div className="anime-project-card">
            <div className="anime-project-number">02</div>
            <img src="/n8n.png" alt="N8N Templates" className="anime-project-img" />
            <h3 className="anime-project-title">N8N TEMPLATES</h3>
            <div className="anime-project-category">AUTOMATION</div>
            <a href="https://github.com/Iitian001/N8N_tamplets" target="_blank" rel="noreferrer" className="anime-project-arrow"><ArrowRight size={16} /></a>
          </div>
          <div className="anime-project-card">
            <div className="anime-project-number">03</div>
            <img src="/portfolio.png" alt="3D Portfolio" className="anime-project-img" />
            <h3 className="anime-project-title">3D PORTFOLIO</h3>
            <div className="anime-project-category">REACT / WEBGL</div>
            <a href="https://shreyashmishra.in" target="_blank" rel="noreferrer" className="anime-project-arrow"><ArrowRight size={16} /></a>
          </div>
          <div className="anime-project-card">
            <div className="anime-project-number">04</div>
            <img src="/shreyash.png" alt="Shreyash Code" className="anime-project-img" />
            <h3 className="anime-project-title">SHREYASH CODE</h3>
            <div className="anime-project-category">PYTHON SCRIPTS</div>
            <a href="https://github.com/Iitian001/Shreyash_code-" target="_blank" rel="noreferrer" className="anime-project-arrow"><ArrowRight size={16} /></a>
          </div>
        </div>
      </section>

      {/* BOTTOM ROW */}
      <section className="anime-bottom-row stagger-3">
        <div className="anime-box" id="about">
          <h2 className="anime-box-title">ABOUT ME</h2>
          <div className="anime-about-content">
            <img src="/anime-about.jpg" alt="About Avatar" className="anime-about-img" />
            <div>
              <p className="anime-about-text">
                I'm a passionate fullstack developer & AI architect who loves turning complex logic into impactful digital products.
              </p>
              <button className="anime-btn-dark" onClick={() => setActivePage('about')}>MORE ABOUT ME <ArrowRight size={16}/></button>
            </div>
          </div>
        </div>
        <div className="anime-box" id="services">
          <h2 className="anime-box-title">WHAT I DO</h2>
          <div className="anime-services-grid">
            <div>
              <div className="anime-service-icon" style={{background: '#3a86ff'}}><PenTool /></div>
              <div className="anime-service-title">UI/UX<br/>DESIGN</div>
            </div>
            <div>
              <div className="anime-service-icon" style={{background: '#ff006e'}}><Monitor /></div>
              <div className="anime-service-title">WEB<br/>DEV</div>
            </div>
            <div>
              <div className="anime-service-icon" style={{background: '#ffbe0b'}}><Code /></div>
              <div className="anime-service-title">AI<br/>ARCHITECT</div>
            </div>
            <div>
              <div className="anime-service-icon" style={{background: '#8338ec'}}><Target /></div>
              <div className="anime-service-title">WORKFLOW<br/>AUTOMATION</div>
            </div>
          </div>
        </div>
        <div className="anime-contact-wrapper" id="contact" style={{ position: 'relative' }}>
          <div className="anime-box" style={{ width: '65%', zIndex: 2, position: 'relative' }}>
            <h2 className="anime-box-title">LET'S CONNECT!</h2>
            <div className="anime-contact-content">
              <div className="anime-contact-details">
                <div className="anime-contact-item"><Mail size={16}/> shreyash.aiml.dev@gmail.com</div>
                <div className="anime-contact-item"><MapPin size={16}/> India</div>
                <button className="anime-btn-pink" onClick={() => setActivePage('contact')}>SAY HELLO! <ArrowRight size={16}/></button>
              </div>
            </div>
          </div>
          <img src="/anime-contact.jpg" alt="Contact Avatar" className="anime-contact-img" />
        </div>
      </section>
    </>
  );

  const renderAbout = () => (
    <section className="anime-page stagger-1">
      <h1 className="anime-title" style={{ fontSize: '6rem', marginBottom: '4rem', marginTop: '2rem' }}>WHO AM I?</h1>
      
      <div style={{ display: 'flex', gap: '4rem', alignItems: 'flex-start' }}>
        <img src="/anime-about.jpg" style={{ width: '350px', border: '15px solid white', transform: 'rotate(-3deg)', boxShadow: '15px 15px 0 rgba(0,0,0,0.5)' }} alt="About Me" />
        
        <div style={{ flex: 1 }}>
          <div className="anime-box dark" style={{ padding: '3rem', fontSize: '1.2rem', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              Hi! I'm <span style={{ color: 'var(--neon-pink)', fontWeight: 900 }}>Shreyash</span>, a passionate fullstack developer & AI architect specializing in building stunning, high-performance web applications and intelligent systems.
            </p>
            <p style={{ marginBottom: '2rem' }}>
              I blend bleeding-edge technology with bold, unapologetic design. When I'm not writing code or automating workflows, you can find me exploring new AI architectures or refining my design systems.
            </p>
            
            <h3 style={{ fontFamily: 'Permanent Marker', fontSize: '2rem', color: 'var(--neon-yellow)', marginBottom: '1rem' }}>CORE ARSENAL</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ background: 'var(--neon-pink)', color: 'white', padding: '0.5rem 1rem', fontWeight: 900, borderRadius: '4px' }}>REACT / NEXT.JS</div>
              <div style={{ background: 'var(--neon-purple)', color: 'white', padding: '0.5rem 1rem', fontWeight: 900, borderRadius: '4px' }}>PYTHON / AI</div>
              <div style={{ background: '#3a86ff', color: 'white', padding: '0.5rem 1rem', fontWeight: 900, borderRadius: '4px' }}>N8N AUTOMATION</div>
              <div style={{ background: 'var(--neon-yellow)', color: 'black', padding: '0.5rem 1rem', fontWeight: 900, borderRadius: '4px' }}>UI/UX DESIGN</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderCertificates = () => (
    <section className="anime-page stagger-1">
      <h1 className="anime-title" style={{ fontSize: '6rem', marginBottom: '4rem', marginTop: '2rem' }}>MY ACHIEVEMENTS</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h3 style={{ fontFamily: 'Permanent Marker', fontSize: '2rem', color: 'var(--neon-pink)', marginBottom: '1.5rem', alignSelf: 'center' }}>CERTIFICATIONS</h3>
        
        <a href="https://learn.deeplearning.ai/certificates/2272a4ee-5c3e-4b27-95fd-b7bd70b0bd27" target="_blank" rel="noreferrer" className="glitch-hover" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)', padding: '2rem', borderRadius: '12px', textDecoration: 'none', color: 'white', transition: 'all 0.3s' }}>
          <Star size={40} color="var(--neon-yellow)" />
          <div>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, letterSpacing: '1px' }}>Data Analytics Foundations</h4>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', margin: '0.5rem 0 0' }}>DeepLearning.AI</p>
          </div>
        </a>
        
        <a href="https://learn.deeplearning.ai/certificates/907381d1-8616-4b35-9eac-d588876d0d19" target="_blank" rel="noreferrer" className="glitch-hover" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)', padding: '2rem', borderRadius: '12px', textDecoration: 'none', color: 'white', transition: 'all 0.3s' }}>
          <Star size={40} color="var(--neon-purple)" />
          <div>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, letterSpacing: '1px' }}>Fast Prototyping of GenAI Apps with Streamlit</h4>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', margin: '0.5rem 0 0' }}>DeepLearning.AI</p>
          </div>
        </a>
      </div>
    </section>
  );

  const renderContact = () => (
    <section className="anime-page stagger-1" style={{ position: 'relative', minHeight: '85vh', overflow: 'hidden' }}>
      <h1 className="anime-title" style={{ fontSize: '6rem', marginBottom: '2rem', marginTop: '2rem' }}>LET'S CONNECT!</h1>
      
      <div style={{ display: 'flex', gap: '4rem' }}>
        <div className="anime-box" style={{ flex: '1', maxWidth: '600px', padding: '3rem', zIndex: 2 }}>
          <h2 className="anime-box-title" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>SEND TRANSMISSION</h2>
          
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <input type="text" placeholder="YOUR NAME" style={{ padding: '1.2rem', border: '3px solid black', fontFamily: 'inherit', fontSize: '1.1rem', fontWeight: 800, outline: 'none' }} />
            <input type="email" placeholder="YOUR EMAIL" style={{ padding: '1.2rem', border: '3px solid black', fontFamily: 'inherit', fontSize: '1.1rem', fontWeight: 800, outline: 'none' }} />
            <textarea placeholder="WHAT'S ON YOUR MIND?" rows="5" style={{ padding: '1.2rem', border: '3px solid black', fontFamily: 'inherit', fontSize: '1.1rem', fontWeight: 800, outline: 'none', resize: 'none' }}></textarea>
            
            <button type="button" className="anime-btn-pink" style={{ fontSize: '1.2rem', justifyContent: 'center', marginTop: '1rem', padding: '1.2rem' }}>
              SEND IT <ArrowRight />
            </button>
          </form>
        </div>
        
        {/* Massive background avatar for contact page */}
        <img 
          src="/anime-contact.jpg" 
          alt="Contact Avatar Big" 
          className="levitate"
          style={{ 
            position: 'absolute', 
            right: '-5rem', 
            bottom: '-10rem', 
            width: '800px', 
            mixBlendMode: 'lighten', 
            maskImage: 'radial-gradient(closest-side, black 30%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(closest-side, black 30%, transparent 80%)',
            pointerEvents: 'none',
            zIndex: 0
          }} 
        />
      </div>
    </section>
  );

  const renderProjects = () => (
    <section className="anime-page stagger-1" style={{ paddingBottom: '4rem' }}>
      <h1 className="anime-title" style={{ fontSize: '5rem', marginBottom: '3rem', marginTop: '1rem' }}>ALL PROJECTS</h1>
      <div className="anime-projects-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '3rem' }}>
        <div className="anime-project-card" style={{ padding: '2rem' }}>
          <div className="anime-project-number" style={{ fontSize: '1.5rem', padding: '0.5rem 1rem' }}>01</div>
          <img src="/palak.jpg" alt="Palak AI" className="anime-project-img" style={{ height: '300px' }} />
          <h3 className="anime-project-title" style={{ fontSize: '1.8rem', marginTop: '1rem' }}>PALAK AI</h3>
          <div className="anime-project-category" style={{ fontSize: '1rem' }}>AI / FINANCE</div>
          <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5' }}>Advanced AI tool for smart stock market analysis and financial insights. Built with React and Python.</p>
          <a href="https://github.com/Iitian001/Palak_Ai_stock-expert" target="_blank" rel="noreferrer" className="anime-project-arrow"><ArrowRight size={24} /></a>
        </div>
        <div className="anime-project-card" style={{ padding: '2rem' }}>
          <div className="anime-project-number" style={{ fontSize: '1.5rem', padding: '0.5rem 1rem' }}>02</div>
          <img src="/n8n.png" alt="N8N Templates" className="anime-project-img" style={{ height: '300px' }} />
          <h3 className="anime-project-title" style={{ fontSize: '1.8rem', marginTop: '1rem' }}>N8N TEMPLATES</h3>
          <div className="anime-project-category" style={{ fontSize: '1rem' }}>AUTOMATION</div>
          <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5' }}>Ready-to-use n8n automation workflows for streamlining business processes.</p>
          <a href="https://github.com/Iitian001/N8N_tamplets" target="_blank" rel="noreferrer" className="anime-project-arrow"><ArrowRight size={24} /></a>
        </div>
        <div className="anime-project-card" style={{ padding: '2rem' }}>
          <div className="anime-project-number" style={{ fontSize: '1.5rem', padding: '0.5rem 1rem' }}>03</div>
          <img src="/portfolio.png" alt="3D Portfolio" className="anime-project-img" style={{ height: '300px' }} />
          <h3 className="anime-project-title" style={{ fontSize: '1.8rem', marginTop: '1rem' }}>3D PORTFOLIO</h3>
          <div className="anime-project-category" style={{ fontSize: '1rem' }}>REACT / WEBGL</div>
          <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5' }}>An interactive 3D web experience built with React Three Fiber.</p>
          <a href="https://shreyashmishra.in" target="_blank" rel="noreferrer" className="anime-project-arrow"><ArrowRight size={24} /></a>
        </div>
        <div className="anime-project-card" style={{ padding: '2rem' }}>
          <div className="anime-project-number" style={{ fontSize: '1.5rem', padding: '0.5rem 1rem' }}>04</div>
          <img src="/shreyash.png" alt="Shreyash Code" className="anime-project-img" style={{ height: '300px' }} />
          <h3 className="anime-project-title" style={{ fontSize: '1.8rem', marginTop: '1rem' }}>SHREYASH CODE</h3>
          <div className="anime-project-category" style={{ fontSize: '1rem' }}>PYTHON SCRIPTS</div>
          <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5' }}>A collection of advanced Python automation scripts and tools.</p>
          <a href="https://github.com/Iitian001/Shreyash_code-" target="_blank" rel="noreferrer" className="anime-project-arrow"><ArrowRight size={24} /></a>
        </div>
      </div>
    </section>
  );

  const renderServices = () => (
    <section className="anime-page stagger-1" style={{ paddingBottom: '4rem' }}>
      <h1 className="anime-title" style={{ fontSize: '5rem', marginBottom: '3rem', marginTop: '1rem' }}>WHAT I DO</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="anime-box dark" style={{ padding: '2.5rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div className="anime-service-icon" style={{ background: '#3a86ff', width: '80px', height: '80px', flexShrink: 0 }}><PenTool size={40} color="white" /></div>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 900 }}>UI/UX DESIGN</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>Creating bold, user-centric interfaces that not only look spectacular but provide intuitive user experiences.</p>
          </div>
        </div>
        <div className="anime-box dark" style={{ padding: '2.5rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div className="anime-service-icon" style={{ background: '#ff006e', width: '80px', height: '80px', flexShrink: 0 }}><Monitor size={40} color="white" /></div>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 900 }}>WEB DEVELOPMENT</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>Building fast, scalable, and responsive web applications using modern frameworks like React and Next.js.</p>
          </div>
        </div>
        <div className="anime-box dark" style={{ padding: '2.5rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div className="anime-service-icon" style={{ background: '#ffbe0b', width: '80px', height: '80px', flexShrink: 0 }}><Code size={40} color="black" /></div>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 900, color: 'var(--neon-yellow)' }}>AI ARCHITECTURE</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>Designing and integrating intelligent AI models into existing systems to automate reasoning and enhance capabilities.</p>
          </div>
        </div>
        <div className="anime-box dark" style={{ padding: '2.5rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div className="anime-service-icon" style={{ background: '#8338ec', width: '80px', height: '80px', flexShrink: 0 }}><Target size={40} color="white" /></div>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 900 }}>WORKFLOW AUTOMATION</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>Streamlining complex business processes with n8n and Python scripts to save hundreds of hours of manual work.</p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="anime-layout">
      
      {/* SIDEBAR */}
      <aside className="anime-sidebar">
        <div className="anime-logo glitch-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          S. <span style={{ fontFamily: 'Inter', fontSize: '1.4rem', fontWeight: 900, letterSpacing: '2px', transform: 'translateY(4px)' }}>SHREYASH</span>
        </div>
        
        <nav className="anime-nav">
          <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('home'); }} className={`anime-nav-link glitch-hover ${activePage === 'home' ? 'active' : ''}`}><Home size={20} /> HOME</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('about'); }} className={`anime-nav-link glitch-hover ${activePage === 'about' ? 'active' : ''}`}><User size={20} /> ABOUT</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('certificates'); }} className={`anime-nav-link glitch-hover ${activePage === 'certificates' ? 'active' : ''}`}><Star size={20} /> CERTS</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('projects'); }} className={`anime-nav-link glitch-hover ${activePage === 'projects' ? 'active' : ''}`}><Cpu size={20} /> PROJECTS</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('services'); }} className={`anime-nav-link glitch-hover ${activePage === 'services' ? 'active' : ''}`}><Star size={20} /> SERVICES</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('contact'); }} className={`anime-nav-link glitch-hover ${activePage === 'contact' ? 'active' : ''}`}><Mail size={20} /> CONTACT</a>
        </nav>

        <div className="anime-sidebar-bottom">
          <img src="/anime-sidebar.jpg" alt="Anime Character" className="anime-sidebar-avatar" />
          <div className="anime-socials">
            <a href="https://github.com/Iitian001" target="_blank" rel="noreferrer" className="anime-social-icon"><FaGithub size={20} /></a>
            <a href="https://linkedin.com/in/shreyashautomation" target="_blank" rel="noreferrer" className="anime-social-icon"><FaLinkedin size={20} /></a>
            <a href="#" className="anime-social-icon"><FaTwitter size={20} /></a>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="anime-main">
        {activePage === 'home' && renderHome()}
        {activePage === 'about' && renderAbout()}
        {activePage === 'certificates' && renderCertificates()}
        {activePage === 'projects' && renderProjects()}
        {activePage === 'services' && renderServices()}
        {activePage === 'contact' && renderContact()}
      </main>
    </div>
  );
};

export default AnimeLayout;
