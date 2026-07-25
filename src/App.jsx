import React, { useState, useEffect, Suspense } from 'react';
import { Home, User, Star, Mail, ArrowRight, Monitor, Code, Send, Cpu, Settings, Network, Bot, Sparkles, Bell } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import MobileLayout from './MobileLayout';

const SketchbookLayout = React.lazy(() => import('./layouts/SketchbookLayout'));
const AnimeLayout = React.lazy(() => import('./layouts/AnimeLayout'));

const StephaneLayout = () => <div style={{ color: 'white', padding: '5rem', fontSize: '2rem', textAlign: 'center' }}>Stephane Layout (Coming Soon...)</div>;
const LynnLayout = () => <div style={{ color: 'black', padding: '5rem', fontSize: '2rem', textAlign: 'center' }}>Lynn Layout (Coming Soon...)</div>;
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  
  // State for mobile view (Strictly Mobile Devices Only)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    };
    setIsMobile(checkMobile());
  }, []);

  useEffect(() => {
    if (isModalOpen || isServicesModalOpen || isProjectsModalOpen || isAboutModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, isServicesModalOpen, isProjectsModalOpen, isAboutModalOpen]);

  const [randomLayout, setRandomLayout] = useState(null);

  useEffect(() => {
    // If layout is fixed in env, use it. Otherwise, pick a random layout and remember it in localStorage
    const envLayout = import.meta.env.VITE_LAYOUT;
    if (envLayout) {
      setRandomLayout(envLayout);
    } else {
      let savedLayout = null;
      try {
        savedLayout = localStorage.getItem('portfolio-layout');
      } catch (e) {
        console.warn('localStorage is not available:', e);
      }
      
      if (!savedLayout) {
        const layouts = ['brutalist', 'sketchbook', 'anime'];
        savedLayout = layouts[Math.floor(Math.random() * layouts.length)];
        try {
          localStorage.setItem('portfolio-layout', savedLayout);
        } catch (e) {
          // ignore
        }
      }
      setRandomLayout(savedLayout);
    }
  }, []);

  if (isMobile) {
    return <MobileLayout />;
  }

  // Show nothing while calculating the layout to prevent flicker
  if (!randomLayout) return null;

  if (randomLayout === 'sketchbook') return (
    <Suspense fallback={<div style={{height: '100vh', width: '100vw', background: 'white'}} />}>
      <SketchbookLayout />
    </Suspense>
  );
  if (randomLayout === 'anime') return (
    <Suspense fallback={<div style={{height: '100vh', width: '100vw', background: 'black'}} />}>
      <AnimeLayout />
    </Suspense>
  );
  if (randomLayout === 'stephane') return <StephaneLayout />;
  if (randomLayout === 'lynn') return <LynnLayout />;

  return (
    <>
      {/* Projects Modal */}
      {isProjectsModalOpen && (
        <div className="mobile-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="mobile-modal-content" style={{ backgroundColor: 'rgba(20, 25, 45, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '32px', padding: '2.5rem 2rem', width: '100%', maxWidth: '1050px', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            
            {/* Top Bar with FEATURED PROJECTS Badge and Close Button */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.5rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 900, marginBottom: '2rem', color: 'white', backgroundColor: '#f81f72', border: '2px solid rgba(255,255,255,0.1)', textTransform: 'uppercase', alignSelf: 'flex-start' }}>
              <Star size={18} fill="white" /> FEATURED PROJECTS
            </div>

            <button onClick={() => setIsProjectsModalOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '1.2rem', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>✕</button>

            {/* Header Content */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', marginTop: '1rem' }}>
              <div style={{ maxWidth: '600px' }}>
                <h2 style={{ fontSize: '2.8rem', fontWeight: 900, margin: 0, lineHeight: 1.1, color: 'white', textTransform: 'uppercase' }}>
                  Featured Projects
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', marginTop: '1rem', lineHeight: 1.5, fontWeight: 900, textTransform: 'uppercase' }}>
                  A selection of my latest work that solves real-world problems with code, creativity, and performance.
                </p>
              </div>
              <div style={{ backgroundColor: '#ffe500', color: 'black', padding: '0.8rem 1.5rem', borderRadius: '50px', fontWeight: 900, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '2px solid black', boxShadow: '4px 4px 0 black' }}>
                INNOVATIVE • SCALABLE • IMPACTFUL <span style={{fontSize: '1.2rem'}}>🚀</span>
              </div>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', width: '100%' }}>
              
              {/* Card 1 - Pink */}
              <a href="https://github.com/Iitian001/Palak_Ai_stock-expert" target="_blank" rel="noreferrer" style={{ backgroundColor: '#f81f72', borderRadius: '24px', display: 'flex', flexDirection: 'column', border: '3px solid #be1252', textDecoration: 'none', overflow: 'hidden', position: 'relative', boxShadow: 'inset 0 -12px 0 rgba(0,0,0,0.15), 0 15px 30px rgba(0,0,0,0.3)' }}>
                {/* Image Section */}
                <div style={{ position: 'relative', width: '100%', height: '160px', padding: '1rem' }}>
                  <img src="/palak.jpg" alt="Palak AI" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px', border: '2px solid rgba(0,0,0,0.1)' }} />
                  {/* Number Badge */}
                  <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'black', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 900, fontSize: '0.9rem', boxShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>01</div>
                </div>
                {/* Content Section */}
                <div style={{ padding: '0 1.2rem 1.2rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ color: 'white', fontWeight: 900, fontSize: '1.2rem', marginBottom: '0.6rem', lineHeight: '1.1', textTransform: 'uppercase' }}>Palak AI Stock<br/>Expert</h3>
                  <div style={{ display: 'inline-flex', alignSelf: 'flex-start', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '50px', fontWeight: 900, fontSize: '0.75rem', marginBottom: '1rem' }}>AI / FINANCE</div>
                  <p style={{ color: 'white', fontSize: '0.9rem', lineHeight: '1.4', marginBottom: '1.5rem', flexGrow: 1, fontWeight: 700, opacity: 0.9 }}>Advanced AI tool for smart stock market analysis and financial insights.</p>
                  <div style={{ alignSelf: 'flex-end', backgroundColor: 'black', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.2)' }}>
                    <ArrowRight size={18} strokeWidth={3} />
                  </div>
                </div>
              </a>

              {/* Card 2 - Blue */}
              <a href="https://github.com/Iitian001/N8N_tamplets" target="_blank" rel="noreferrer" style={{ backgroundColor: '#217eff', borderRadius: '24px', display: 'flex', flexDirection: 'column', border: '3px solid #1656b5', textDecoration: 'none', overflow: 'hidden', position: 'relative', boxShadow: 'inset 0 -12px 0 rgba(0,0,0,0.15), 0 15px 30px rgba(0,0,0,0.3)' }}>
                {/* Image Section */}
                <div style={{ position: 'relative', width: '100%', height: '160px', padding: '1rem' }}>
                  <img src="/n8n.png" alt="N8N Templates" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px', border: '2px solid rgba(0,0,0,0.1)' }} />
                  <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'black', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 900, fontSize: '0.9rem', boxShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>02</div>
                </div>
                {/* Content Section */}
                <div style={{ padding: '0 1.2rem 1.2rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ color: 'white', fontWeight: 900, fontSize: '1.2rem', marginBottom: '0.6rem', lineHeight: '1.1', textTransform: 'uppercase' }}>n8n Templates</h3>
                  <div style={{ display: 'inline-flex', alignSelf: 'flex-start', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '50px', fontWeight: 900, fontSize: '0.75rem', marginBottom: '1rem' }}>WORKFLOW AUTOMATION</div>
                  <p style={{ color: 'white', fontSize: '0.9rem', lineHeight: '1.4', marginBottom: '1.5rem', flexGrow: 1, fontWeight: 700, opacity: 0.9 }}>Ready-to-use n8n automation workflows for streamlining business processes.</p>
                  <div style={{ alignSelf: 'flex-end', backgroundColor: 'black', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.2)' }}>
                    <ArrowRight size={18} strokeWidth={3} />
                  </div>
                </div>
              </a>

              {/* Card 3 - Purple */}
              <a href="https://shreyashmishra.in" target="_blank" rel="noreferrer" style={{ backgroundColor: '#a855f7', borderRadius: '24px', display: 'flex', flexDirection: 'column', border: '3px solid #7e22ce', textDecoration: 'none', overflow: 'hidden', position: 'relative', boxShadow: 'inset 0 -12px 0 rgba(0,0,0,0.15), 0 15px 30px rgba(0,0,0,0.3)' }}>
                {/* Image Section */}
                <div style={{ position: 'relative', width: '100%', height: '160px', padding: '1rem' }}>
                  <img src="/portfolio.png" alt="Portfolio" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px', border: '2px solid rgba(0,0,0,0.1)' }} />
                  <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'black', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 900, fontSize: '0.9rem', boxShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>03</div>
                </div>
                {/* Content Section */}
                <div style={{ padding: '0 1.2rem 1.2rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ color: 'white', fontWeight: 900, fontSize: '1.2rem', marginBottom: '0.6rem', lineHeight: '1.1', textTransform: 'uppercase' }}>Portfolio</h3>
                  <div style={{ display: 'inline-flex', alignSelf: 'flex-start', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '50px', fontWeight: 900, fontSize: '0.75rem', marginBottom: '1rem' }}>JAVASCRIPT / REACT</div>
                  <p style={{ color: 'white', fontSize: '0.9rem', lineHeight: '1.4', marginBottom: '1.5rem', flexGrow: 1, fontWeight: 700, opacity: 0.9 }}>A stunning 3D interactive portfolio showcasing my design and development skills.</p>
                  <div style={{ alignSelf: 'flex-end', backgroundColor: 'black', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.2)' }}>
                    <ArrowRight size={18} strokeWidth={3} />
                  </div>
                </div>
              </a>

              {/* Card 4 - Orange */}
              <a href="https://github.com/Iitian001/Shreyash_code-" target="_blank" rel="noreferrer" style={{ backgroundColor: '#ff7b00', borderRadius: '24px', display: 'flex', flexDirection: 'column', border: '3px solid #cc6200', textDecoration: 'none', overflow: 'hidden', position: 'relative', boxShadow: 'inset 0 -12px 0 rgba(0,0,0,0.15), 0 15px 30px rgba(0,0,0,0.3)' }}>
                {/* Image Section */}
                <div style={{ position: 'relative', width: '100%', height: '160px', padding: '1rem' }}>
                  <img src="/shreyash.png" alt="Shreyash Code" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px', border: '2px solid rgba(0,0,0,0.1)' }} />
                  <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'black', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 900, fontSize: '0.9rem', boxShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>04</div>
                </div>
                {/* Content Section */}
                <div style={{ padding: '0 1.2rem 1.2rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ color: 'white', fontWeight: 900, fontSize: '1.2rem', marginBottom: '0.6rem', lineHeight: '1.1', textTransform: 'uppercase' }}>Shreyash Code</h3>
                  <div style={{ display: 'inline-flex', alignSelf: 'flex-start', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '50px', fontWeight: 900, fontSize: '0.75rem', marginBottom: '1rem' }}>PYTHON SCRIPTS</div>
                  <p style={{ color: 'white', fontSize: '0.9rem', lineHeight: '1.4', marginBottom: '1.5rem', flexGrow: 1, fontWeight: 700, opacity: 0.9 }}>A collection of powerful Python scripts for data processing and automation.</p>
                  <div style={{ alignSelf: 'flex-end', backgroundColor: 'black', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.2)' }}>
                    <ArrowRight size={18} strokeWidth={3} />
                  </div>
                </div>
              </a>
            </div>

            {/* Bottom Pill */}
            <div style={{ alignSelf: 'center', marginTop: '2.5rem', backgroundColor: 'white', border: '3px solid black', color: 'black', padding: '0.8rem 2rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '4px 4px 0 black' }}>
              More projects coming soon ✨
            </div>
            
          </div>
        </div>
      )}

      {/* Services Modal */}
      {isServicesModalOpen && (
        <div className="mobile-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="mobile-modal-content" style={{ backgroundColor: 'rgba(20, 25, 45, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '32px', padding: '2.5rem 2rem', width: '100%', maxWidth: '1000px', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <button onClick={() => setIsServicesModalOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '1.2rem', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>✕</button>
            
            <div style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.5rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 900, marginBottom: '1.5rem', color: 'black', backgroundColor: '#ffe500', boxShadow: '0 6px 15px rgba(255, 229, 0, 0.4)' }}>
                <Sparkles size={16} /> SERVICES
              </div>
              <h2 style={{ fontSize: 'clamp(3.5rem, 7vw, 5.5rem)', fontWeight: 900, textTransform: 'uppercase', color: '#a855f7', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '1px', WebkitTextStroke: '2px black', textShadow: '1px 1px 0 #000, 2px 2px 0 #000, 3px 3px 0 #000, 4px 4px 0 #000, 5px 5px 0 #000, 6px 6px 0 #000, 7px 7px 0 #000, 8px 8px 0 #000' }}>WHAT I DO</h2>
              <p style={{ fontSize: '1.15rem', maxWidth: '650px', fontWeight: 900, color: 'black', textTransform: 'uppercase', lineHeight: 1.4 }}>I BUILD SMART AI SOLUTIONS AND AUTOMATE WORKFLOWS THAT DRIVE<br/>REAL IMPACT AND SCALE.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', width: '100%', padding: '0 1rem' }}>
              
              {/* Card 1 */}
              <div style={{ background: 'linear-gradient(135deg, #ff3b8f, #f81f72)', padding: '1.5rem 1.2rem', display: 'flex', flexDirection: 'column', textAlign: 'left', position: 'relative', borderRadius: '24px', boxShadow: '0 15px 30px rgba(248, 31, 114, 0.4), inset 2px 2px 6px rgba(255, 255, 255, 0.6), inset -2px -2px 6px rgba(0, 0, 0, 0.15)' }}>
                <div style={{ backgroundColor: 'white', display: 'inline-block', padding: '0.3rem 0.8rem', fontSize: '0.8rem', fontWeight: 900, color: 'black', borderRadius: '20px', boxShadow: '0 6px 12px rgba(0,0,0,0.1)', alignSelf: 'flex-start' }}>01</div>
                <div style={{ alignSelf: 'center', margin: '1.5rem 0 1rem' }}>
                  <Cpu size={50} strokeWidth={3} color="black" />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: '0.8rem', color: 'black' }}>AI<br/>DEVELOPMENT</h3>
                <p style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: '1.5rem', color: 'black', opacity: 0.95, lineHeight: 1.4 }}>CUSTOM AI SOLUTIONS DESIGNED TO SOLVE COMPLEX PROBLEMS AND DELIVER MEASURABLE RESULTS.</p>
                <div style={{ backgroundColor: 'white', alignSelf: 'flex-end', padding: '0.5rem', marginTop: 'auto', cursor: 'pointer', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 12px rgba(0,0,0,0.15)' }}>
                  <ArrowRight size={18} color="black" strokeWidth={3} />
                </div>
              </div>

              {/* Card 2 */}
              <div style={{ background: 'linear-gradient(135deg, #2ae0e0, #13c6d4)', padding: '1.5rem 1.2rem', display: 'flex', flexDirection: 'column', textAlign: 'left', position: 'relative', borderRadius: '24px', boxShadow: '0 15px 30px rgba(19, 198, 212, 0.4), inset 2px 2px 6px rgba(255, 255, 255, 0.6), inset -2px -2px 6px rgba(0, 0, 0, 0.15)' }}>
                <div style={{ backgroundColor: 'white', display: 'inline-block', padding: '0.3rem 0.8rem', fontSize: '0.8rem', fontWeight: 900, color: 'black', borderRadius: '20px', boxShadow: '0 6px 12px rgba(0,0,0,0.1)', alignSelf: 'flex-start' }}>02</div>
                <div style={{ alignSelf: 'center', margin: '1.5rem 0 1rem' }}>
                  <Settings size={50} strokeWidth={3} color="black" />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: '0.8rem', color: 'black' }}>WORKFLOW<br/>AUTOMATION</h3>
                <p style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: '1.5rem', color: 'black', opacity: 0.95, lineHeight: 1.4 }}>STREAMLINE PROCESSES, ELIMINATE REPETITIVE TASKS, AND BOOST PRODUCTIVITY WITH AUTOMATION.</p>
                <div style={{ backgroundColor: 'white', alignSelf: 'flex-end', padding: '0.5rem', marginTop: 'auto', cursor: 'pointer', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 12px rgba(0,0,0,0.15)' }}>
                  <ArrowRight size={18} color="black" strokeWidth={3} />
                </div>
              </div>

              {/* Card 3 */}
              <div style={{ background: 'linear-gradient(135deg, #ff9f29, #ff7b00)', padding: '1.5rem 1.2rem', display: 'flex', flexDirection: 'column', textAlign: 'left', position: 'relative', borderRadius: '24px', boxShadow: '0 15px 30px rgba(255, 123, 0, 0.4), inset 2px 2px 6px rgba(255, 255, 255, 0.6), inset -2px -2px 6px rgba(0, 0, 0, 0.15)' }}>
                <div style={{ backgroundColor: 'white', display: 'inline-block', padding: '0.3rem 0.8rem', fontSize: '0.8rem', fontWeight: 900, color: 'black', borderRadius: '20px', boxShadow: '0 6px 12px rgba(0,0,0,0.1)', alignSelf: 'flex-start' }}>03</div>
                <div style={{ alignSelf: 'center', margin: '1.5rem 0 1rem' }}>
                  <Network size={50} strokeWidth={3} color="black" />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: '0.8rem', color: 'black' }}>MACHINE<br/>LEARNING</h3>
                <p style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: '1.5rem', color: 'black', opacity: 0.95, lineHeight: 1.4 }}>BUILD, TRAIN, AND DEPLOY MACHINE LEARNING MODELS THAT LEARN AND IMPROVE OVER TIME.</p>
                <div style={{ backgroundColor: 'white', alignSelf: 'flex-end', padding: '0.5rem', marginTop: 'auto', cursor: 'pointer', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 12px rgba(0,0,0,0.15)' }}>
                  <ArrowRight size={18} color="black" strokeWidth={3} />
                </div>
              </div>

              {/* Card 4 */}
              <div style={{ background: 'linear-gradient(135deg, #4da3ff, #217eff)', padding: '1.5rem 1.2rem', display: 'flex', flexDirection: 'column', textAlign: 'left', position: 'relative', borderRadius: '24px', boxShadow: '0 15px 30px rgba(33, 126, 255, 0.4), inset 2px 2px 6px rgba(255, 255, 255, 0.6), inset -2px -2px 6px rgba(0, 0, 0, 0.15)' }}>
                <div style={{ backgroundColor: 'white', display: 'inline-block', padding: '0.3rem 0.8rem', fontSize: '0.8rem', fontWeight: 900, color: 'black', borderRadius: '20px', boxShadow: '0 6px 12px rgba(0,0,0,0.1)', alignSelf: 'flex-start' }}>04</div>
                <div style={{ alignSelf: 'center', margin: '1.5rem 0 1rem' }}>
                  <Bot size={50} strokeWidth={3} color="white" />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: '0.8rem', color: 'white' }}>INTELLIGENT<br/>SYSTEMS</h3>
                <p style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: '1.5rem', color: 'white', opacity: 0.95, lineHeight: 1.4 }}>CREATE INTELLIGENT SYSTEMS THAT PERCEIVE, REASON, AND MAKE DECISIONS AUTONOMOUSLY.</p>
                <div style={{ backgroundColor: 'white', alignSelf: 'flex-end', padding: '0.5rem', marginTop: 'auto', cursor: 'pointer', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 12px rgba(0,0,0,0.15)' }}>
                  <ArrowRight size={18} color="black" strokeWidth={3} />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {isModalOpen && (
        <div className="mobile-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="mobile-modal-content" style={{ backgroundColor: 'rgba(20, 25, 45, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '32px', padding: '2.5rem 2rem', width: '100%', maxWidth: '900px', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '1.2rem', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>✕</button>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.5rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 900, marginBottom: '2rem', color: 'black', backgroundColor: '#ffe500', border: '2px solid black', boxShadow: '4px 4px 0 black', textTransform: 'uppercase', alignSelf: 'flex-start' }}>
              <Mail size={18} strokeWidth={3} /> LET'S TALK
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', width: '100%' }}>
              
              {/* Left Side: Details */}
              <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, textTransform: 'uppercase', color: 'white', lineHeight: 1.1, letterSpacing: '1px', WebkitTextStroke: '2px black', textShadow: '4px 4px 0 #000', marginBottom: '1rem' }}>REACH OUT</h2>
                
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'black', lineHeight: 1.5 }}>
                  Interested in collaborating, or just want to say hi? Here are all the ways you can reach me!
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  <a href="mailto:shreyash.aiml.dev@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'white', border: '3px solid black', borderRadius: '16px', boxShadow: '4px 4px 0 black', textDecoration: 'none', color: 'black', fontWeight: 900, fontSize: '1.1rem' }}>
                    <div style={{ backgroundColor: '#217eff', padding: '0.5rem', borderRadius: '10px', color: 'white', border: '2px solid black' }}><Mail size={24} /></div>
                    shreyash.aiml.dev@gmail.com
                  </a>
                  <a href="https://shreyashmishra.in" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'white', border: '3px solid black', borderRadius: '16px', boxShadow: '4px 4px 0 black', textDecoration: 'none', color: 'black', fontWeight: 900, fontSize: '1.1rem' }}>
                    <div style={{ backgroundColor: '#f81f72', padding: '0.5rem', borderRadius: '10px', color: 'white', border: '2px solid black' }}><Monitor size={24} /></div>
                    shreyashmishra.in
                  </a>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <a href="https://github.com/Iitian001" target="_blank" rel="noreferrer" style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '1rem', backgroundColor: '#a855f7', color: 'white', border: '3px solid black', borderRadius: '16px', boxShadow: '4px 4px 0 black' }}>
                      <FaGithub size={28} />
                    </a>
                    <a href="https://www.linkedin.com/in/shreyashautomation" target="_blank" rel="noreferrer" style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '1rem', backgroundColor: '#2ae0e0', color: 'black', border: '3px solid black', borderRadius: '16px', boxShadow: '4px 4px 0 black' }}>
                      <FaLinkedin size={28} />
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Right Side: Form */}
              <div style={{ flex: '1 1 300px', backgroundColor: 'white', padding: '2rem', borderRadius: '24px', border: '4px solid black', boxShadow: '8px 8px 0 black' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem', textTransform: 'uppercase' }}>SEND A MESSAGE</h3>
                <form action="https://api.web3forms.com/submit" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input type="hidden" name="access_key" value="32325e99-d553-4bad-a24a-50f938ffbd0c" />
                  <input type="hidden" name="subject" value="New message from your Portfolio!" />
                  
                  <input type="text" name="name" placeholder="YOUR NAME" required style={{ padding: '1.2rem', borderRadius: '12px', border: '3px solid black', outline: 'none', fontFamily: 'inherit', fontWeight: 800, fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' }} />
                  <input type="email" name="email" placeholder="YOUR EMAIL" required style={{ padding: '1.2rem', borderRadius: '12px', border: '3px solid black', outline: 'none', fontFamily: 'inherit', fontWeight: 800, fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' }} />
                  <textarea name="message" placeholder="WHAT'S ON YOUR MIND?" required rows="4" style={{ padding: '1.2rem', borderRadius: '12px', border: '3px solid black', outline: 'none', resize: 'none', fontFamily: 'inherit', fontWeight: 800, fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' }}></textarea>
                  
                  <button type="submit" style={{ backgroundColor: '#217eff', border: '3px solid black', padding: '1.2rem', color: 'white', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', marginTop: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', borderRadius: '12px', boxShadow: '4px 4px 0 black', transition: 'transform 0.1s' }} onMouseDown={(e) => {e.currentTarget.style.transform = 'translate(4px, 4px)'; e.currentTarget.style.boxShadow = '0 0 0 black';}} onMouseUp={(e) => {e.currentTarget.style.transform = 'translate(0, 0)'; e.currentTarget.style.boxShadow = '4px 4px 0 black';}} onMouseLeave={(e) => {e.currentTarget.style.transform = 'translate(0, 0)'; e.currentTarget.style.boxShadow = '4px 4px 0 black';}}>
                    SEND IT <Send size={20} style={{marginLeft: '0.5rem'}} />
                  </button>
                </form>
              </div>
              
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {isAboutModalOpen && (
        <div className="mobile-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="mobile-modal-content" style={{ backgroundColor: 'rgba(20, 25, 45, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '32px', padding: '2.5rem 2rem', width: '100%', maxWidth: '900px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <button onClick={() => setIsAboutModalOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '1.2rem', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>✕</button>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.5rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 900, marginBottom: '2rem', color: 'white', backgroundColor: '#a855f7', border: '2px solid black', boxShadow: '4px 4px 0 black', textTransform: 'uppercase' }}>
              <User size={18} strokeWidth={3} /> WHO AM I?
            </div>
            
            <h2 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 900, textTransform: 'uppercase', color: 'white', lineHeight: 1.1, marginBottom: '3rem', letterSpacing: '1px', WebkitTextStroke: '2px black', textShadow: '4px 4px 0 #000' }}>CREATIVE DEVELOPER</h2>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              
              {/* Image side */}
              <div style={{ flex: '1 1 250px', maxWidth: '350px' }}>
                <div style={{ borderRadius: '30px', overflow: 'hidden', border: '4px solid black', boxShadow: '8px 8px 0 black', position: 'relative', height: '400px' }}>
                  <img src="/favicon.jpg" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>

              {/* Text side */}
              <div style={{ flex: '2 1 350px', textAlign: 'left' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'black', lineHeight: 1.6, marginBottom: '2rem', border: '3px solid black', padding: '1.5rem', borderRadius: '24px', backgroundColor: 'white', boxShadow: '6px 6px 0 black' }}>
                  Hi! I'm Shreyash, a passionate creative developer specializing in building stunning, high-performance web applications and intelligent systems. I blend bleeding-edge technology with bold, unapologetic design (as you can tell by this neo-brutalist portfolio). 
                  <br/><br/>
                  When I'm not writing code or automating workflows, you can find me exploring new AI architectures or refining my design systems.
                </p>
                
                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  <div style={{ backgroundColor: '#f81f72', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: 900, border: '2px solid black', fontSize: '0.9rem', boxShadow: '3px 3px 0 black' }}>REACT</div>
                  <div style={{ backgroundColor: '#217eff', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: 900, border: '2px solid black', fontSize: '0.9rem', boxShadow: '3px 3px 0 black' }}>PYTHON</div>
                  <div style={{ backgroundColor: '#a855f7', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: 900, border: '2px solid black', fontSize: '0.9rem', boxShadow: '3px 3px 0 black' }}>MACHINE LEARNING</div>
                  <div style={{ backgroundColor: '#ff7b00', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: 900, border: '2px solid black', fontSize: '0.9rem', boxShadow: '3px 3px 0 black' }}>AUTOMATION</div>
                  <div style={{ backgroundColor: '#2ae0e0', color: 'black', padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: 900, border: '2px solid black', fontSize: '0.9rem', boxShadow: '3px 3px 0 black' }}>UX / UI</div>
                </div>

                {/* Certificates Section */}
                <div style={{ marginTop: '3rem', width: '100%' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.5rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 900, marginBottom: '1.5rem', color: 'black', backgroundColor: '#ffe500', border: '2px solid black', boxShadow: '4px 4px 0 black', textTransform: 'uppercase' }}>
                    <Star size={18} strokeWidth={3} /> CERTIFICATES
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <a href="https://learn.deeplearning.ai/certificates/2272a4ee-5c3e-4b27-95fd-b7bd70b0bd27" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', border: '3px solid black', borderRadius: '20px', backgroundColor: '#ff7b00', color: 'white', textDecoration: 'none', boxShadow: '6px 6px 0 black' }}>
                      <div style={{ backgroundColor: 'white', borderRadius: '50%', padding: '1rem', border: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Star size={24} color="black" fill="black" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0, textTransform: 'uppercase' }}>Data Analytics Foundations</h3>
                        <p style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0.3rem 0 0', opacity: 0.9 }}>DeepLearning.AI</p>
                      </div>
                    </a>
                    <a href="https://learn.deeplearning.ai/certificates/907381d1-8616-4b35-9eac-d588876d0d19" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', border: '3px solid black', borderRadius: '20px', backgroundColor: '#217eff', color: 'white', textDecoration: 'none', boxShadow: '6px 6px 0 black' }}>
                      <div style={{ backgroundColor: 'white', borderRadius: '50%', padding: '1rem', border: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Star size={24} color="black" fill="black" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0, textTransform: 'uppercase' }}>Fast Prototyping of GenAI Apps with Streamlit</h3>
                        <p style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0.3rem 0 0', opacity: 0.9 }}>DeepLearning.AI</p>
                      </div>
                    </a>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* Massive Intersecting Background Ribbons */}
      <div className="bg-ribbon ribbon-pink-vertical"></div>
      <div className="bg-ribbon ribbon-pink-horizontal"></div>
      <div className="bg-ribbon ribbon-purple-bottom"></div>
      <div className="shape-orange-ring"></div>
      <div className="shape-yellow-sphere"></div>

      {/* Animated Floating Geometric Shapes */}
      <div className="floating-shapes">
        <div className="shape circle circle-1"></div>
        <div className="shape circle circle-2"></div>
        <div className="shape circle circle-3"></div>
        <div className="shape circle circle-4"></div>
        <div className="shape square square-1"></div>
        <div className="shape square square-2"></div>
        <div className="shape square square-3"></div>
        <div className="shape triangle triangle-1"></div>
        <div className="shape triangle triangle-2"></div>
        <div className="shape triangle triangle-3"></div>
        <div className="shape ring ring-1"></div>
        <div className="shape ring ring-2"></div>
      </div>

      <div className="portfolio-layout">
        
        {/* Sidebar Navigation */}
        <aside className="sidebar" style={{ marginTop: '12rem' }}>
          <div className="box-3d bg-pink" style={{padding: '1.4rem 1.5rem'}}><Home size={28} /> <span className="sidebar-text">HOME</span></div>
          <div className="box-3d bg-purple" onClick={() => setIsAboutModalOpen(true)} style={{padding: '1.4rem 1.5rem', cursor: 'pointer'}}><User size={28} /> <span className="sidebar-text">ABOUT</span></div>
          <div className="box-3d bg-pink" onClick={() => setIsProjectsModalOpen(true)} style={{padding: '1.4rem 1.5rem', cursor: 'pointer'}}>
            <div style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, border: '2px solid #fff', borderRadius: '6px', marginRight: '0.5rem', verticalAlign: 'middle'}}>
              <div style={{width: 12, height: 12, backgroundColor: '#fff', borderRadius: '3px'}}/>
            </div> <span className="sidebar-text">PROJECTS</span>
          </div>
          <div className="box-3d bg-cyan" onClick={() => setIsServicesModalOpen(true)} style={{padding: '1.4rem 1.5rem', cursor: 'pointer'}}><Star size={28} /> <span className="sidebar-text">SERVICES</span></div>
          <div className="box-3d bg-purple" onClick={() => setIsModalOpen(true)} style={{padding: '1.4rem 1.5rem', cursor: 'pointer'}}><Mail size={28} /> <span className="sidebar-text">CONTACT</span></div>

          {/* Character & Social Box */}
          <div className="character-section">
            <div className="character-box">
              <div className="speech-bubble box-3d bg-purple" style={{padding: '1.4rem', textTransform: 'uppercase', boxShadow: 'var(--shadow-small)', fontSize: '1rem'}}>
                LET'S CREATE<br/>SOMETHING<br/>AMAZING!
              </div>
              <model-viewer src="/avatar2.glb" alt="3D Character" camera-controls disable-zoom style={{width: '90%', height: '90%', borderRadius: '30px', borderBottomLeftRadius: '50px', borderBottomRightRadius: '50px', marginBottom: '10px', backgroundColor: 'transparent'}}></model-viewer>
            </div>
            <div className="social-box">
              <a href="https://github.com/Iitian001" target="_blank" rel="noreferrer" style={{color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, backgroundColor: 'var(--color-pink)', borderRadius: '50%', border: '2px solid black'}}><FaGithub size={20} /></a>
              <a href="https://www.linkedin.com/in/shreyashautomation" target="_blank" rel="noreferrer" style={{color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, backgroundColor: 'var(--color-cyan)', borderRadius: '50%', border: '2px solid black'}}><FaLinkedin size={20} /></a>
              <a href="#" style={{color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, backgroundColor: 'var(--color-blue)', borderRadius: '50%', border: '2px solid black'}}><FaTwitter size={20} /></a>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          <div className="mobile-header">
            <div>
              <div className="mobile-header-title">Hello, I'm Shreyash!</div>
              <div className="mobile-header-subtitle">(A dynamic Developer)</div>
            </div>
            <div className="mobile-bell"><Bell size={20} /></div>
          </div>
          
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-text-area">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div className="box-3d bg-purple hello-pill" style={{padding: '0.8rem 2.5rem', fontSize: '1.6rem'}}>HELLO!</div>
                <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Waving%20Hand.png" alt="Waving Hand" style={{ width: '80px', height: '80px', transform: 'rotate(10deg)', filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.4))' }} />
              </div>
              
              <h1>I'M<br/>SHREYASH</h1>
              
              <div className="box-3d bg-purple hero-subtitle" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem', marginTop: '0.5rem' }}>
                AI ENGINEER <span className="dot">•</span> AUTOMATION SPECIALIST <span className="dot">•</span> CREATIVE THINKER
              </div>
              
              <p className="intro-text">
                I build intelligent systems and automate workflows to solve complex problems.
              </p>
              
              <div className="box-3d bg-yellow view-work-btn" style={{ display: 'inline-flex', padding: '1.2rem 1.2rem 1.2rem 2.5rem', fontSize: '1.2rem' }}>
                VIEW MY WORK 
                <div className="view-work-circle" style={{ width: 44, height: 44 }}><ArrowRight size={24} /></div>
              </div>
            </div>
            
            <div className="hero-visuals perspective-container">
               {/* Floating Tags */}
               <div className="box-3d bg-purple tag-float tag-uiux" style={{fontSize: '1.2rem', padding: '1.5rem'}}>AI<br/>MODELS</div>
               <div className="box-3d bg-orange tag-float tag-webdesign" style={{fontSize: '1.2rem', padding: '1.5rem'}}>PYTHON<br/>DEV</div>
               <div className="box-3d bg-cyan tag-float tag-branding" style={{fontSize: '1.2rem', padding: '1.5rem'}}>AUTOMATION</div>
               <div className="box-3d bg-pink tag-float tag-dev" style={{fontSize: '1.2rem', padding: '1.5rem'}}>&lt;/&gt; INTELLIGENCE</div>
               
               {/* Avatar */}
               <div className="avatar-container">
                  <model-viewer src="/avatar1.glb" alt="3D Avatar" camera-controls disable-zoom style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'transparent' }}></model-viewer>
                  <div className="box-3d bg-blue freelance-badge" style={{ fontSize: '0.9rem', padding: '0.8rem 1.5rem', bottom: -10, right: -20, whiteSpace: 'nowrap' }}>
                    <div style={{width: 14, height: 14, backgroundColor: '#00ff88', borderRadius: '50%'}}></div>
                    AVAILABLE FOR FREELANCE
                  </div>
               </div>
            </div>
          </section>

          {/* Featured Projects */}
          <section className="featured-projects">
            <div className="box-3d bg-pink projects-tab">
              <span className="desktop-text">FEATURED PROJECTS</span>
              <span className="mobile-text">Recent Projects</span>
            </div>

            
            <div className="project-grid">
              <a href="https://github.com/Iitian001/Palak_Ai_stock-expert" target="_blank" rel="noreferrer" className="box-3d bg-pink project-card" style={{textDecoration: 'none', color: 'inherit'}}>
                <img src="/palak.jpg" alt="Palak AI" className="project-img" style={{ objectFit: 'cover', padding: 0 }} />
                <div className="project-info">
                  <div>
                    <h3 style={{fontSize: '1.1rem'}}>PALAK AI STOCK EXPERT</h3>
                    <p>AI / FINANCE</p>
                  </div>
                  <div className="project-arrow"><ArrowRight size={14} color="white" /></div>
                </div>
              </a>
              
              <a href="https://github.com/Iitian001/N8N_tamplets" target="_blank" rel="noreferrer" className="box-3d bg-blue project-card" style={{textDecoration: 'none', color: 'inherit'}}>
                <img src="/n8n.png" alt="N8N Templates" className="project-img" style={{ objectFit: 'cover', padding: 0 }} />
                <div className="project-info">
                  <div>
                    <h3 style={{fontSize: '1.1rem'}}>N8N TEMPLATES</h3>
                    <p>WORKFLOW AUTOMATION</p>
                  </div>
                  <div className="project-arrow"><ArrowRight size={14} color="white" /></div>
                </div>
              </a>

              <a href="https://shreyashmishra.in" target="_blank" rel="noreferrer" className="box-3d bg-purple project-card" style={{textDecoration: 'none', color: 'inherit'}}>
                <img src="/portfolio.png" alt="Portfolio" className="project-img" style={{ objectFit: 'cover', padding: 0 }} />
                <div className="project-info">
                  <div>
                    <h3 style={{fontSize: '1.1rem'}}>PORTFOLIO</h3>
                    <p>JAVASCRIPT / REACT</p>
                  </div>
                  <div className="project-arrow"><ArrowRight size={14} color="white" /></div>
                </div>
              </a>

              <a href="https://github.com/Iitian001/Shreyash_code-" target="_blank" rel="noreferrer" className="box-3d bg-orange project-card" style={{textDecoration: 'none', color: 'inherit'}}>
                <img src="/shreyash.png" alt="Shreyash Code" className="project-img" style={{ objectFit: 'cover', padding: 0 }} />
                <div className="project-info">
                  <div>
                    <h3 style={{fontSize: '1.1rem'}}>SHREYASH CODE</h3>
                    <p>PYTHON SCRIPTS</p>
                  </div>
                  <div className="project-arrow"><ArrowRight size={14} color="white" /></div>
                </div>
              </a>
            </div>
          </section>

          {/* Bottom Grid */}
          <section className="bottom-grid">
            {/* About Me */}
            <div className="box-3d bg-cyan bento-block">
              <div>
                <h2>ABOUT ME</h2>
                <p>I'm a passionate UI/UX designer and frontend developer who loves turning ideas into impactful digital products.</p>
              </div>
              <div className="box-3d bg-purple about-me-btn" style={{ alignSelf: 'flex-start' }}>
                MORE ABOUT ME <ArrowRight size={16} />
              </div>
            </div>

            {/* What I Do - Basic (Opens Modal) */}
            <div className="bento-block box-3d bg-purple" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <h3 className="what-i-do-title" style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1.5rem', textAlign: 'center', textShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>
                <span className="desktop-text">WHAT I DO</span>
                <span className="mobile-text">My Expertise</span>
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', width: '100%', marginBottom: '1.5rem' }}>
                <div className="box-3d bg-pink" style={{ padding: '1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <Cpu size={24} color="black" />
                  <p style={{ fontSize: '0.75rem', fontWeight: 900, color: 'black' }}>AI DEV</p>
                </div>
                <div className="box-3d bg-cyan" style={{ padding: '1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <Settings size={24} color="black" />
                  <p style={{ fontSize: '0.75rem', fontWeight: 900, color: 'black' }}>AUTOMATION</p>
                </div>
                <div className="box-3d bg-orange" style={{ padding: '1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <Network size={24} color="black" />
                  <p style={{ fontSize: '0.75rem', fontWeight: 900, color: 'black' }}>ML</p>
                </div>
                <div className="box-3d bg-blue" style={{ padding: '1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <Bot size={24} color="white" />
                  <p style={{ fontSize: '0.75rem', fontWeight: 900, color: 'white' }}>SYSTEMS</p>
                </div>
              </div>

            </div>

            {/* Let's Connect */}
            <div className="box-3d bg-orange bento-block">
              <div>
                <h2>LET'S CONNECT!</h2>
                <a href="https://shreyashmishra.in" target="_blank" rel="noreferrer" style={{ color: 'black', textDecoration: 'none', display: 'block', fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>shreyashmishra.in</a>
                <a href="mailto:shreyash.aiml.dev@gmail.com" style={{ color: 'black', textDecoration: 'none', display: 'block', fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>shreyash.aiml.dev@gmail.com</a>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1rem' }}>
                <button onClick={() => setIsModalOpen(true)} className="box-3d bg-purple connect-btn" style={{ textDecoration: 'none', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center' }}>
                  SAY HELLO <ArrowRight size={18} style={{marginLeft: '0.5rem'}} />
                </button>
                <div className="bg-pink paper-plane">
                  <Send size={32} color="white" />
                </div>
              </div>
            </div>
          </section>

        </main>
      </div>
    </>
  );
}

export default App;
