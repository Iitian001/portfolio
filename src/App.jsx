import React, { Suspense, useState, useEffect } from 'react';
import { FiGithub as Github, FiLinkedin as Linkedin, FiTwitter as Twitter, FiMail as Mail, FiDownload as Download, FiArrowRight as ArrowRight, FiCode as Code2, FiCpu as Brain, FiPenTool as PenTool, FiCheckCircle as CheckCircle, FiAward as Trophy, FiUsers as Users, FiBriefcase as Briefcase } from 'react-icons/fi';
import DesktopPC from './components/DesktopPC';
import EarthCanvas from './components/Earth';
import TechStack from './components/TechStack';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html, useProgress, Stage } from '@react-three/drei';
import { Avatar } from './components/Avatar';
import AboutModel from './components/AboutModel';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './advanced-animations.css';

import CoffeeLoader from './components/CoffeeLoader';
import Cursor from './components/Cursor';
import ScrollProgress from './components/ScrollProgress';
import MagneticButton from './components/MagneticButton';
import Typewriter from './components/Typewriter';

function LoadingScreen() {
  const { progress } = useProgress();
  const [startFade, setStartFade] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    // Only trigger once when progress reaches 100
    if (progress === 100 && !startFade && !hide) {
      // Keep the loading screen completely visible for 2.5 seconds to allow GPU compilation
      const t = setTimeout(() => {
        setStartFade(true); // Triggers the CSS fade-out transition
        
        // Remove from DOM 1 second later after CSS transition finishes
        setTimeout(() => setHide(true), 1000); 
      }, 2500);
      
      return () => clearTimeout(t);
    }
  }, [progress, startFade, hide]);

  if (hide) return null;

  return (
    <div className={`loading-screen ${startFade ? 'fade-out' : ''}`}>
      <div className="loader-content">
        <CoffeeLoader />
        <h1 className="glow-text title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', marginTop: '2rem' }}>SHREYASH.OS</h1>
        <p className="loading-hint">Brewing 3D Experience... {Math.round(progress)}%</p>
      </div>
    </div>
  );
}

