// JSON-LD builders.
//
// The rest of the SEO work on this site tells crawlers *where* pages are —
// canonical URLs, a sitemap, robots.txt. None of it tells them *what* they are
// about, or that all of it describes one person. That is what these schemas do:
// they turn "some pages that mention Shreyash" into a single identified entity
// with a job title, verifiable credentials and a body of work.
//
// Person and WebSite are injected into index.html at build time by the plugin in
// vite.config.js, so they are in the served HTML rather than waiting on React —
// crawlers that do not run JavaScript still see them. Everything below that is
// route-specific and rendered by <JsonLd> once the route mounts.
import { site } from '../data/site';
import { skills } from '../data/skills';
import { certificates } from '../data/certificates';
import { projects } from '../data/projects';

// Stable fragment ids, so every schema can point at the same nodes instead of
// repeating them. A crawler treats two identical @id values as one entity.
export const PERSON_ID = `${site.url}/#person`;
export const SITE_ID = `${site.url}/#website`;

const absolute = (path) => `${site.url}${path}`;

/** Canonical URL for a route, matching the rule in usePageTitle. */
export const canonicalFor = (pathname) =>
  pathname === '/' ? `${site.url}/` : `${site.url}${pathname}`;

export const personSchema = () => ({
  '@type': 'Person',
  '@id': PERSON_ID,
  name: site.fullName,
  alternateName: site.name,
  url: `${site.url}/`,
  image: absolute('/sketch-avatar.webp'),
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  address: { '@type': 'PostalAddress', addressCountry: site.location },
  // The accounts that prove this is the same person elsewhere. This is the
  // single most useful key here — it is how a search engine reconciles the
  // GitHub and LinkedIn profiles with this site.
  sameAs: [site.github, site.linkedin],
  knowsAbout: skills.map((skill) => skill.name),
  // Only credentials with a public verification URL are asserted. Claiming one
  // that cannot be checked adds nothing a crawler can trust.
  hasCredential: certificates
    .filter((cert) => cert.url)
    .map((cert) => ({
      '@type': 'EducationalOccupationalCredential',
      name: cert.title,
      url: cert.url,
      credentialCategory: 'certificate',
      recognizedBy: { '@type': 'Organization', name: cert.issuer },
    })),
});

export const websiteSchema = () => ({
  '@type': 'WebSite',
  '@id': SITE_ID,
  url: `${site.url}/`,
  name: site.fullName,
  description: `Portfolio of ${site.fullName} — ${site.role}.`,
  inLanguage: 'en',
  author: { '@id': PERSON_ID },
  publisher: { '@id': PERSON_ID },
});

/** One project, as the work of the person above. */
export const projectSchema = (project) => ({
  '@type': 'CreativeWork',
  '@id': `${absolute(`/project/${project.id}`)}#work`,
  name: project.title,
  description: project.desc,
  url: absolute(`/project/${project.id}`),
  image: absolute(project.image),
  // The live site or repository. Kept as sameAs rather than url so the canonical
  // page for this work stays the detail page on this site.
  sameAs: [project.link],
  keywords: (project.stack ?? [project.tech]).join(', '),
  author: { '@id': PERSON_ID },
  isPartOf: { '@id': SITE_ID },
});

/** The /projects index, as an ordered list pointing at each detail page. */
export const projectListSchema = () => ({
  '@type': 'CollectionPage',
  '@id': `${absolute('/projects')}#collection`,
  name: 'Work',
  url: absolute('/projects'),
  isPartOf: { '@id': SITE_ID },
  about: { '@id': PERSON_ID },
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: project.title,
      url: absolute(`/project/${project.id}`),
    })),
  },
});

/**
 * Breadcrumbs from a [label, path] trail.
 *
 * Worth emitting even though the site has no visible breadcrumb bar: this is one
 * of the few schemas that changes what a search result actually looks like,
 * replacing the raw URL with a readable trail.
 */
export const breadcrumbSchema = (trail) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map(([name, path], index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name,
    item: canonicalFor(path),
  })),
});

/**
 * Wraps schemas in the single @graph document a page should emit. One script tag
 * holding a graph is preferred over several loose ones, because the @id
 * references between them only resolve within a document.
 */
export const graph = (...schemas) => ({
  '@context': 'https://schema.org',
  '@graph': schemas.filter(Boolean),
});
