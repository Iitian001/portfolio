// The vercel.json rewrite rule, tested against the real file.
//
// This is the regression test for the favicon bug. The rewrite used to be a
// blanket `/(.*)` to /index.html, which meant a request for /favicon.ico was
// answered with an HTML document — and because the same config sends
// `Cache-Control: max-age=86400` and `X-Content-Type-Options: nosniff` for .ico,
// browsers cached that HTML under the icon URL and were then forbidden from ever
// drawing it. Nothing in the app's own code could have caught it.
//
// The regex is read out of vercel.json rather than copied here on purpose: a copy
// would keep passing after someone edited the deployed one.
import { describe, it, expect } from 'vitest';
import config from '../vercel.json';
import { sitemapRoutes } from '../src/lib/sitemap';

const spaRewrite = config.rewrites.find((rule) => rule.destination === '/index.html');

// Vercel anchors `source` at both ends and matches the path only, so the test has
// to do the same or it would accept a rule that merely matches somewhere inside.
const rewrites = (path) => new RegExp(`^${spaRewrite.source}$`).test(path);

describe('vercel.json SPA rewrite', () => {
  it('exists and targets index.html', () => {
    expect(spaRewrite).toBeDefined();
  });

  // Every route the router can render has to reach index.html, or it 404s on a
  // hard reload even though the app handles it fine on a client-side navigation.
  it.each(sitemapRoutes().map((route) => route.path))('serves the app for %s', (path) => {
    expect(rewrites(path)).toBe(true);
  });

  it.each([
    '/project/does-not-exist', // the 404 page is a route too
    '/some/deep/unknown/path',
    '/projects/', // trailing slash
  ])('serves the app for %s', (path) => {
    expect(rewrites(path)).toBe(true);
  });

  // The other half of the rule, and the half that was broken: anything with a
  // file extension must fall through to the filesystem.
  it.each([
    '/favicon.ico',
    '/favicon.svg',
    '/apple-touch-icon.png',
    '/site.webmanifest',
    '/social-card.jpg',
    '/robots.txt',
    '/sitemap.xml',
    '/assets/index-B92_42ZL.js',
    '/assets/index-RCmFcohA.css',
    '/fonts/caveat-latin.woff2',
    '/fonts/kalam-400-latin.woff2',
    '/projects/bloom-chat.webp',
    '/sketch-avatar.webp',
  ])('leaves %s to the filesystem', (path) => {
    expect(rewrites(path)).toBe(false);
  });
});

describe('vercel.json headers', () => {
  // The invariant behind the bug, stated directly: every extension that gets a
  // long cache lifetime must also be excluded from the rewrite. Caching is what
  // made a single wrong response permanent — without it the icon would have
  // recovered on the next request.
  const cached = config.headers.find((rule) => /woff2/.test(rule.source));

  it('caches a fixed list of extensions', () => {
    expect(cached).toBeDefined();
  });

  it.each(cached.source.match(/\(([a-z0-9|]+)\)$/)[1].split('|'))(
    'does not rewrite .%s, which it tells browsers to cache',
    (extension) => {
      expect(rewrites(`/some-file.${extension}`)).toBe(false);
    },
  );

  it('sends nosniff, which is why a cached HTML body under an icon URL never recovers', () => {
    const blanket = config.headers.find((rule) => rule.source === '/(.*)');
    expect(blanket.headers).toEqual(
      expect.arrayContaining([{ key: 'X-Content-Type-Options', value: 'nosniff' }]),
    );
  });
});
