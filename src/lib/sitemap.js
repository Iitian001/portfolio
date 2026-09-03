// The sitemap, as a pure function.
//
// This lives here rather than inside the Vite plugin that emits it so that a test
// can call it. A generator that runs only during `vite build` can be checked by
// reading dist/, which means the check silently passes whenever the build has not
// been run — exactly the condition under which a stale sitemap ships.
import { projects } from '../data/projects';
import { site } from '../data/site';

/**
 * Every URL the site wants indexed, with a crawl priority.
 *
 * Detail pages are derived from the project list rather than written out, so
 * adding a project cannot leave the sitemap behind. Routes deliberately absent:
 * the 404 catch-all (it carries `noindex`) and any unknown /project/:id.
 */
export const sitemapRoutes = () => [
  { path: '/', priority: '1.0' },
  { path: '/projects', priority: '0.8' },
  { path: '/certificates', priority: '0.6' },
  ...projects.map((project) => ({ path: `/project/${project.id}`, priority: '0.5' })),
];

/**
 * @param {string} [today] ISO date for <lastmod>. Injectable so a test does not
 *   have to assert against the clock.
 */
export const buildSitemap = (today = new Date().toISOString().slice(0, 10)) => {
  const urls = sitemapRoutes()
    .map(
      ({ path, priority }) =>
        `  <url>\n` +
        `    <loc>${site.url}${path}</loc>\n` +
        `    <lastmod>${today}</lastmod>\n` +
        `    <priority>${priority}</priority>\n` +
        `  </url>`,
    )
    .join('\n')

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${urls}\n` +
    `</urlset>\n`
  );
};
