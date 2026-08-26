import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SketchbookLayout from './layouts/SketchbookLayout';
import ProjectPage from './layouts/ProjectPage';
import ProjectsPage from './pages/ProjectsPage';
import CertificatesPage from './pages/CertificatesPage';
import NotFoundPage from './pages/NotFoundPage';
import ScrollToTop from './layouts/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<SketchbookLayout />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/project/:id" element={<ProjectPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
