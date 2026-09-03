// Single source of truth for project data.
// Consumed by src/pages/ProjectsPage.jsx (grid), src/pages/ProjectDetailPage.jsx
// (case study) and the sitemap plugin in vite.config.js.
//
// `width`/`height` are each image's real intrinsic pixel size. They give the
// browser an aspect ratio to reserve space with, so cards don't jump as images
// decode.
//
// Every field below `linkType` is OPTIONAL and the detail page renders each one
// only when it is present, so a half-filled entry degrades to what the card
// already showed rather than to an empty heading:
//
//   stack       string[]  technologies, as pills. Falls back to `tech`.
//   role        string    what you personally did — "Solo build", "Contributor".
//   year        string    "2025" or "2024–2025". Shown next to the role.
//   problem     string    what was wrong or missing before this existed.
//   approach    string    the decision you made, and why that one.
//   outcome     string    what changed as a result. Numbers if you have them.
//   highlights  string[]  short factual bullets. Best for shipped specifics.
//
// The four prose fields are what a hiring manager actually reads, and most
// entries here are still missing them — the card description is a summary, not
// a case study. Anything not filled in is simply absent from the page.
export const projects = [
  {
    id: 'bloom-chat',
    title: 'Bloom Chat',
    tech: 'Next.js / TypeScript / Claude API',
    stack: ['Next.js', 'TypeScript', 'Claude API', 'SQLite'],
    desc: 'A self-hosted workbench for Claude — seven modes over one thread model, five models selectable alone or side by side, and an encrypted SQLite store that seals every row before it touches disk.',
    highlights: [
      'Seven modes built over a single thread model',
      'Five models, selectable alone or side by side',
      'Encrypted SQLite store that seals every row before it touches disk',
    ],
    image: '/projects/bloom-chat.webp',
    width: 1360,
    height: 860,
    link: 'https://chat.artbloom.tech',
    linkType: 'live',
  },
  {
    id: 'n8n',
    title: 'n8n Templates',
    tech: 'Automation / Workflows',
    stack: ['n8n', 'Workflow automation'],
    desc: 'A highly organized collection of ready-to-use n8n automation workflows designed to streamline complex business logic.',
    image: '/projects/n8n.webp',
    width: 418,
    height: 234,
    link: 'https://github.com/Iitian001/N8N_tamplets',
    linkType: 'github',
  },
  {
    id: 'shreyash-code',
    title: 'Shreyash Code',
    tech: 'Python / Scripts',
    stack: ['Python'],
    desc: 'A suite of powerful Python scripts utilized for data processing, automation, and backend system tasks.',
    image: '/projects/shreyash-code.webp',
    width: 1024,
    height: 611,
    link: 'https://github.com/Iitian001/Shreyash_code-',
    linkType: 'github',
  },
  {
    id: 'artbloom',
    title: 'ArtBloom',
    tech: 'AI / Image Generation Platform',
    stack: ['AI', 'Image generation'],
    desc: 'An advanced AI image generation platform empowering users to seamlessly create beyond their imagination.',
    image: '/projects/artbloom.webp',
    width: 1024,
    height: 461,
    link: 'https://www.artbloom.tech/',
    linkType: 'live',
  },
  {
    id: 'autogpt',
    title: 'AutoGPT Core Contributor',
    tech: 'Open Source / Feature Dev',
    stack: ['Open source', 'Feature development'],
    role: 'Open-source contributor',
    desc: 'Contributed the "Most Recently Ran" sorting feature in the Library for the official AutoGPT open-source platform.',
    highlights: [
      'Added "Most Recently Ran" sorting to the Library',
      'Shipped in AutoGPT Platform beta v0.6.70',
    ],
    image: '/projects/autogpt-contrib.webp',
    width: 1024,
    height: 433,
    link: 'https://github.com/Significant-Gravitas/AutoGPT/releases/tag/autogpt-platform-beta-v0.6.70',
    linkType: 'github',
  },
];

export const getProject = (id) => projects.find((p) => p.id === id);

/** Pills for the detail page: the `stack` array if present, else `tech` split up. */
export const stackOf = (project) =>
  project.stack ?? project.tech.split('/').map((part) => part.trim()).filter(Boolean);
