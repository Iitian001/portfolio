import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { buildSitemap } from './src/lib/sitemap.js'
import { graph, personSchema, websiteSchema } from './src/lib/structuredData.js'

// Who the site is about, in the HTML the server sends.
//
// <JsonLd> already renders the route-specific schemas from React, and these two
// could go there too — but they are the schemas that say all of this describes
// one identified person, and a crawler that does not execute JavaScript would
// never see them. They are also identical on every route, which makes
// index.html, the one file every route is served from, the right home for them.
//
// No `apply` field on purpose: this runs in dev as well, so the injected markup
// can be read in the browser without a production build first.
const structuredData = () => ({
  name: 'inject-structured-data',
  transformIndexHtml() {
    return [
      {
        tag: 'script',
        attrs: { type: 'application/ld+json' },
        // The HTML parser ends a script element at the first `</script`, not at
        // the first valid JSON boundary, so a raw `<` in the data could let a
        // string break out of the block. The escape below is the same character
        // to a JSON parser and inert to the HTML one. Nothing in the data needs
        // it today; it is here so that adding a description containing a tag
        // later cannot quietly produce broken markup.
        children: JSON.stringify(graph(personSchema(), websiteSchema())).replace(/</g, '\\u003c'),
        injectTo: 'head',
      },
    ]
  },
})

// The XML is built in src/lib/sitemap.js, where a test can reach it without
// running a production build. All this plugin does is put the result in dist/.
const sitemap = () => ({
  name: 'emit-sitemap',
  apply: 'build',
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemap() })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), structuredData(), sitemap()],

  // Vitest reads this file, which is the point of configuring it here rather than
  // in a vitest.config.js: the tests run through the same plugin pipeline as the
  // app, so the JSX transform is the one the build uses. Neither plugin above
  // does anything under test — sitemap() is build-only and transformIndexHtml has
  // no HTML to touch.
  test: {
    // Worker startup dominated the run before these two lines: seven forked
    // processes, each booting a fresh jsdom, took 43s for 150 trivial assertions
    // and intermittently timed out waiting for a worker to come up at all.
    //
    // Threads start far faster than forks and nothing here needs process
    // isolation, and node is the right default because only the four files that
    // touch the DOM need a document — those carry a
    // `// @vitest-environment jsdom` docblock of their own.
    pool: 'threads',
    environment: 'node',
    // Explicit rather than inherited from `globals: true`. An import of `expect`
    // at the top of a file is one less thing to know about the runner.
    globals: false,
    include: ['tests/**/*.test.{js,jsx}'],
  },
})
