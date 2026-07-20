import React from 'react';
import { Home, User, Settings, Mail, ArrowRight, Code, Terminal, Monitor, Sparkles, Plus, MoreHorizontal } from 'lucide-react';

export default function MobileLayout() {
  return (
    <div className="sarcastic-mobile">
      {/* Top Light Section */}
      <section className="sm-top-section">
        {/* Header */}
        <header className="sm-header">
          <div className="sm-logo">&lt; / &gt;</div>
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
              <span className="sm-highlight">I SHIP.</span>
            </h1>
            <p className="sm-hero-sub">
              Full-stack developer who writes code that works and jokes that don't. Hire me before I automate my own job.
            </p>
            <button className="sm-btn-primary">
              HIRE ME <ArrowRight size={14} />
            </button>
          </div>

          {/* Right Avatar Card */}
          <div className="sm-hero-right">
            <div className="sm-avatar-card">
              <div className="sm-pill top-pill">AVAILABLE FOR WORK</div>
              
              {/* Replacing 3D model with user's image, simulating the mockup's style */}
              <div className="sm-avatar-image-wrapper">
                 <img src="/avatar.png" alt="Avatar" className="sm-avatar-img" />
              </div>
              
              <div className="sm-pill right-pill">REMOTE</div>
              <div className="sm-pill bottom-pill-badge">
                <div className="sm-star-icon">★</div>
                FRONTEND<br/>DEV
              </div>
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
{`const developer = {
  name: "Shreyash",
  skills: ["React", "Python"],
  motto: "Code. Joke. Ship."
};

developer.work();`}
            </pre>
          </div>

          {/* Status Card */}
          <div className="sm-status-card">
            <p>Add my new API & missing you to the cart.</p>
            <button className="sm-btn-purple">Add to cart <ArrowRight size={12}/></button>
          </div>
        </div>

        {/* Skills/What I Do Slider */}
        <div className="sm-skills-container">
          <div className="sm-skills-badge">&lt; / &gt;</div>
          <div className="sm-skills-scroll">
            <div className="sm-skill-card active-skill">
              <div className="sm-skill-icon"><Code size={20}/></div>
              <h4>Web Dev</h4>
              <p>Clean code, modern stacks, responsive designs.</p>
            </div>
            <div className="sm-skill-card">
              <div className="sm-skill-icon"><Terminal size={20}/></div>
              <h4>Python</h4>
              <p>Data processing, automation & scripts.</p>
            </div>
            <div className="sm-skill-card">
              <div className="sm-skill-icon"><Sparkles size={20}/></div>
              <h4>AI Eng</h4>
              <p>Smart models turning data into magic.</p>
            </div>
            <div className="sm-skill-card">
              <div className="sm-skill-icon"><Monitor size={20}/></div>
              <h4>n8n</h4>
              <p>Workflows to save time & sanity.</p>
            </div>
          </div>
        </div>

        {/* Featured Project */}
        <div className="sm-project-section">
          <div className="sm-project-header">
            <span className="sm-badge">FEATURED PROJECT</span>
          </div>
          <div className="sm-project-box">
            <div className="sm-project-left">
              <div className="sm-project-icon-box">
                <span className="sm-emoji">😂</span>
              </div>
              <div className="sm-project-details">
                <h3>Joke API</h3>
                <p>An API that delivers the worst programming jokes. You've been warned.</p>
              </div>
            </div>
            <div className="sm-project-right">
              <div className="sm-mini-code">
                <div className="sm-code-title">GET /api/joke</div>
                <pre>{`{
  "setup": "Why do...",
  "punchline": "..."
}`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Commit */}
        <div className="sm-commit-section">
          <div className="sm-project-header" style={{marginTop: '1.5rem'}}>
            <span className="sm-badge">LATEST COMMIT</span>
          </div>
          <div className="sm-commit-box">
            <div className="sm-commit-left">
              <span className="sm-quote-mark">"</span>
              <p>Some days I ship features. Some days I automate workflows. Either way, the commit goes in.<br/><span>- Shreyash</span></p>
            </div>
            <div className="sm-commit-right">
              <img src="https://i.imgflip.com/1g8my4.jpg" alt="Success Kid" className="sm-meme-img" />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Nav */}
      <nav className="sm-bottom-nav">
        <div className="sm-nav-item active">
          <Home size={20} />
          <span>HOME</span>
        </div>
        <div className="sm-nav-item">
          <User size={20} />
          <span>ABOUT</span>
        </div>
        
        <div className="sm-nav-center-btn">
          &lt; / &gt;
        </div>
        
        <div className="sm-nav-item">
          <Settings size={20} />
          <span>PROJECTS</span>
        </div>
        <div className="sm-nav-item">
          <Mail size={20} />
          <span>CONTACT</span>
        </div>
      </nav>
    </div>
  );
}
