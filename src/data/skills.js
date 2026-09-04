// Skill pills for the home page. Lived inside the page component until now,
// which meant nothing else — structured data, a future filter — could read them.
//
// This list is also the Person schema's `knowsAbout` (src/lib/structuredData.js),
// so every entry is a public claim rather than decoration. Ordered in runs —
// web, languages, ML, data, AI, then the rest — because the grid is a wrapping
// flex row and adjacency is the only grouping a reader gets.
//
// `color` picks one of the four marker tints in sketchbook.css, rotated through
// in order so no two neighbours share one.
export const skills = [
  { name: 'React', color: 'blue' },
  { name: 'Next.js', color: 'red' },
  { name: 'Tailwind CSS', color: 'green' },
  { name: 'Node.js', color: 'orange' },

  { name: 'JavaScript / TypeScript', color: 'blue' },
  { name: 'Python', color: 'red' },

  { name: 'Machine Learning', color: 'green' },
  { name: 'Deep Learning', color: 'orange' },
  { name: 'PyTorch', color: 'blue' },
  { name: 'TensorFlow', color: 'red' },
  { name: 'scikit-learn', color: 'green' },

  { name: 'pandas / NumPy', color: 'orange' },
  { name: 'Data Analysis', color: 'blue' },
  { name: 'Data Engineering', color: 'red' },

  { name: 'Generative AI', color: 'green' },
  { name: 'LLM APIs', color: 'orange' },
  { name: 'Prompt Engineering', color: 'blue' },
  { name: 'RAG Pipelines', color: 'red' },
  { name: 'AI Agents', color: 'green' },
  { name: 'AI Development', color: 'orange' },

  { name: 'Workflow Automation', color: 'blue' },
  { name: 'UI / UX Design', color: 'red' },
];

export default skills;
