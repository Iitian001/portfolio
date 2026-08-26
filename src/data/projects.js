// Single source of truth for project data.
// Consumed by src/pages/ProjectsPage.jsx (grid) and src/layouts/ProjectPage.jsx (detail).
export const projects = [
  {
    id: 'palak',
    title: 'Palak AI Stock Expert',
    tech: 'AI / Data / Finance',
    desc: 'An advanced financial analytics dashboard that uses AI to provide actionable stock market insights and predictions.',
    image: '/palak.jpg',
    link: 'https://github.com/Iitian001/Palak_Ai_stock-expert',
    linkType: 'github',
  },
  {
    id: 'n8n',
    title: 'n8n Templates',
    tech: 'Automation / Workflows',
    desc: 'A highly organized collection of ready-to-use n8n automation workflows designed to streamline complex business logic.',
    image: '/projects/n8n.webp',
    link: 'https://github.com/Iitian001/N8N_tamplets',
    linkType: 'github',
  },
  {
    id: 'portfolio',
    title: '3D Portfolio',
    tech: 'React / Three.js / WebGL',
    desc: 'An immersive 3D interactive web portfolio built to showcase creative development and complex rendering techniques.',
    image: '/portfolio.png',
    link: 'https://shreyashmishra.in',
    linkType: 'live',
  },
  {
    id: 'shreyash-code',
    title: 'Shreyash Code',
    tech: 'Python / Scripts',
    desc: 'A suite of powerful Python scripts utilized for data processing, automation, and backend system tasks.',
    image: '/projects/shreyash-code.png',
    link: 'https://github.com/Iitian001/Shreyash_code-',
    linkType: 'github',
  },
  {
    id: 'artbloom',
    title: 'ArtBloom',
    tech: 'AI / Image Generation Platform',
    desc: 'An advanced AI image generation platform empowering users to seamlessly create beyond their imagination.',
    image: '/projects/artbloom.png',
    link: 'https://www.artbloom.tech/',
    linkType: 'live',
  },
  {
    id: 'autogpt',
    title: 'AutoGPT Core Contributor',
    tech: 'Open Source / Feature Dev',
    desc: 'Contributed the "Most Recently Ran" sorting feature in the Library for the official AutoGPT open-source platform.',
    image: '/projects/autogpt-contrib.png',
    link: 'https://github.com/Significant-Gravitas/AutoGPT/releases/tag/autogpt-platform-beta-v0.6.70',
    linkType: 'github',
  },
];

export const getProject = (id) => projects.find((p) => p.id === id);
