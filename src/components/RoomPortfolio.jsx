import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Preload, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import DeveloperRoomModel from './DeveloperRoom';
import { FiArrowLeft, FiMail, FiGithub, FiLinkedin, FiInstagram, FiExternalLink, FiHelpCircle } from 'react-icons/fi';
import CanvasLoader from '../Loader';

// Camera controller inside Canvas to smoothly animate position and target
function CameraController({ activeSection }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(-12, 9, 15));
  const targetLook = useRef(new THREE.Vector3(0, 3, 0));

  useEffect(() => {
    switch (activeSection) {
      case 'about':
        // Zoom in on the main computer monitor/desk area
        targetPos.current.set(0.5, 4.0, 5.2);
        targetLook.current.set(0.35, 3.0, 2.0);
        break;
      case 'skills':
        // Move camera to look closely at the hexagon tech shelves
        targetPos.current.set(-2.0, 3.6, 3.8);
        targetLook.current.set(-1.0, 3.2, -1.0);
        break;
      case 'works':
        // Focus on project screen or left shelf desk
        targetPos.current.set(3.2, 4.2, 4.5);
        targetLook.current.set(2.0, 3.3, 0.5);
        break;
      case 'contact':
        // Pan to right shelf/phone area
        targetPos.current.set(1.5, 2.8, 4.0);
        targetLook.current.set(2.4, 2.0, 1.5);
        break;
      case 'default':
      default:
        // Default isometric view of the room
        targetPos.current.set(-12, 9, 15);
        targetLook.current.set(0, 3, 0);
        break;
    }
  }, [activeSection]);

  useFrame((state, delta) => {
    // Smoothly interpolate position and controls target
    camera.position.lerp(targetPos.current, delta * 3.5);
    if (state.controls) {
      state.controls.target.lerp(targetLook.current, delta * 3.5);
      state.controls.update();
    }
  });

  return null;
}

