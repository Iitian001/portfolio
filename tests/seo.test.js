// What crawlers see: the sitemap and the JSON-LD graph.
//
// Both are write-only from a visitor's point of view — no page on the site
// renders either one, so a broken @id reference or a project missing from the
// sitemap is invisible until someone runs a validator months later.
import { describe, it, expect } from 'vitest';
import { buildSitemap, sitemapRoutes } from '../src/lib/sitemap';
import { site } from '../src/data/site';
import { projects } from '../src/data/projects';
import { certificates } from '../src/data/certificates';
import {
  PERSON_ID,
  SITE_ID,
  canonicalFor,
  personSchema,
  websiteSchema,
  projectSchema,
  projectListSchema,
  breadcrumbSchema,
  graph,
} from '../src/lib/structuredData';

describe('sitemap', () => {
  const xml = buildSitemap('2026-01-01');

  it('lists every project detail page', () => {
    for (const project of projects) {
      expect(xml).toContain(`<loc>${site.url}/project/${project.id}</loc>`);
    }
  });

  it('lists the three static routes', () => {
    for (const path of ['/', '/projects', '/certificates']) {
      expect(xml).toContain(`<loc>${site.url}${path}</loc>`);
    }
  });

  it('has one <url> per route and nothing extra', () => {
    expect(xml.match(/<url>/g)).toHaveLength(sitemapRoutes().length);
  });

  // A sitemap that lists a noindex page is a contradiction, and the 404 route is
  // the one page that carries the tag.
  it('leaves out the pages that ask not to be indexed', () => {
    expect(xml).not.toContain('/project/undefined');
    expect(xml).not.toContain('404');
  });

  it('uses absolute URLs, which the spec requires', () => {
    for (const loc of xml.match(/<loc>([^<]+)<\/loc>/g)) {
      expect(loc).toContain('https://');
    }
  });

  it('takes the date it is given', () => {
    expect(xml).toContain('<lastmod>2026-01-01</lastmod>');
  });
});

describe('canonicalFor', () => {
  // usePageTitle computes the canonical URL for the browser and canonicalFor
  // computes it for the breadcrumbs. If the two ever disagree, a page's
  // breadcrumb trail names a URL the page itself says is not canonical.
  it('matches the rule in usePageTitle', () => {
    expect(canonicalFor('/')).toBe(`${site.url}/`);
    expect(canonicalFor('/projects')).toBe(`${site.url}/projects`);
    expect(canonicalFor('/project/bloom-chat')).toBe(`${site.url}/project/bloom-chat`);
  });
});

describe('@graph', () => {
  // The @id references between these schemas only resolve inside one document,
  // which is the whole reason they are emitted as a graph rather than as several
  // separate script tags.
  const collectIds = (node, into = new Set()) => {
    if (Array.isArray(node)) node.forEach((item) => collectIds(item, into));
    else if (node && typeof node === 'object') {
      for (const [key, value] of Object.entries(node)) {
        if (key === '@id') into.add(value);
        else collectIds(value, into);
      }
    }
    return into;
  };

  /** Every @id that is only ever referenced, never defined, in one document. */
  const dangling = (document) => {
    const defined = new Set(document['@graph'].map((node) => node['@id']).filter(Boolean));
    return [...collectIds(document['@graph'])].filter((id) => !defined.has(id));
  };

  it('resolves every reference in the document injected into index.html', () => {
    expect(dangling(graph(personSchema(), websiteSchema()))).toEqual([]);
  });

  it('resolves every reference on a project detail page', () => {
    // Person and WebSite come from the block vite.config.js injects into
    // index.html, not from the route — so the union of the two script tags is
    // what a crawler actually reads, and what has to be closed.
    const document = graph(
      projectSchema(projects[0]),
      personSchema(),
      websiteSchema(),
      breadcrumbSchema([['Home', '/'], ['Work', '/projects']]),
    );
    expect(dangling(document)).toEqual([]);
  });

  it('closes the /projects index the same way', () => {
    expect(dangling(graph(projectListSchema(), personSchema(), websiteSchema()))).toEqual([]);
  });

  it('drops absent schemas instead of emitting null nodes', () => {
    expect(graph(personSchema(), undefined, null)['@graph']).toHaveLength(1);
  });
});

describe('Person', () => {
  const person = personSchema();

  it('is identified by the id every other schema points at', () => {
    expect(person['@id']).toBe(PERSON_ID);
    expect(websiteSchema()['@id']).toBe(SITE_ID);
  });

  // sameAs is the key that reconciles this site with the GitHub and LinkedIn
  // profiles — without it a search engine has three unrelated pages about
  // someone with the same name.
  it('links the profiles that prove it is one person', () => {
    expect(person.sameAs).toContain(site.github);
    expect(person.sameAs).toContain(site.linkedin);
  });

  it('reads its job title from site.js rather than repeating it', () => {
    expect(person.jobTitle).toBe(site.role);
  });

  // Asserting a credential a crawler cannot check adds nothing, so entries
  // without a public URL are left out on purpose.
  it('asserts only the credentials that can be verified', () => {
    const verifiable = certificates.filter((cert) => cert.url);
    expect(person.hasCredential).toHaveLength(verifiable.length);
    for (const entry of person.hasCredential) {
      expect(entry.url).toMatch(/^https:\/\//);
      expect(entry.recognizedBy.name).toBeTruthy();
    }
  });

  it('uses absolute URLs, since a crawler may read the graph out of context', () => {
    expect(person.url.startsWith(site.url)).toBe(true);
    expect(person.image.startsWith(site.url)).toBe(true);
  });
});

describe('project schemas', () => {
  it.each(projects.map((project) => [project.id, project]))('%s', (_id, project) => {
    const schema = projectSchema(project);
    // The canonical page for the work is the detail page here, not the live site,
    // so the outside link is sameAs and `url` stays on this domain.
    expect(schema.url).toBe(`${site.url}/project/${project.id}`);
    expect(schema.sameAs).toEqual([project.link]);
    expect(schema.author['@id']).toBe(PERSON_ID);
    expect(schema.isPartOf['@id']).toBe(SITE_ID);
    expect(schema.keywords).toBeTruthy();
  });

  it('lists every project on the index, in order', () => {
    const list = projectListSchema().mainEntity;
    expect(list.numberOfItems).toBe(projects.length);
    expect(list.itemListElement.map((item) => item.position)).toEqual(
      projects.map((_, index) => index + 1),
    );
  });
});

describe('breadcrumbs', () => {
  it('numbers the trail from one and uses canonical URLs', () => {
    const trail = breadcrumbSchema([
      ['Home', '/'],
      ['Work', '/projects'],
      ['Bloom Chat', '/project/bloom-chat'],
    ]);
    expect(trail.itemListElement.map((item) => [item.position, item.item])).toEqual([
      [1, `${site.url}/`],
      [2, `${site.url}/projects`],
      [3, `${site.url}/project/bloom-chat`],
    ]);
  });
});
