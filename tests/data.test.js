// The project list is the one piece of data the whole site is built out of: the
// grid, the detail pages, the sitemap and the CreativeWork schemas all read it.
// A malformed entry there does not fail loudly — it renders a card with a broken
// image, or a detail page at a URL the sitemap never mentions.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { projects, getProject, stackOf } from '../src/data/projects';
import { certificates } from '../src/data/certificates';
import { skills } from '../src/data/skills';

describe('getProject', () => {
  it('finds a project by id', () => {
    expect(getProject('bloom-chat')?.title).toBe('Bloom Chat');
  });

  // ProjectDetailPage relies on this: `undefined` is what renders the not-found
  // state instead of throwing on a property of nothing.
  it('returns undefined for an unknown id rather than throwing', () => {
    expect(getProject('nope')).toBeUndefined();
    expect(getProject(undefined)).toBeUndefined();
  });
});

describe('stackOf', () => {
  it('prefers the explicit stack array', () => {
    expect(stackOf({ stack: ['Next.js', 'SQLite'], tech: 'ignored' })).toEqual([
      'Next.js',
      'SQLite',
    ]);
  });

  // The fallback keeps entries that predate `stack` working, since `tech` is the
  // slash-separated string the cards have always shown.
  it('splits the tech string when there is no stack', () => {
    expect(stackOf({ tech: 'Python / Scripts' })).toEqual(['Python', 'Scripts']);
  });

  it('drops the empty piece left by a trailing slash', () => {
    expect(stackOf({ tech: 'Python /' })).toEqual(['Python']);
  });

  it('gives every real project at least one pill', () => {
    for (const project of projects) {
      expect(stackOf(project).length).toBeGreaterThan(0);
    }
  });
});

describe('project entries', () => {
  // Duplicated ids would make one of the two unreachable: getProject returns the
  // first match, and both would claim the same URL in the sitemap.
  it('have unique ids', () => {
    const ids = projects.map((project) => project.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  // A missing id would produce the URL /project/undefined.
  it.each(projects.map((project) => [project.id, project]))(
    '%s carries the fields every page reads',
    (_id, project) => {
      expect(project.id).toMatch(/^[a-z0-9-]+$/);
      expect(project.title).toBeTruthy();
      expect(project.desc).toBeTruthy();
      expect(project.image.startsWith('/')).toBe(true);
      expect(project.link.startsWith('https://')).toBe(true);
      expect(['github', 'live']).toContain(project.linkType);
    },
  );

  // Without both numbers the browser has no aspect ratio to reserve space with,
  // and the card jumps as the image decodes.
  it.each(projects.map((project) => [project.id, project]))(
    '%s declares real image dimensions',
    (_id, project) => {
      expect(Number.isInteger(project.width) && project.width > 0).toBe(true);
      expect(Number.isInteger(project.height) && project.height > 0).toBe(true);
    },
  );
});

describe('certificate entries', () => {
  it.each(certificates.map((cert) => [cert.title, cert]))(
    '%s carries the fields the card reads',
    (_title, cert) => {
      expect(cert.issuer).toBeTruthy();
      expect(cert.image.startsWith('/')).toBe(true);
      expect(['red', 'blue', 'green', 'orange']).toContain(cert.color);
      expect(Number.isInteger(cert.width) && cert.width > 0).toBe(true);
      expect(Number.isInteger(cert.height) && cert.height > 0).toBe(true);
    },
  );

  // The Verify link and the hasCredential entry both key off this, so a `url`
  // that is present but empty would render a link to nowhere.
  it('either omits the credential URL or gives a real one', () => {
    for (const cert of certificates) {
      if ('url' in cert) expect(cert.url).toMatch(/^https:\/\//);
    }
  });
});

// Every image path above has to resolve to a file in public/. Nothing fails
// loudly when one does not: the pages catch the load error and swap in a text
// placeholder, so a typo'd filename looks like a deliberate design.
describe('images exist on disk', () => {
  const paths = [
    ...projects.map((project) => project.image),
    ...certificates.map((cert) => cert.image),
    '/sketch-avatar.webp', // the hero portrait, and the Person schema's image
    '/social-card.jpg',
    '/favicon.ico',
    '/favicon.svg',
    '/apple-touch-icon.png',
  ];

  it.each(paths)('%s', (path) => {
    expect(existsSync(join(process.cwd(), 'public', path))).toBe(true);
  });
});

describe('skills', () => {
  it('are the list the Person schema advertises as knowsAbout', () => {
    expect(skills.length).toBeGreaterThan(0);
    for (const skill of skills) expect(skill.name).toBeTruthy();
  });
});
