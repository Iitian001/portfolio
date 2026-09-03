import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { projects } from '../data/projects';
import PageShell from '../components/PageShell';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import JsonLd from '../components/JsonLd';
import { usePageTitle } from '../hooks/usePageTitle';
import { graph, projectListSchema, breadcrumbSchema } from '../lib/structuredData';

/** Cards in the first grid row are above the fold, so their images load eagerly. */
const EAGER_COUNT = 2;

const ProjectCard = ({ project, index }) => {
  const [imgError, setImgError] = useState(false);
  const eager = index < EAGER_COUNT;

  return (
    // The delay repeats every third card instead of growing with the index, so
    // a row staggers but a card far down the page still appears the moment it
    // is scrolled to. The first card gets no delay at all — its image is the
    // likely Largest Contentful Paint.
    <Reveal className="sketch-box sketch-project-card" delay={(index % 3) * 70}>
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
    </Reveal>
  );
};

const ProjectsPage = () => {
  usePageTitle(
    'Work',
    'Projects by Shreyash — AI platforms, automation workflows, open-source contributions and web applications.',
  );

  return (
    <PageShell>
      {/* The list schema is what lets a crawler treat these as one body of work
          by one person, rather than five unrelated pages that happen to link
          to each other. */}
      <JsonLd
        data={graph(
          projectListSchema(),
          breadcrumbSchema([['Home', '/'], ['Work', '/projects']]),
        )}
      />

      <PageHero
        title="Things I've Built"
        subtitle="A collection of projects that reflect my journey as a developer"
      />

      <div className="sketch-grid" id="work">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </PageShell>
  );
};

export default ProjectsPage;
