// @vitest-environment jsdom

// usePageTitle owns four things no other module can: the tab title, the meta
// description, the canonical URL and the noindex marker. Three of them are
// invisible, which is exactly why they need a test — a canonical URL that points
// at the home page from every route asks a search engine to drop the rest of the
// site, and nothing on screen would look wrong.
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { usePageTitle } from '../src/hooks/usePageTitle';
import { site } from '../src/data/site';

const BASE = `${site.name} | Portfolio`;

// jsdom starts with an empty <head>, so the tags index.html ships have to be put
// there before the hook can be expected to find them. The values are the
// home-page defaults from that file.
const HOME = 'https://shreyashmishra.in/';

beforeEach(() => {
  document.head.innerHTML =
    `<link rel="canonical" href="${HOME}">` +
    `<meta property="og:url" content="${HOME}">` +
    `<meta name="description" content="original description">`;
  document.title = BASE;
});

afterEach(cleanup);

/** Mounts the hook alone at `path`, with no page around it. */
const mount = (path, ...args) => {
  const Probe = () => {
    usePageTitle(...args);
    return null;
  };
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Probe />
    </MemoryRouter>,
  );
};

const canonical = () => document.querySelector('link[rel="canonical"]').getAttribute('href');
const ogUrl = () => document.querySelector('meta[property="og:url"]').getAttribute('content');
const description = () =>
  document.querySelector('meta[name="description"]').getAttribute('content');
const robots = () => document.querySelector('meta[name="robots"]');

describe('document title', () => {
  it('appends the site name', () => {
    mount('/projects', 'Work');
    expect(document.title).toBe(`Work — ${BASE}`);
  });

  it('falls back to the bare site name when a page passes no title', () => {
    mount('/', null);
    expect(document.title).toBe(BASE);
  });
});

describe('canonical URL', () => {
  it('keeps the trailing slash on the root and nowhere else', () => {
    mount('/', null);
    expect(canonical()).toBe(`${site.url}/`);

    cleanup();
    mount('/projects', 'Work');
    expect(canonical()).toBe(`${site.url}/projects`);
  });

  it('points at the route being viewed, not the home page', () => {
    mount('/project/bloom-chat', 'Bloom Chat');
    expect(canonical()).toBe(`${site.url}/project/bloom-chat`);
  });

  it('moves og:url along with it, so a share card names the right page', () => {
    mount('/certificates', 'Certifications');
    expect(ogUrl()).toBe(`${site.url}/certificates`);
  });

  // Every route is served the same index.html, so a route that changed these tags
  // and did not put them back would leave its values behind for the next one.
  it('restores the served defaults on unmount', () => {
    const view = mount('/certificates', 'Certifications');
    view.unmount();
    expect(canonical()).toBe(HOME);
    expect(ogUrl()).toBe(HOME);
  });
});

describe('meta description', () => {
  it('swaps in the page description and restores the original', () => {
    const view = mount('/projects', 'Work', 'Selected projects.');
    expect(description()).toBe('Selected projects.');
    view.unmount();
    expect(description()).toBe('original description');
  });

  it('leaves the served description alone when a page passes none', () => {
    mount('/', null);
    expect(description()).toBe('original description');
  });
});

describe('noindex', () => {
  // vercel.json rewrites unknown paths to index.html, so a missing page is served
  // with a 200 and has no status code to keep itself out of the index with.
  it('adds robots noindex for a page that should not be indexed', () => {
    mount('/nope', 'Page Not Found', undefined, { noindex: true });
    expect(robots()?.getAttribute('content')).toBe('noindex, follow');
  });

  it('adds nothing for an ordinary page', () => {
    mount('/projects', 'Work');
    expect(robots()).toBeNull();
  });

  it('removes the tag on unmount, so one 404 does not deindex the next page', () => {
    const view = mount('/nope', 'Page Not Found', undefined, { noindex: true });
    view.unmount();
    expect(robots()).toBeNull();
  });
});