export default function RoomPortfolio({ onClose }) {
  const [activeSection, setActiveSection] = useState('default');
  const [hoveredSection, setHoveredSection] = useState(null);

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  const handleSectionHover = (section) => {
    setHoveredSection(section);
  };

  return (
    <div className="room-portfolio-overlay">
      
      {/* Return to Main Site Button */}
      <button className="room-back-btn" onClick={onClose}>
        <FiArrowLeft size={18} />
        <span>Return to Portfolio</span>
      </button>

      {/* 3D Scene Viewport */}
      <div className="room-canvas-container">
        <Canvas
          camera={{ position: [-12, 9, 15], fov: 38, near: 0.1, far: 100 }}
          shadows
        >
          <Suspense fallback={<CanvasLoader />}>
            <ambientLight intensity={1.5} color="#4c1d95" />
            <directionalLight position={[-5, 12, 5]} intensity={2.0} color="#a78bfa" castShadow />
            <directionalLight position={[10, 8, -5]} intensity={1.5} color="#3b82f6" />
            <pointLight position={[0, 4, 0]} intensity={2.5} color="#c084fc" distance={8} />
            
            <Environment preset="city" />

            <DeveloperRoomModel 
              position={[0, 0, 0]} 
              scale={1.15}
              activeSection={activeSection}
              hoveredSection={hoveredSection}
              onSectionClick={handleSectionClick}
              onSectionHover={handleSectionHover}
            />

            <CameraController activeSection={activeSection} />

            <OrbitControls 
              enableDamping
              dampingFactor={0.05}
              maxPolarAngle={Math.PI / 2 - 0.05} // prevent going below floor
              minPolarAngle={Math.PI / 6}
              maxDistance={22}
              minDistance={4}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Floating UI overlay card panels */}
      <div className="room-ui-overlay">
        
        {/* Helper Tip HUD */}
        {activeSection === 'default' && (
          <div className="room-hud-tip glass-card">
            <FiHelpCircle className="neon-icon-glow" size={24} />
            <div>
              <h3>3D ROOM NAVIGATOR</h3>
              <p>Click on the glowing neon <strong>signs</strong> on the left side of the room to explore specific sections.</p>
            </div>
          </div>
        )}

        {/* Slide-in Card Panel */}
        {activeSection !== 'default' && (
          <div className="room-info-panel glass-card slide-in-right">
            
            {/* Panel Close Header */}
            <div className="panel-header">
              <h2>{activeSection.toUpperCase()}</h2>
              <button className="panel-close-btn" onClick={() => setActiveSection('default')}>×</button>
            </div>

            <div className="panel-body">
              {activeSection === 'about' && (
                <div className="panel-content">
                  <p className="intro-text">Hello! I'm Shreyash, an AI Engineer and Full Stack Developer studying at IIT Kharagpur.</p>
                  <p>I specialize in building intelligent, automated systems. My core philosophy is that <strong>"Anything can be automated"</strong>.</p>
                  <div className="edu-block glass-card">
                    <h4>🎓 Education</h4>
                    <p><strong>IIT Kharagpur</strong></p>
                    <p className="accent-text">B.Tech Student</p>
                  </div>
                  <p>In this stylized 3D room, this desk represents my workstation where I design algorithms, automate pipelines, and build premium full-stack websites.</p>
                </div>
              )}

              {activeSection === 'skills' && (
                <div className="panel-content">
                  <p>I build custom software solutions using a modern technology stack. Here are my core domains:</p>
                  
                  <div className="skills-category">
                    <h4>🤖 AI & Automation</h4>
                    <ul>
                      <li>n8n Workflow Automation</li>
                      <li>LangChain & LLM Agents</li>
                      <li>Python Scripting & Scraping</li>
                    </ul>
                  </div>

                  <div className="skills-category">
                    <h4>💻 Full Stack Development</h4>
                    <ul>
                      <li>React.js / Next.js / Three.js</li>
                      <li>Node.js / Express</li>
                      <li>TailwindCSS / Vanilla CSS</li>
                    </ul>
                  </div>

                  <div className="skills-category">
                    <h4>⚙️ Engineering Tools</h4>
                    <ul>
                      <li>Git & GitHub versioning</li>
                      <li>Docker & Cloud Deployments</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeSection === 'works' && (
                <div className="panel-content">
                  <p>Key featured repositories from my GitHub portfolio:</p>
                  
                  <div className="project-card glass-card">
                    <h4>BHARAT-SCREENER</h4>
                    <p>An intelligent financial stock screener dashboard engineered for Indian stock markets.</p>
                    <a href="https://github.com/Iitian001/BHARAT-SCREENER" target="_blank" rel="noreferrer" className="proj-link">
                      <span>View Code</span> <FiExternalLink size={14} />
                    </a>
                  </div>

                  <div className="project-card glass-card">
                    <h4>N8N_Templates</h4>
                    <p>A repository containing a huge number of production n8n templates for advanced marketing & data automation workflows.</p>
                    <a href="https://github.com/Iitian001/N8N_Templates" target="_blank" rel="noreferrer" className="proj-link">
                      <span>View Code</span> <FiExternalLink size={14} />
                    </a>
                  </div>

                  <div className="project-card glass-card">
                    <h4>Shreyash_code-</h4>
                    <p>Core algorithmic implementations, automation utility scripts, and playground code snippets.</p>
                    <a href="https://github.com/Iitian001/Shreyash_code-" target="_blank" rel="noreferrer" className="proj-link">
                      <span>View Code</span> <FiExternalLink size={14} />
                    </a>
                  </div>
                </div>
              )}

              {activeSection === 'contact' && (
                <div className="panel-content">
                  <p>Feel free to reach out to collaborate on automation projects, AI products, or full-stack web applications!</p>
                  
                  <div className="contact-links-grid">
                    <a href="mailto:hello@shreyashautomation.dev" className="contact-item glass-card">
                      <FiMail size={20} />
                      <div>
                        <h5>Email</h5>
                        <p>hello@shreyashautomation.dev</p>
                      </div>
                    </a>

                    <a href="https://github.com/Iitian001" target="_blank" rel="noreferrer" className="contact-item glass-card">
                      <FiGithub size={20} />
                      <div>
                        <h5>GitHub</h5>
                        <p>github.com/Iitian001</p>
                      </div>
                    </a>

                    <a href="https://www.linkedin.com/in/shreyashautomation" target="_blank" rel="noreferrer" className="contact-item glass-card">
                      <FiLinkedin size={20} />
                      <div>
                        <h5>LinkedIn</h5>
                        <p>linkedin.com/in/shreyashautomation</p>
                      </div>
                    </a>

                    <a href="https://instagram.com/16_hreyash" target="_blank" rel="noreferrer" className="contact-item glass-card">
                      <FiInstagram size={20} />
                      <div>
                        <h5>Instagram</h5>
                        <p>instagram.com/16_hreyash</p>
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            {/* Panel Footer Navigation */}
            <div className="panel-footer">
              <button 
                className="btn-text-nav" 
                onClick={() => setActiveSection('default')}
              >
                Reset Camera View
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
