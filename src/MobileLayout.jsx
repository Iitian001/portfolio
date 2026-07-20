import React from 'react';
import { Home, User, Settings, Mail, ArrowRight, Code, Terminal, Monitor, Sparkles } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import './mobile.css';

export default function MobileLayout() {
  return (
    <div className="sarcastic-mobile">
      {/* Header */}
      <header className="s-header">
        <div className="s-logo">&lt; <span style={{color: '#a855f7'}}>{':)'}</span> /&gt;</div>
        <button className="s-menu-btn">
          <div className="s-menu-dot"></div> MENU
        </button>
      </header>

      {/* Hero Section */}
      <section className="s-hero">
        <div className="s-hero-text">
          <h1>I BUILD.<br/>I AUTOMATE.<br/><span className="s-highlight">I SHIP.</span></h1>
          <p className="s-hero-sub">
            Full-stack AI developer who writes code that works and workflows that save hours <span style={{color: '#a855f7'}}>(in a good way)</span>.
          </p>
          <button className="s-btn-primary">
            VIEW MY WORK <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="s-hero-visual">
          <div className="s-speech-bubble s-bubble-1">console.log("hello world");</div>
          <div className="s-speech-bubble s-bubble-2">always();</div>
          
          <div className="s-avatar-wrapper">
             <model-viewer src="/avatar1.glb" alt="3D Avatar" camera-controls disable-zoom style={{ width: '150px', height: '150px', backgroundColor: 'transparent' }}></model-viewer>
             <div className="s-laptop-prop">
               <Code size={20} color="white" />
               <div style={{fontSize: '0.6rem', textAlign: 'right', fontWeight: 'bold', color: 'white'}}>BUGS<br/>FEAR<br/>ME</div>
             </div>
          </div>
          
          <div className="s-sticker">
            SHIPS<br/>FAST
          </div>
        </div>
      </section>

      {/* Code Block */}
      <section className="s-code-section">
        <div className="s-code-window">
          <div className="s-code-dots">
            <span style={{backgroundColor: '#ff5f56'}}></span>
            <span style={{backgroundColor: '#ffbd2e'}}></span>
            <span style={{backgroundColor: '#27c93f'}}></span>
          </div>
          <pre className="s-code-content">
            <span className="c-line"><span className="c-num">1</span>  <span className="c-keyword">const</span> <span className="c-var">developer</span> = {'{'}</span>
            <span className="c-line"><span className="c-num">2</span>    <span className="c-prop">name:</span> <span className="c-str">"Shreyash Mishra"</span>,</span>
            <span className="c-line"><span className="c-num">3</span>    <span className="c-prop">skills:</span> [<span className="c-str">"React"</span>, <span className="c-str">"Python"</span>, <span className="c-str">"AI"</span>],</span>
            <span className="c-line"><span className="c-num">4</span>    <span className="c-prop">motto:</span> <span className="c-str">"Code. Automate. Repeat."</span>,</span>
            <span className="c-line"><span className="c-num">5</span>  {'};'}</span>
            <span className="c-line"><span className="c-num">6</span>  </span>
            <span className="c-line"><span className="c-num">7</span>  <span className="c-var">developer</span>.<span className="c-prop">workingHard</span> = <span className="c-keyword">true</span>;</span>
          </pre>
        </div>

        <div className="s-status-card">
          <div className="s-status-header">CURRENT STATUS</div>
          <h3>Building smart AI tools & automating boring tasks</h3>
          <ul className="s-status-list">
            <li>&gt; Coffee: <span style={{color: '#ffbd2e'}}>3 cups</span></li>
            <li>&gt; Efficiency: <span style={{color: '#ffbd2e'}}>99%</span></li>
          </ul>
          <div className="s-status-badge">&gt; available_for_hire();</div>
        </div>
      </section>

      {/* What I Do Section */}
      <section className="s-what-i-do">
        <div className="s-section-badge">WHAT I DO</div>
        <div className="s-bento-container">
          <div className="s-bento-card s-bento-purple">
            <div className="s-bento-icon"><Code size={24} /></div>
            <h4>WEB DEVELOPMENT</h4>
            <p>Clean code, modern stacks, responsive designs.</p>
          </div>
          <div className="s-bento-card">
            <div className="s-bento-icon"><Terminal size={24} /></div>
            <h4>PYTHON SCRIPTS</h4>
            <p>Data processing, automation & everything in between.</p>
          </div>
          <div className="s-bento-card">
            <div className="s-bento-icon"><Sparkles size={24} /></div>
            <h4>AI ENGINEERING</h4>
            <p>Smart models turning data into real world magic.</p>
          </div>
          <div className="s-bento-card">
            <div className="s-bento-icon"><Monitor size={24} /></div>
            <h4>WORKFLOWS</h4>
            <p>n8n setups to save time & sanity.</p>
          </div>
        </div>
      </section>

      {/* Featured Project */}
      <section className="s-featured">
        <div className="s-section-header">
          <div className="s-section-badge">FEATURED PROJECT</div>
          <a href="#" className="s-link">SEE ALL PROJECTS <ArrowRight size={12} /></a>
        </div>
        
        <div className="s-project-card">
          <div className="s-project-info">
            <div className="s-project-icon">
               <img src="/palak.jpg" alt="Palak" style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:'12px'}}/>
            </div>
            <div>
              <h3>Palak AI Stock Expert</h3>
              <p>An AI-powered app that analyzes stocks so you don't have to guess.</p>
            </div>
          </div>
          <div className="s-project-tags">
            <span>Python</span>
            <span>React</span>
            <span>Machine Learning</span>
          </div>
          
          <div className="s-code-snippet">
            <div style={{color: '#a855f7', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.8rem'}}>GET <span style={{color: '#9ca3af', fontWeight: 'normal'}}>/api/stock/analyze</span></div>
            <pre>
{`{
  "recommendation": "BUY",
  "reason": "Because the AI said so."
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Latest Commit */}
      <section className="s-commit">
        <div className="s-section-badge">LATEST COMMIT (AKA LIFE UPDATE)</div>
        <div className="s-commit-card">
          <div className="s-quote-mark">"</div>
          <div className="s-commit-text">
            Some days I ship features.<br/>
            Some days I automate workflows.<br/>
            Either way, the commit goes in.<br/>
            <span className="s-commit-author">- Shreyash</span>
          </div>
          <div className="s-meme-box">
             <img src="/meme.jpg" alt="Code that works on first try" style={{width: '100%', borderRadius: '8px'}} onError={(e) => { e.target.src = 'https://i.imgflip.com/1g8my4.jpg'; }} />
          </div>
        </div>
      </section>

      {/* Bottom Nav */}
      <nav className="s-bottom-nav">
        <div className="s-nav-item s-active">
          <Home size={20} />
          <span>HOME</span>
        </div>
        <div className="s-nav-item">
          <User size={20} />
          <span>ABOUT</span>
        </div>
        
        <div className="s-nav-center">
           &lt; <span style={{color: '#fff'}}>{':)'}</span> /&gt;
        </div>
        
        <div className="s-nav-item">
          <Settings size={20} />
          <span>PROJECTS</span>
        </div>
        <div className="s-nav-item">
          <Mail size={20} />
          <span>CONTACT</span>
        </div>
      </nav>
    </div>
  );
}
