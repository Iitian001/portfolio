import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { projects } from './src/data/projects.js'
import { site } from './src/data/site.js'

// Static routes, plus one detail page per project. Generated at build time from
// the same module the router reads, so adding a project cannot leave the sitemap
// stale — which is the usual fate of a hand-written one.
const sitemap = () => ({
  name: 'emit-sitemap',
  apply: 'build',
  generateBundle() {
    const routes = [
      { path: '/', priority: '1.0' },
      { path: '/projects', priority: '0.8' },
      { path: '/certificates', priority: '0.6' },
      ...projects.map((p) => ({ path: `/project/${p.id}`, priority: '0.5' })),
    ]

    const today = new Date().toISOString().slice(0, 10)
    const urls = routes
      .map(
        ({ path, priority }) =>
          `  <url>\n` +
          `    <loc>${site.url}${path}</loc>\n` +
          `    <lastmod>${today}</lastmod>\n` +
          `    <priority>${priority}</priority>\n` +
          `  </url>`,
      )
      .join('\n')

    this.emitFile({
      type: 'asset',
      fileName: 'sitemap.xml',
      source:
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        `${urls}\n` +
        `</urlset>\n`,
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), sitemap()],
})
