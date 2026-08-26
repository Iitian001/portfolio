import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import '../layouts/sketchbook.css';

const projects = [
  {
    id: 'palak',
    title: 'Palak AI Stock Expert',
    tech: 'AI / Data / Finance',
    desc: 'An advanced financial analytics dashboard that uses AI to provide actionable stock market insights and predictions.',
    image: '/palak.jpg',
  },
  {
    id: 'n8n',
    title: 'n8n Templates',
    tech: 'Automation / Workflows',
    desc: 'A highly organized collection of ready-to-use n8n automation workflows designed to streamline complex business logic.',
    image: '/projects/n8n.webp',
  },
  {
    id: 'portfolio',
    title: '3D Portfolio',
    tech: 'React / Three.js / WebGL',
    desc: 'An immersive 3D interactive web portfolio built to showcase creative development and complex rendering techniques.',
    image: '/portfolio.png',
  },
  {
    id: 'shreyash-code',
    title: 'Shreyash Code',
    tech: 'Python / Scripts',
    desc: 'A suite of powerful Python scripts utilized for data processing, automation, and backend system tasks.',
    image: '/projects/shreyash-code.png',
  },
  {
    id: 'artbloom',
    title: 'ArtBloom',
    tech: 'AI / Image Generation Platform',
    desc: 'An advanced AI image generation platform empowering users to seamlessly create beyond their imagination.',
    image: '/projects/artbloom.png',
  },
  {
    id: 'autogpt',
    title: 'AutoGPT Core Contributor',
    tech: 'Open Source / Feature Dev',
    desc: 'Contributed the "Most Recently Ran" sorting feature in the Library for the official AutoGPT open-source platform.',
    image: '/projects/autogpt-contrib.png',
  },
];

const ProjectsPage = () => {
  return (
    <div className="sketch-body">
      <div className="sketch-container">

        <header className="sketch-header">
          <Link to="/" className="sketch-logo">Portfolio.</Link>
          <nav className="sketch-nav">
            <Link to="/">Home</Link>
            <Link to="/certificates">Certificates</Link>
            <span className="sketch-nav-active">Work</span>
            <a href="mailto:shreyash.aiml.dev@gmail.com">Contact</a>
          </nav>
        </header>

        <section className="sketch-page-hero">
          <h1 className="sketch-page-title">Things I've Built</h1>
          <p className="sketch-page-subtitle">A collection of projects that reflect my journey as a developer</p>
        </section>

        <div className="sketch-grid">
          {projects.map((project) => (
            <div key={project.id} className="sketch-box sketch-project-card">
              <div className="sketch-project-img-wrap">
                <img src={project.image} alt={project.title} className="sketch-project-img" onError={(e) => { e.target.src='/placeholder.png'; }} />
              </div>
              <h3 className="sketch-project-title">{project.title}</h3>
              <div className="sketch-project-tech">{project.tech}</div>
              <p className="sketch-project-desc">{project.desc}</p>
              <Link to={`/project/${project.id}`} className="sketch-btn">View Details <ArrowRight size={18} /></Link>
            </div>
          ))}
        </div>

        <footer className="sketch-footer">
          <div className="sketch-footer-signature">Handcrafted by Shreyash</div>
          <div className="sketch-footer-copy">&copy; 2026 All rights reserved</div>
        </footer>
      </div>
    </div>
  );
};

export default ProjectsPage;
