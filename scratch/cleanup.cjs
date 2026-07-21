const fs = require('fs');
const path = require('path');

const desktop = "C:\\Users\\iitia\\OneDrive\\Desktop\\Portfolio";

const brutalistApp = `
import React, { useState, useEffect } from 'react';
import MobileLayout from './MobileLayout';

function App() {
  return <MobileLayout />;
}
export default App;
`;

const sketchbookApp = `
import React from 'react';
import SketchbookLayout from './layouts/SketchbookLayout';

function App() {
  return <SketchbookLayout />;
}
export default App;
`;

const animeApp = `
import React from 'react';
import AnimeLayout from './layouts/AnimeLayout';

function App() {
  return <AnimeLayout />;
}
export default App;
`;

// 1. Rewrite App.jsx
try {
  fs.writeFileSync(path.join(desktop, 'Brutalist-Design', 'src', 'App.jsx'), brutalistApp.trim());
  fs.writeFileSync(path.join(desktop, 'Sketchbook-Design', 'src', 'App.jsx'), sketchbookApp.trim());
  fs.writeFileSync(path.join(desktop, 'Anime-Cyberpunk-Design', 'src', 'App.jsx'), animeApp.trim());
} catch (e) {
  console.log("Error writing App.jsx:", e);
}

// 2. Delete unused layouts in Brutalist
try {
  fs.rmSync(path.join(desktop, 'Brutalist-Design', 'src', 'layouts'), { recursive: true, force: true });
} catch (e) {}

// 3. Delete unused layouts in Sketchbook
try {
  fs.unlinkSync(path.join(desktop, 'Sketchbook-Design', 'src', 'MobileLayout.jsx'));
  fs.unlinkSync(path.join(desktop, 'Sketchbook-Design', 'src', 'mobile.css'));
  fs.unlinkSync(path.join(desktop, 'Sketchbook-Design', 'src', 'layouts', 'AnimeLayout.jsx'));
  fs.unlinkSync(path.join(desktop, 'Sketchbook-Design', 'src', 'layouts', 'anime.css'));
} catch (e) {}

// 4. Delete unused layouts in Anime
try {
  fs.unlinkSync(path.join(desktop, 'Anime-Cyberpunk-Design', 'src', 'MobileLayout.jsx'));
  fs.unlinkSync(path.join(desktop, 'Anime-Cyberpunk-Design', 'src', 'mobile.css'));
  fs.unlinkSync(path.join(desktop, 'Anime-Cyberpunk-Design', 'src', 'layouts', 'SketchbookLayout.jsx'));
  fs.unlinkSync(path.join(desktop, 'Anime-Cyberpunk-Design', 'src', 'layouts', 'sketchbook.css'));
} catch (e) {}

console.log("Cleanup complete!");