function App() {
  const [avatarHovered, setAvatarHovered] = useState(false);
  const [avatarAnimation, setAvatarAnimation] = useState("Idle");
  const [heroParallax, setHeroParallax] = useState({ x: 0, y: 0 });

  const handleHeroMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 30; // 30px max movement
    const y = (clientY / window.innerHeight - 0.5) * 30;
    setHeroParallax({ x, y });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      AOS.init({
        duration: 1000,
        once: true,
        easing: 'ease-out-cubic',
      });
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleAvatarHover = () => {
    setAvatarHovered(true);
    setAvatarAnimation("Dance");
  };

  const handleAvatarLeave = () => {
    setAvatarHovered(false);
    setAvatarAnimation("Idle");
  };

  const handleAvatarClick = () => {
    setAvatarAnimation("ThumbsUp");
    setTimeout(() => setAvatarAnimation(avatarHovered ? "Dance" : "Idle"), 2000);
  };

  return (
    <div className="app-container">
      <Cursor />
      <ScrollProgress />
      <LoadingScreen />
      {/* Navigation */}
      <nav className="navbar glass-card">
        <div className="logo-gold" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="Shreyash Logo" style={{ height: '38px', borderRadius: '4px' }} />
        </div>
        <div className="nav-links">
          <a href="#home" className="active">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </div>
        <MagneticButton className="btn-primary" onClick={() => window.location.href = '#contact'}>Let's Connect <ArrowRight size={16} style={{display: 'inline', marginLeft: '8px'}} /></MagneticButton>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section" onMouseMove={handleHeroMouseMove}>
        <div className="hero-content" data-aos="fade-right" style={{ transform: `translate3d(${heroParallax.x}px, ${heroParallax.y}px, 0)` }}>
          <div className="greeting glass-card">👋 Hi, I'm</div>
          <h1 className="glow-text title">Shreyash</h1>
          <h2 className="subtitle" style={{ minHeight: '3.6rem' }}>
            <Typewriter phrases={['Anything can be automated.', 'Bridging AI and Web Engineering.', 'Complex problems, elegant solutions.']} />
          </h2>
          <p className="description">
            I build scalable web applications, intelligent AI solutions, and full-stack digital experiences.
          </p>
          <div className="hero-buttons">
            <MagneticButton className="btn-primary" onClick={() => window.location.href = '#projects'}>View My Work <ArrowRight size={16} style={{display: 'inline', marginLeft: '8px'}} /></MagneticButton>
            <MagneticButton className="btn-secondary">Download CV <Download size={16} style={{display: 'inline', marginLeft: '8px'}} /></MagneticButton>
          </div>
          <div className="social-links" data-aos="fade-up" data-aos-delay="200">
            <a href="https://github.com/Iitian001" target="_blank" rel="noreferrer" className="glass-card"><Github size={20} /></a>
            <a href="https://www.linkedin.com/in/shreyashautomation" target="_blank" rel="noreferrer" className="glass-card"><Linkedin size={20} /></a>
            <a href="https://instagram.com/16_hreyash" target="_blank" rel="noreferrer" className="glass-card"><Twitter size={20} /></a>
            <a href="#" className="glass-card"><Mail size={20} /></a>
          </div>
        </div>
        <div className="hero-image" style={{ height: '500px', width: '100%', cursor: 'grab' }}>
          <Canvas camera={{ position: [0, 0, 240], fov: 14, near: 100, far: 400 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} color="#4c1d95" />
              <directionalLight position={[10, 10, 10]} intensity={1.5} color="#8b5cf6" />
              <directionalLight position={[-10, 10, -10]} intensity={1} color="#60a5fa" />
              <pointLight position={[0, -5, 20]} intensity={2} color="#a78bfa" />
              <Environment resolution={256}>
                <group rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh position={[0, 5, -9]} scale={[10, 10, 1]}>
                    <planeGeometry />
                    <meshBasicMaterial color="white" />
                  </mesh>
                  <mesh position={[-5, 1, -1]} rotation={[0, Math.PI / 2, 0]} scale={[10, 2, 1]}>
                    <planeGeometry />
                    <meshBasicMaterial color="white" />
                  </mesh>
                  <mesh position={[5, 1, -1]} rotation={[0, -Math.PI / 2, 0]} scale={[10, 2, 1]}>
                    <planeGeometry />
                    <meshBasicMaterial color="white" />
                  </mesh>
                </group>
              </Environment>
              <DesktopPC position={[3, -2, 0]} scale={1.3} />
              <ContactShadows position={[3, -7, 0]} opacity={0.6} scale={50} blur={2.5} far={20} />
              <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} />
            </Suspense>
          </Canvas>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section glass-card">
        <div 
          className="about-image" 
          style={{ width: '100%', height: '400px', cursor: 'pointer' }}
          onPointerEnter={handleAvatarHover}
          onPointerLeave={handleAvatarLeave}
          onClick={handleAvatarClick}
        >
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <Suspense fallback={null}>
              <Stage environment="city" intensity={0.5} adjustCamera={0.85}>
                <AboutModel />
              </Stage>
              <OrbitControls enableZoom={false} makeDefault target={[0, 0.4, 0]} />
            </Suspense>
          </Canvas>
        </div>
        <div className="about-content">
          <span className="section-tag">ABOUT ME</span>
          <h2>Bridging the gap between design and engineering</h2>
          <div className="about-grid">
            <div className="about-text">
              <p>
                Hello! I'm Shreyash, an AI Engineer and Full Stack Developer currently studying at IIT Kharagpur. I'm passionate about building robust systems and believe that <strong>Anything can be automated</strong>.
              </p>
              <p>
                I specialize in creating dynamic web applications, implementing AI solutions, and architecting scalable backend infrastructure. Whether it's crafting beautiful user interfaces or writing complex automation scripts, I love diving deep into the code to solve real-world problems.
              </p>
            </div>
          </div>
          <button className="btn-secondary" style={{marginTop: '1.5rem'}} onClick={() => window.location.href = 'http://localhost:5174/'}>Know More About Me <ArrowRight size={16} style={{display: 'inline', marginLeft: '8px'}} /></button>
        </div>
        <div className="about-cards">
          <div className="skill-item glass-card" data-aos="fade-up" data-aos-delay="100">
            <Code2 size={24} color="#a78bfa" />
            <div>
              <h3>Full Stack Development</h3>
              <p>Building robust, scalable and performant web applications.</p>
            </div>
          </div>
          <div className="skill-item glass-card" data-aos="fade-up" data-aos-delay="200">
            <Brain size={24} color="#a78bfa" />
            <div>
              <h3>AI & Machine Learning</h3>
              <p>Creating intelligent solutions with the power of AI.</p>
            </div>
          </div>
          <div className="skill-item glass-card" data-aos="fade-up" data-aos-delay="300">
            <PenTool size={24} color="#a78bfa" />
            <div>
              <h3>UI/UX Design</h3>
              <p>Designing clean, modern and user-friendly interfaces.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="skills" className="tech-section" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '600px', overflow: 'hidden' }} data-aos="fade-up">
        <h2 
          className="glow-text" 
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            zIndex: 0, 
            fontSize: 'clamp(3rem, 8vw, 6rem)', 
            whiteSpace: 'nowrap',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.2em'
          }}>
          MY TECH STACK
        </h2>
        <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 10 }}>
          <TechStack />
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects-section" data-aos="fade-up">
        <div className="section-header">
          <span className="section-tag">FEATURED PROJECTS</span>
          <a href="https://github.com/Iitian001" target="_blank" rel="noreferrer" className="view-all">View All on GitHub <ArrowRight size={16} style={{display: 'inline'}} /></a>
        </div>
        <div className="projects-grid">
           <a href="https://github.com/Iitian001/N8N_tamplets" target="_blank" rel="noreferrer" className="project-card glass-card" style={{textDecoration: 'none'}} data-aos="fade-up" data-aos-delay="100">
             <div className="project-img-placeholder" style={{backgroundImage: 'url(/projects/n8n.png)', backgroundSize: 'cover', backgroundPosition: 'center', border: 'none'}}></div>
             <h3>N8N_Templates</h3>
             <p>A massive collection of n8n workflow automation templates, updated daily with 10+ new automated systems.</p>
           </a>
           <a href="https://github.com/Iitian001/BHARAT-SCREENER" target="_blank" rel="noreferrer" className="project-card glass-card" style={{textDecoration: 'none'}} data-aos="fade-up" data-aos-delay="200">
             <div className="project-img-placeholder" style={{backgroundImage: 'url(/projects/bharat.png)', backgroundSize: 'cover', backgroundPosition: 'center', border: 'none'}}></div>
             <h3>BHARAT-SCREENER</h3>
             <p>Financial data screener and dashboard analytics tool for the Indian stock market.</p>
           </a>
           <a href="https://github.com/Iitian001/Shreyash_code-" target="_blank" rel="noreferrer" className="project-card glass-card" style={{textDecoration: 'none'}} data-aos="fade-up" data-aos-delay="300">
             <div className="project-img-placeholder" style={{backgroundImage: 'url(/projects/code.png)', backgroundSize: 'cover', backgroundPosition: 'center', border: 'none'}}></div>
             <h3>Shreyash_code-</h3>
             <p>My personal repository of complex code algorithms, scripts, and software engineering experiments.</p>
           </a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section glass-card" data-aos="zoom-in" data-aos-offset="0">
        <div className="stat-item">
          <Trophy size={32} color="#a78bfa" />
          <div className="stat-info">
            <h3>3+</h3>
            <p>Years Experience</p>
          </div>
        </div>
        <div className="stat-item">
          <Briefcase size={32} color="#a78bfa" />
          <div className="stat-info">
            <h3>30+</h3>
            <p>Projects Completed</p>
          </div>
        </div>
        <div className="stat-item">
          <Users size={32} color="#a78bfa" />
          <div className="stat-info">
            <h3>15+</h3>
            <p>Happy Clients</p>
          </div>
        </div>
        <div className="stat-item">
          <CheckCircle size={32} color="#a78bfa" />
          <div className="stat-info">
            <h3>100%</h3>
            <p>Dedication</p>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section glass-card" data-aos="zoom-in-up">
        <div className="contact-left" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="contact-info">
            <span className="section-tag">LET'S WORK TOGETHER</span>
            <h2>Let's Build Something Amazing Together! 🚀</h2>
            <button className="btn-primary" style={{marginTop: '1rem', width: 'fit-content'}}>
              Let's Connect <ArrowRight size={16} style={{display: 'inline', marginLeft: '8px'}} />
            </button>
          </div>
          <div className="contact-details" style={{ paddingLeft: 0 }}>
            <div className="footer-section">
              <h4 style={{ margin: '0 0 1rem 0', color: '#fff', fontSize: '1.2rem' }}>Connect</h4>
              <div className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a href="mailto:hello@shreyashautomation.dev" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#a78bfa', textDecoration: 'none' }}>
                  <Mail size={20} /> hello@shreyashautomation.dev
                </a>
                <a href="https://www.linkedin.com/in/shreyashautomation" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#a78bfa', textDecoration: 'none' }}>
                  <Linkedin size={20} /> linkedin.com/in/shreyashautomation
                </a>
                <a href="https://github.com/Iitian001" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#a78bfa', textDecoration: 'none' }}>
                  <Github size={20} /> github.com/Iitian001
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="contact-3d" style={{ height: '400px', flex: 1.3, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'grab' }}>
          <EarthCanvas />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-bottom">
          <p>© 2024 Shreyash. All rights reserved.</p>
        </div>
        <div className="footer-logo-gold" style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <img src="/logo.png" alt="Shreyash Logo" style={{ height: '70px', borderRadius: '6px' }} />
        </div>
        <p>Made with ❤️ and lots of ☕</p>
      </footer>

    </div>
  );
}

export default App;
