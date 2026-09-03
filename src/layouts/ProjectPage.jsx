import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { getProject } from '../data/projects';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { usePageTitle } from '../hooks/usePageTitle';
import './sketchbook.css';

const ProjectPage = () => {
  const { id } = useParams();
  const [imgError, setImgError] = useState(false);
  const project = getProject(id);

  usePageTitle(project ? project.title : 'Project Not Found', project?.desc);

  useEffect(() => {
    setImgError(false);
  }, [id]);

  if (!project) {
    return (
      <div className="sketch-body">
        <div className="sketch-container">
          <SiteHeader />
          <section className="sketch-page-hero">
            <h1 className="sketch-page-title">Project Not Found</h1>
            <p className="sketch-page-subtitle">
              There's no project called &ldquo;{id}&rdquo; here.
            </p>
            <Link to="/projects" className="sketch-btn sketch-detail-back">
              <ArrowLeft size={20} /> Back to Projects
            </Link>
          </section>
          <SiteFooter />
        </div>
      </div>
    );
  }

  return (
    <div className="sketch-body">
      <div className="sketch-container">

        <SiteHeader />

        <Link to="/projects" className="sketch-btn sketch-detail-back">
          <ArrowLeft size={20} /> Back to Projects
        </Link>

        <article className="sketch-box sketch-detail-card">
          <h1 className="sketch-detail-title">{project.title}</h1>
          <div className="sketch-project-tech sketch-detail-tech">{project.tech}</div>

          <div className="sketch-project-img-wrap sketch-detail-img-wrap">
            {imgError ? (
              <div className="sketch-img-placeholder">{project.title}</div>
            ) : (
              <img
                src={project.image}
                alt={`${project.title} preview`}
                className="sketch-project-img"
                width={project.width}
                height={project.height}
                fetchPriority="high"
                decoding="async"
                onError={() => setImgError(true)}
              />
            )}
          </div>

          <p className="sketch-detail-desc">{project.desc}</p>

          <a href={project.link} target="_blank" rel="noreferrer" className="sketch-btn sketch-detail-cta">
            {project.linkType === 'github' ? (
              <>View on GitHub <FaGithub size={22} /></>
            ) : (
              <>Visit Live Site <ArrowRight size={22} /></>
            )}
          </a>
        </article>

        <SiteFooter />
      </div>
    </div>
  );
};

export default ProjectPage;
