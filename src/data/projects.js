// Single source of truth for project data.
// Consumed by src/pages/ProjectsPage.jsx (grid) and src/layouts/ProjectPage.jsx (detail).
//
// `width`/`height` are each image's real intrinsic pixel size. They give the
// browser an aspect ratio to reserve space with, so cards don't jump as images
// decode.
export const projects = [
  {
    id: 'bloom-chat',
    title: 'Bloom Chat',
    tech: 'Next.js / TypeScript / Claude API',
    desc: 'A self-hosted workbench for Claude — seven modes over one thread model, five models selectable alone or side by side, and an encrypted SQLite store that seals every row before it touches disk.',
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
    desc: 'Contributed the "Most Recently Ran" sorting feature in the Library for the official AutoGPT open-source platform.',
    image: '/projects/autogpt-contrib.webp',
    width: 1024,
    height: 433,
    link: 'https://github.com/Significant-Gravitas/AutoGPT/releases/tag/autogpt-platform-beta-v0.6.70',
    linkType: 'github',
  },
];

export const getProject = (id) => projects.find((p) => p.id === id);
