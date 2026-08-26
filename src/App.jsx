import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SketchbookLayout from './layouts/SketchbookLayout';
import ProjectPage from './layouts/ProjectPage';
import ProjectsPage from './pages/ProjectsPage';
import CertificatesPage from './pages/CertificatesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SketchbookLayout />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/project/:id" element={<ProjectPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
