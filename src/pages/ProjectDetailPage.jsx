import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { getProject, stackOf } from '../data/projects';
import PageShell from '../components/PageShell';
import PageHero from '../components/PageHero';
import JsonLd from '../components/JsonLd';
import { usePageTitle } from '../hooks/usePageTitle';
import { graph, projectSchema, breadcrumbSchema } from '../lib/structuredData';

/**
 * One labelled part of the case study. Returns nothing at all when the field is
 * absent, which is what lets projects.js treat every prose field as optional: a
 * project with no `outcome` yet shows no empty "Outcome" heading.
 */
const CaseSection = ({ title, body, delay }) => {
  if (!body) return null;

  return (
    <section className={`sketch-case-block sketch-enter sketch-enter--${delay}`}>
      <h2 className="sketch-case-title">{title}</h2>
      <p className="sketch-case-body">{body}</p>
    </section>
  );
};

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [imgError, setImgError] = useState(false);
  const project = getProject(id);

  // An unknown :id is a dead URL, not a page worth indexing.
  usePageTitle(project ? project.title : 'Project Not Found', project?.desc, {
    noindex: !project,
  });

  useEffect(() => {
    setImgError(false);
  }, [id]);

  if (!project) {
    return (
      <PageShell>
        <PageHero
          title="Project Not Found"
          subtitle={<>There's no project called &ldquo;{id}&rdquo; here.</>}
        >
          <Link to="/projects" className="sketch-btn sketch-detail-back">
            <ArrowLeft size={20} /> Back to Projects
          </Link>
        </PageHero>
      </PageShell>
    );
  }

  const stack = stackOf(project);
  // Role and year share one line, joined only when both exist, so a project with
  // just a year does not render a stray separator.
  const meta = [project.role, project.year].filter(Boolean).join(' · ');

  return (
    <PageShell>
      <JsonLd
        data={graph(
          projectSchema(project),
          breadcrumbSchema([
            ['Home', '/'],
            ['Work', '/projects'],
            [project.title, `/project/${project.id}`],
          ]),
        )}
      />

      <Link to="/projects" className="sketch-btn sketch-detail-back sketch-enter">
        <ArrowLeft size={20} /> Back to Projects
      </Link>

      {/* The card itself does not fade in: it holds this page's largest image,
          and an element that starts transparent is not eligible for the
          Largest Contentful Paint until it is visible. Its children animate
          instead, and the title only slides. */}
      <article className="sketch-box sketch-detail-card">
        <h1 className="sketch-detail-title sketch-enter sketch-enter--slide">{project.title}</h1>

        {meta && <p className="sketch-detail-meta sketch-enter sketch-enter--2">{meta}</p>}

        {/* The stack is pills rather than the card's slash-separated string: on a
            detail page each technology is a fact worth reading on its own. */}
        <ul className="sketch-stack-list sketch-enter sketch-enter--2">
          {stack.map((item) => (
            <li key={item} className="sketch-stack-item">{item}</li>
          ))}
        </ul>

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

        <p className="sketch-detail-desc sketch-enter sketch-enter--4">{project.desc}</p>

        {project.highlights?.length > 0 && (
          <section className="sketch-case-block sketch-enter sketch-enter--4">
            <h2 className="sketch-case-title">What's in it</h2>
            <ul className="sketch-highlights">
              {project.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        <CaseSection title="The problem" body={project.problem} delay={5} />
        <CaseSection title="The approach" body={project.approach} delay={5} />
        <CaseSection title="The outcome" body={project.outcome} delay={5} />

        <a href={project.link} target="_blank" rel="noreferrer" className="sketch-btn sketch-detail-cta sketch-enter sketch-enter--6">
          {project.linkType === 'github' ? (
            <>View on GitHub <FaGithub size={22} /></>
          ) : (
            <>Visit Live Site <ArrowRight size={22} /></>
          )}
        </a>
      </article>
    </PageShell>
  );
};

export default ProjectDetailPage;
