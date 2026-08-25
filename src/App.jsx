import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SketchbookLayout from './layouts/SketchbookLayout';
import ProjectPage from './layouts/ProjectPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SketchbookLayout />} />
        <Route path="/project/:id" element={<ProjectPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
