import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { projects } from '../data/projects';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import '../layouts/sketchbook.css';

const ProjectCard = ({ project }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="sketch-box sketch-project-card">
      <div className="sketch-project-img-wrap">
        {imgError ? (
          <div className="sketch-img-placeholder">{project.title}</div>
        ) : (
          <img
            src={project.image}
            alt={project.title}
            className="sketch-project-img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <h3 className="sketch-project-title">{project.title}</h3>
      <div className="sketch-project-tech">{project.tech}</div>
      <p className="sketch-project-desc">{project.desc}</p>
      <Link to={`/project/${project.id}`} className="sketch-btn">
        View Details <ArrowRight size={18} />
      </Link>
    </div>
  );
};

const ProjectsPage = () => {
  return (
    <div className="sketch-body">
      <div className="sketch-container">

        <SiteHeader />

        <section className="sketch-page-hero">
          <h1 className="sketch-page-title">Things I've Built</h1>
          <p className="sketch-page-subtitle">A collection of projects that reflect my journey as a developer</p>
        </section>

        <div className="sketch-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <SiteFooter />
      </div>
    </div>
  );
};

export default ProjectsPage;
