import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { projects } from '../data/projects';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { usePageTitle } from '../hooks/usePageTitle';
import '../layouts/sketchbook.css';

/** Cards in the first grid row are above the fold, so their images load eagerly. */
const EAGER_COUNT = 2;

const ProjectCard = ({ project, index }) => {
  const [imgError, setImgError] = useState(false);
  const eager = index < EAGER_COUNT;

  return (
    <div className="sketch-box sketch-project-card">
      <div className="sketch-project-img-wrap">
        {imgError ? (
          <div className="sketch-img-placeholder">{project.title}</div>
        ) : (
          <img
            src={project.image}
            alt={`${project.title} preview`}
            className="sketch-project-img"
            width={project.width}
            height={project.height}
            loading={eager ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'auto'}
            decoding="async"
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
  usePageTitle(
    'Work',
    'Projects by Shreyash — AI platforms, automation workflows, open-source contributions and web applications.',
  );

  return (
    <div className="sketch-body">
      <a href="#work" className="sketch-skip-link">Skip to projects</a>

      <div className="sketch-container">

        <SiteHeader />

        <section className="sketch-page-hero">
          <h1 className="sketch-page-title">Things I've Built</h1>
          <p className="sketch-page-subtitle">A collection of projects that reflect my journey as a developer</p>
        </section>

        <div className="sketch-grid" id="work">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <SiteFooter />
      </div>
    </div>
  );
};

export default ProjectsPage;
