import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import './sketchbook.css';

const projectsData = {
  'palak': {
    title: 'Palak AI Stock Expert',
    tech: 'AI / Data / Finance',
    desc: 'An advanced financial analytics dashboard that uses AI to provide actionable stock market insights and predictions.',
    image: '/palak.jpg',
    link: 'https://github.com/Iitian001/Palak_Ai_stock-expert',
    linkType: 'github'
  },
  'n8n': {
    title: 'n8n Templates',
    tech: 'Automation / Workflows',
    desc: 'A highly organized collection of ready-to-use n8n automation workflows designed to streamline complex business logic.',
    image: '/projects/n8n.webp',
    link: 'https://github.com/Iitian001/N8N_tamplets',
    linkType: 'github'
  },
  'portfolio': {
    title: '3D Portfolio',
    tech: 'React / Three.js / WebGL',
    desc: 'An immersive 3D interactive web portfolio built to showcase creative development and complex rendering techniques.',
    image: '/portfolio.png',
    link: 'https://shreyashmishra.in',
    linkType: 'live'
  },
  'shreyash-code': {
    title: 'Shreyash Code',
    tech: 'Python / Scripts',
    desc: 'A suite of powerful Python scripts utilized for data processing, automation, and backend system tasks.',
    image: '/projects/shreyash-code.png',
    link: 'https://github.com/Iitian001/Shreyash_code-',
    linkType: 'github'
  },
  'artbloom': {
    title: 'ArtBloom',
    tech: 'AI / Image Generation Platform',
    desc: 'An advanced AI image generation platform empowering users to seamlessly create beyond their imagination.',
    image: '/projects/artbloom.png',
    link: 'https://www.artbloom.tech/',
    linkType: 'live'
  },
  'autogpt': {
    title: 'AutoGPT Core Contributor',
    tech: 'Open Source / Feature Dev',
    desc: 'Contributed the "Most Recently Ran" sorting feature in the Library for the official AutoGPT open-source platform.',
    image: '/projects/autogpt-contrib.png',
    link: 'https://github.com/Significant-Gravitas/AutoGPT/releases/tag/autogpt-platform-beta-v0.6.70',
    linkType: 'github'
  }
};

const ProjectPage = () => {
  const { id } = useParams();
  const project = projectsData[id];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return (
      <div className="sketch-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <h1 className="sketch-title">Project Not Found</h1>
        <Link to="/" className="sketch-btn" style={{ marginTop: '2rem' }}>
          <ArrowLeft size={20} /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="sketch-container" style={{ padding: '2rem' }}>
      <nav style={{ marginBottom: '4rem' }}>
        <Link to="/" className="sketch-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', padding: '0.5rem 1rem' }}>
          <ArrowLeft size={20} /> Back to Portfolio
        </Link>
      </nav>

      <article style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="sketch-box" style={{ padding: '3rem', marginBottom: '4rem' }}>
          <h1 className="sketch-title" style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'left' }}>
            {project.title}
          </h1>
          <div className="sketch-project-tech" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
            {project.tech}
          </div>
          
          <div style={{ marginBottom: '3rem', border: '3px solid var(--ink)', borderRadius: '8px', overflow: 'hidden', padding: '0.5rem', backgroundColor: 'white' }}>
            <img src={project.image} alt={project.title} style={{ width: '100%', display: 'block', borderRadius: '4px' }} />
          </div>

          <div style={{ fontSize: '1.4rem', lineHeight: '1.8', marginBottom: '3rem' }}>
            <p>{project.desc}</p>
          </div>

          <a href={project.link} target="_blank" rel="noreferrer" className="sketch-btn" style={{ display: 'inline-flex', padding: '1rem 2rem', fontSize: '1.4rem', textDecoration: 'none', color: 'inherit' }}>
            {project.linkType === 'github' ? (
              <>View on GitHub <FaGithub size={24} style={{ marginLeft: '1rem' }} /></>
            ) : (
              <>Visit Live Site <ArrowRight size={24} style={{ marginLeft: '1rem' }} /></>
            )}
          </a>
        </div>
      </article>
    </div>
  );
};

export default ProjectPage;
