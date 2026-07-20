import React from 'react';
import { Home, User, Settings, Mail, ArrowRight, Code, Terminal, Monitor, Sparkles, Plus, MoreHorizontal } from 'lucide-react';

export default function MobileLayout() {
  return (
    <div className="sarcastic-mobile">
      {/* Top Light Section */}
      <section className="sm-top-section">
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
              Full-stack developer who writes code that works and jokes that hurt <span style={{color: '#8b5cf6'}}>(in a good way)</span>.
            </p>
            <button className="sm-btn-primary">
              VIEW MY WORK <ArrowRight size={14} color="#8b5cf6" />
            </button>
          </div>

          {/* Right Avatar Card */}
          <div className="sm-hero-right">
            <div className="sm-avatar-card">
              <div className="sm-pill top-pill">console.log("funny");</div>
              
              <div className="sm-avatar-image-wrapper">
                 {/* This points to the image the user will provide */}
                 <img src="/sarcastic_avatar.png" alt="Avatar" className="sm-avatar-img" />
              </div>
              
              <div className="sm-pill right-pill">always();</div>
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
{`1  const developer = {
2    name: "Sarcastic Dev",
3    skills: ["React", "Node.js", "MongoDB", "Comedy"],
4    motto: "Code. Commit. Crack a joke. Repeat.",
5  };
6  
7  developer.workingHard = true;`}
            </pre>
          </div>

          {/* Status Card */}
          <div className="sm-status-card">
            <div className="sm-status-title">CURRENT STATUS</div>
            <p>Building cool stuff & trying not to be cringe</p>
            <ul className="sm-status-list">
              <li>&gt; Coffee: <span style={{color: '#d97706'}}>2 cups</span></li>
              <li>&gt; Humor: <span style={{color: '#d97706'}}>87%</span></li>
            </ul>
            <button className="sm-btn-purple">&gt; available_for_hire();</button>
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
              <p>APIs, databases, auth & everything in between.</p>
            </div>
            <div className="sm-skill-card">
              <div className="sm-skill-icon"><Sparkles size={20}/></div>
              <h4>COMEDY ENGINE</h4>
              <p>Turning real life bugs into reel life laughs.</p>
            </div>
            <div className="sm-skill-card">
              <div className="sm-skill-icon"><Monitor size={20}/></div>
              <h4>DEV TOOLS</h4>
              <p>CLI apps, scripts, automations to save time & sanity.</p>
            </div>
          </div>
        </div>

        {/* Featured Project */}
        <div className="sm-project-section">
          <div className="sm-project-header">
            <span className="sm-badge">FEATURED PROJECT</span>
            <a href="#" className="sm-link">SEE ALL PROJECTS <ArrowRight size={12} /></a>
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
                <div className="sm-code-title">GET /api/joke/random</div>
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
              <p>Some days I ship features.<br/>Some days I ship jokes.<br/>Either way, the commit goes in.<br/><span>- Sarcastic Dev</span></p>
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
          <Home size={18} />
          <span>HOME</span>
        </div>
        <div className="sm-nav-item">
          <User size={18} />
          <span>ABOUT</span>
        </div>
        
        <div className="sm-nav-center-btn">
          &lt;<span style={{color: '#fff'}}>{':)'}</span>/&gt;
        </div>
        
        <div className="sm-nav-item">
          <Settings size={18} />
          <span>PROJECTS</span>
        </div>
        <div className="sm-nav-item">
          <Mail size={18} />
          <span>CONTACT</span>
        </div>
      </nav>
    </div>
  );
}
