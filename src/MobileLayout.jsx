import React, { useState } from 'react';
import './mobile.css';
import { Home, User, Settings, Mail, ArrowRight, Code, Terminal, Monitor, Sparkles, Plus, MoreHorizontal } from 'lucide-react';

export default function MobileLayout() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="sarcastic-mobile">
      {/* =========================================
          HOME TAB
          ========================================= */}
      {activeTab === 'home' && (
        <>
          {/* Top Light Section */}
          <section className="sm-top-section">
            {/* Decorative Grid Dots */}
            <div className="sm-grid-pattern"></div>
            
            {/* Header */}
            <header className="sm-header">
              <div className="sm-logo">&lt;<span style={{color: '#8b5cf6'}}>{':)'}</span>/&gt;</div>
              <button className="sm-menu-btn">
                <div className="sm-menu-dot"></div> MENU
              </button>
            </header>

            <div className="sm-hero-container">
              {/* Left Text */}
              <div className="sm-hero-left">
                <h1 className="sm-hero-title">
                  I CODE.<br/>
                  I JOKE.<br/>
                  <span className="sm-highlight">I SHIP<span style={{color: '#8b5cf6'}}>.</span></span>
                </h1>
                <p className="sm-hero-sub">
                  Full-stack developer who<br/>writes code that works and<br/>jokes that hurt <span style={{color: '#8b5cf6'}}>(in a good way)</span>.
                </p>
                <button className="sm-btn-primary" onClick={() => setActiveTab('projects')}>
                  VIEW MY WORK <ArrowRight size={14} color="#8b5cf6" />
                </button>
              </div>

              {/* Right Avatar Card */}
              <div className="sm-hero-right">
                <div className="sm-avatar-card">
                  <div className="sm-pill sm-pill-top">console.log("funny");</div>
                  
                  <div className="sm-avatar-image-wrapper">
                     <img src="/avatar.png" alt="Avatar" className="sm-avatar-img" />
                  </div>
                  
                  <div className="sm-pill sm-pill-right">always();</div>
                </div>
                
                {/* Starburst badge overlapping the card */}
                <div className="sm-starburst">
                  DEPLOYS<br/>&amp;<br/>DAD JOKES
                </div>
              </div>
            </div>
          </section>

          {/* Middle Dark Section */}
          <section className="sm-middle-section">
            <div className="sm-grid-2">
              {/* Code Window */}
              <div className="sm-code-window">
                <div className="sm-window-header">
                  <div className="sm-dots"><span></span><span></span><span></span></div>
                </div>
                <pre className="sm-code-text">
<span style={{color: '#555'}}>1</span> <span style={{color: '#8b5cf6'}}>const</span> <span style={{color: '#ef4444'}}>developer</span> <span style={{color: '#fff'}}>= {'{'}</span>
<span style={{color: '#555'}}>2</span>   <span style={{color: '#60a5fa'}}>name</span><span style={{color: '#fff'}}>:</span> <span style={{color: '#4ade80'}}>"Sarcastic Dev"</span><span style={{color: '#fff'}}>,</span>
<span style={{color: '#555'}}>3</span>   <span style={{color: '#60a5fa'}}>skills</span><span style={{color: '#fff'}}>: [</span><span style={{color: '#4ade80'}}>"React"</span><span style={{color: '#fff'}}>, </span><span style={{color: '#4ade80'}}>"Python"</span><span style={{color: '#fff'}}>, </span><span style={{color: '#4ade80'}}>"C++"</span><span style={{color: '#fff'}}>, </span><span style={{color: '#4ade80'}}>"AI/ML"</span><span style={{color: '#fff'}}>, </span><span style={{color: '#4ade80'}}>"DL"</span><span style={{color: '#fff'}}>, </span><span style={{color: '#4ade80'}}>"Comedy"</span><span style={{color: '#fff'}}>],</span>
<span style={{color: '#555'}}>4</span>   <span style={{color: '#60a5fa'}}>motto</span><span style={{color: '#fff'}}>:</span> <span style={{color: '#4ade80'}}>"Code. Commit. Crack a joke. Repeat."</span><span style={{color: '#fff'}}>,</span>
<span style={{color: '#555'}}>5</span> <span style={{color: '#fff'}}>{'};'}</span>
<span style={{color: '#555'}}>6</span>  
<span style={{color: '#555'}}>7</span> <span style={{color: '#ef4444'}}>developer</span><span style={{color: '#fff'}}>.</span><span style={{color: '#60a5fa'}}>workingHard</span> <span style={{color: '#fff'}}>=</span> <span style={{color: '#8b5cf6'}}>true</span><span style={{color: '#fff'}}>;</span>
                </pre>
              </div>

              {/* Status Card */}
              <div className="sm-status-card">
                <div className="sm-status-title">CURRENT STATUS</div>
                <p>Building cool<br/>stuff &amp; trying<br/>not to be<br/>cringe</p>
                <ul className="sm-status-list">
                  <li><span style={{color: '#666'}}>&gt; Coffee:</span> <span style={{color: '#d97706'}}>2 cups</span></li>
                  <li><span style={{color: '#666'}}>&gt; Humor:</span> <span style={{color: '#d97706'}}>87%</span></li>
                </ul>
                <button className="sm-btn-purple" onClick={() => setActiveTab('contact')}>&gt; available_for_hire();</button>
              </div>
            </div>

            {/* Skills/What I Do Slider */}
            <div className="sm-skills-container">
              <div className="sm-skills-badge">WHAT I DO</div>
              <div className="sm-skills-scroll">
                <div className="sm-skill-card active-skill">
                  <div className="sm-skill-icon">&lt;/&gt;</div>
                  <h4>WEB DEVELOPMENT</h4>
                  <p>Clean code, modern stacks, responsive designs.</p>
                </div>
                <div className="sm-skill-card">
                  <div className="sm-skill-icon"><Terminal size={20}/></div>
                  <h4>BACKEND MAGIC</h4>
                  <p>APIs, databases, auth &amp; everything in between.</p>
                </div>
                <div className="sm-skill-card">
                  <div className="sm-skill-icon"><Sparkles size={20}/></div>
                  <h4>COMEDY ENGINE</h4>
                  <p>Turning real life bugs into reel life laughs.</p>
                </div>
                <div className="sm-skill-card">
                  <div className="sm-skill-icon"><Monitor size={20}/></div>
                  <h4>DEV TOOLS</h4>
                  <p>CLI apps, scripts, automations to save time &amp; sanity.</p>
                </div>
              </div>
            </div>

            {/* Featured Project */}
            <div className="sm-project-section">
              <div className="sm-project-header">
                <span className="sm-badge">FEATURED PROJECT</span>
                <a href="#" className="sm-link" onClick={(e) => { e.preventDefault(); setActiveTab('projects'); }}>SEE ALL PROJECTS <ArrowRight size={10} color="#8b5cf6"/></a>
              </div>
              <div className="sm-project-box">
                <div className="sm-project-left">
                  <div className="sm-project-icon-box">
                    <span className="sm-emoji">😂</span>
                  </div>
                  <div className="sm-project-details">
                    <h3>Joke API</h3>
                    <p>A REST API that serves jokes because laughter is also a service.</p>
                    <div className="sm-project-tags">
                      <span>Node.js</span>
                      <span>Express</span>
                      <span>MongoDB</span>
                      <span>JWT</span>
                    </div>
                  </div>
                </div>
                <div className="sm-project-right">
                  <div className="sm-mini-code">
                    <div className="sm-code-title"><span style={{color: '#4ade80'}}>GET</span> <span style={{color: '#9ca3af'}}>/api/joke/random</span></div>
                    <pre>{`{
  "joke": "Why do developers 
           prefer dark mode?",
  "answer": "Because light 
             attracts bugs."
}`}</pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Latest Commit */}
            <div className="sm-commit-section">
              <div className="sm-project-header" style={{marginTop: '1.5rem'}}>
                <span className="sm-badge">LATEST COMMIT (AKA LIFE UPDATE)</span>
              </div>
              <div className="sm-commit-box">
                <div className="sm-commit-left">
                  <span className="sm-quote-mark">"</span>
                  <p>Some days I ship features.<br/>Some days I ship jokes.<br/>Either way, the commit goes in.<br/><span className="sm-commit-author">- Sarcastic Dev</span></p>
                </div>
                <div className="sm-commit-right">
                  <img src="/avatar.png" alt="Commit Meme" className="sm-meme-img" />
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* =========================================
          ABOUT TAB
          ========================================= */}
      {activeTab === 'about' && (
        <section className="sm-middle-section" style={{ minHeight: '100vh', paddingTop: '3rem' }}>
          <div className="sm-project-header" style={{justifyContent: 'center', marginBottom: '2rem'}}>
            <span className="sm-badge" style={{backgroundColor: '#eab308', color: '#111', fontSize: '0.8rem', padding: '0.5rem 1rem'}}>WHO AM I? (Besides tired)</span>
          </div>
          
          <div className="sm-about-card" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div className="sm-about-img-container" style={{ height: '300px' }}>
              <img src="/favicon.jpg" alt="Profile" className="sm-about-img" />
            </div>
            <div className="sm-about-content" style={{ padding: '2rem' }}>
              <h2 className="sm-about-title" style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>CREATIVE DEVELOPER</h2>
              <p className="sm-about-text" style={{ fontSize: '0.85rem', marginBottom: '1rem', color: '#fff' }}>
                Hi! I'm Shreyash, a passionate creative developer specializing in building stunning, high-performance web applications and intelligent systems. I blend bleeding-edge technology with bold, unapologetic design.
              </p>
              <p className="sm-about-text" style={{ fontSize: '0.85rem', marginBottom: '1.5rem', color: '#ccc' }}>
                When I'm not writing code or automating workflows, you can find me exploring new AI architectures or refining my design systems.
              </p>
              
              <h3 style={{fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#666', marginBottom: '0.8rem'}}>CORE STACK</h3>
              <div className="sm-about-tags" style={{ gap: '0.6rem' }}>
                <span className="sm-tag-react" style={{ padding: '0.4rem 0.8rem', fontSize: '0.6rem' }}>REACT</span>
                <span className="sm-tag-python" style={{ padding: '0.4rem 0.8rem', fontSize: '0.6rem' }}>PYTHON</span>
                <span className="sm-tag-ai" style={{ padding: '0.4rem 0.8rem', fontSize: '0.6rem' }}>AI / ML</span>
                <span className="sm-tag-ui" style={{ padding: '0.4rem 0.8rem', fontSize: '0.6rem' }}>UX / UI</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================
          PROJECTS TAB
          ========================================= */}
      {activeTab === 'projects' && (
        <section className="sm-middle-section" style={{ minHeight: '100vh', paddingTop: '3rem', paddingBottom: '6rem' }}>
          <div className="sm-project-header" style={{justifyContent: 'center', marginBottom: '2rem'}}>
            <span className="sm-badge" style={{backgroundColor: '#8b5cf6', color: '#fff', fontSize: '0.8rem', padding: '0.5rem 1rem'}}>STUFF I BUILT</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px', margin: '0 auto' }}>
            
            {/* Project 1 */}
            <a href="https://github.com/Iitian001/Palak_Ai_stock-expert" target="_blank" rel="noreferrer" className="sm-about-card" style={{ display: 'block', textDecoration: 'none' }}>
              <div className="sm-about-img-container" style={{ height: '160px' }}>
                <img src="/palak.jpg" alt="Palak AI" className="sm-about-img" />
              </div>
              <div className="sm-about-content">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <h2 className="sm-about-title" style={{ fontSize: '1.4rem' }}>Palak AI Stock Expert</h2>
                  <div style={{ backgroundColor: '#1a1a1a', padding: '0.4rem', borderRadius: '50%' }}><ArrowRight size={14} color="#8b5cf6" /></div>
                </div>
                <div className="sm-about-tags" style={{ marginTop: '0.5rem' }}>
                  <span className="sm-tag-react" style={{ backgroundColor: '#f81f72' }}>AI / FINANCE</span>
                </div>
                <p className="sm-about-text" style={{ marginTop: '1rem', color: '#d4d4d4' }}>Advanced AI tool for smart stock market analysis and financial insights.</p>
              </div>
            </a>

            {/* Project 2 */}
            <a href="https://github.com/Iitian001/N8N_tamplets" target="_blank" rel="noreferrer" className="sm-about-card" style={{ display: 'block', textDecoration: 'none' }}>
              <div className="sm-about-img-container" style={{ height: '160px' }}>
                <img src="/n8n.png" alt="N8N" className="sm-about-img" />
              </div>
              <div className="sm-about-content">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <h2 className="sm-about-title" style={{ fontSize: '1.4rem' }}>n8n Templates</h2>
                  <div style={{ backgroundColor: '#1a1a1a', padding: '0.4rem', borderRadius: '50%' }}><ArrowRight size={14} color="#8b5cf6" /></div>
                </div>
                <div className="sm-about-tags" style={{ marginTop: '0.5rem' }}>
                  <span className="sm-tag-react" style={{ backgroundColor: '#217eff' }}>WORKFLOW AUTOMATION</span>
                </div>
                <p className="sm-about-text" style={{ marginTop: '1rem', color: '#d4d4d4' }}>Ready-to-use n8n automation workflows for streamlining business processes.</p>
              </div>
            </a>

            {/* Project 3 */}
            <a href="https://shreyashmishra.in" target="_blank" rel="noreferrer" className="sm-about-card" style={{ display: 'block', textDecoration: 'none' }}>
              <div className="sm-about-img-container" style={{ height: '160px' }}>
                <img src="/portfolio.png" alt="Portfolio" className="sm-about-img" />
              </div>
              <div className="sm-about-content">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <h2 className="sm-about-title" style={{ fontSize: '1.4rem' }}>Portfolio</h2>
                  <div style={{ backgroundColor: '#1a1a1a', padding: '0.4rem', borderRadius: '50%' }}><ArrowRight size={14} color="#8b5cf6" /></div>
                </div>
                <div className="sm-about-tags" style={{ marginTop: '0.5rem' }}>
                  <span className="sm-tag-react" style={{ backgroundColor: '#a855f7' }}>JAVASCRIPT / REACT</span>
                </div>
                <p className="sm-about-text" style={{ marginTop: '1rem', color: '#d4d4d4' }}>A stunning 3D interactive portfolio showcasing my design and development skills.</p>
              </div>
            </a>

            {/* Project 4 */}
            <a href="https://github.com/Iitian001/Shreyash_code-" target="_blank" rel="noreferrer" className="sm-about-card" style={{ display: 'block', textDecoration: 'none' }}>
              <div className="sm-about-img-container" style={{ height: '160px' }}>
                <img src="/shreyash.png" alt="Shreyash Code" className="sm-about-img" />
              </div>
              <div className="sm-about-content">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <h2 className="sm-about-title" style={{ fontSize: '1.4rem' }}>Shreyash Code</h2>
                  <div style={{ backgroundColor: '#1a1a1a', padding: '0.4rem', borderRadius: '50%' }}><ArrowRight size={14} color="#8b5cf6" /></div>
                </div>
                <div className="sm-about-tags" style={{ marginTop: '0.5rem' }}>
                  <span className="sm-tag-react" style={{ backgroundColor: '#ff7b00' }}>PYTHON SCRIPTS</span>
                </div>
                <p className="sm-about-text" style={{ marginTop: '1rem', color: '#d4d4d4' }}>A collection of powerful Python scripts for data processing and automation.</p>
              </div>
            </a>

          </div>
        </section>
      )}

      {/* =========================================
          CONTACT TAB
          ========================================= */}
      {activeTab === 'contact' && (
        <section className="sm-middle-section" style={{ minHeight: '100vh', paddingTop: '3rem', paddingBottom: '6rem' }}>
          <div className="sm-project-header" style={{justifyContent: 'center', marginBottom: '2rem'}}>
            <span className="sm-badge" style={{backgroundColor: '#ef4444', color: '#fff', fontSize: '0.8rem', padding: '0.5rem 1rem'}}>LET'S TALK</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px', margin: '0 auto' }}>
            
            {/* Reach Out Text */}
            <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              <h2 className="sm-about-title" style={{ fontSize: '2.5rem' }}>REACH OUT</h2>
              <p className="sm-about-text" style={{ fontSize: '0.75rem' }}>Interested in collaborating, or just want to say hi? Send me a message!</p>
            </div>

            {/* Social Links Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <a href="mailto:shreyash.designs@gmail.com" className="sm-about-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
                <Mail size={24} color="#8b5cf6" />
                <span style={{ color: '#fff', fontSize: '0.6rem', fontWeight: 700 }}>EMAIL ME</span>
              </a>
              <a href="https://github.com/Iitian001" target="_blank" rel="noreferrer" className="sm-about-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
                <Code size={24} color="#8b5cf6" />
                <span style={{ color: '#fff', fontSize: '0.6rem', fontWeight: 700 }}>GITHUB</span>
              </a>
              <a href="https://www.linkedin.com/in/shreyashautomation" target="_blank" rel="noreferrer" className="sm-about-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
                <User size={24} color="#8b5cf6" />
                <span style={{ color: '#fff', fontSize: '0.6rem', fontWeight: 700 }}>LINKEDIN</span>
              </a>
              <a href="https://shreyashmishra.in" target="_blank" rel="noreferrer" className="sm-about-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
                <Monitor size={24} color="#8b5cf6" />
                <span style={{ color: '#fff', fontSize: '0.6rem', fontWeight: 700 }}>WEBSITE</span>
              </a>
            </div>

            {/* Contact Form */}
            <div className="sm-about-card" style={{ padding: '1.5rem', marginTop: '0.5rem' }}>
              <h3 style={{ color: '#fff', fontSize: '1rem', fontFamily: "'Space Mono', monospace", marginBottom: '1.5rem', textAlign: 'center' }}>SEND A MESSAGE</h3>
              <form action="https://api.web3forms.com/submit" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input type="hidden" name="access_key" value="32325e99-d553-4bad-a24a-50f938ffbd0c" />
                <input type="hidden" name="subject" value="New message from your Mobile Portfolio!" />
                
                <input type="text" name="name" placeholder="YOUR NAME" required style={{ padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#111', color: '#fff', outline: 'none', fontFamily: 'inherit', fontSize: '0.75rem', width: '100%', boxSizing: 'border-box' }} />
                <input type="email" name="email" placeholder="YOUR EMAIL" required style={{ padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#111', color: '#fff', outline: 'none', fontFamily: 'inherit', fontSize: '0.75rem', width: '100%', boxSizing: 'border-box' }} />
                <textarea name="message" placeholder="WHAT'S ON YOUR MIND?" required rows="4" style={{ padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#111', color: '#fff', outline: 'none', resize: 'none', fontFamily: 'inherit', fontSize: '0.75rem', width: '100%', boxSizing: 'border-box' }}></textarea>
                
                <button type="submit" className="sm-btn-purple" style={{ marginTop: '0.5rem', padding: '1rem', fontSize: '0.8rem', justifyContent: 'center' }}>
                  SEND IT <ArrowRight size={16} />
                </button>
              </form>
            </div>

          </div>
        </section>
      )}

      {/* =========================================
          BOTTOM NAV
          ========================================= */}
      <nav className="sm-bottom-nav">
        <div 
          className={`sm-nav-item ${activeTab === 'home' ? 'active-nav' : ''}`} 
          onClick={() => setActiveTab('home')}
          style={{ cursor: 'pointer' }}
        >
          <Home size={18} />
          <span>HOME</span>
        </div>
        <div 
          className={`sm-nav-item ${activeTab === 'about' ? 'active-nav' : ''}`} 
          onClick={() => setActiveTab('about')}
          style={{ cursor: 'pointer' }}
        >
          <User size={18} />
          <span>ABOUT</span>
        </div>
        
        <div className="sm-nav-center-wrapper" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
          <div className="sm-nav-center-btn">
            &lt;<span style={{color: '#fff'}}>{':)'}</span>/&gt;
          </div>
        </div>
        
        <div 
          className={`sm-nav-item ${activeTab === 'projects' ? 'active-nav' : ''}`}
          onClick={() => setActiveTab('projects')}
          style={{ cursor: 'pointer' }}
        >
          <Settings size={18} />
          <span>PROJECTS</span>
        </div>
        <div 
          className={`sm-nav-item ${activeTab === 'contact' ? 'active-nav' : ''}`}
          onClick={() => setActiveTab('contact')}
          style={{ cursor: 'pointer' }}
        >
          <Mail size={18} />
          <span>CONTACT</span>
        </div>
      </nav>
    </div>
  );
}
