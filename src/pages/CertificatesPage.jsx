import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ExternalLink } from 'lucide-react';
import '../layouts/sketchbook.css';

const certificates = [
  {
    title: 'Data Analytics Foundations',
    issuer: 'DeepLearning.AI',
    image: '/certificates/cert1.png',
    url: 'https://learn.deeplearning.ai/certificates/2272a4ee-5c3e-4b27-95fd-b7bd70b0bd27',
    color: 'blue',
  },
  {
    title: 'Fast Prototyping of GenAI Apps',
    issuer: 'DeepLearning.AI',
    image: '/certificates/cert2.png',
    url: 'https://learn.deeplearning.ai/certificates/907381d1-8616-4b35-9eac-d588876d0d19',
    color: 'red',
  },
  {
    title: 'AI Engineer for Data Scientists',
    issuer: 'DataCamp',
    image: '/certificates/cert3.png',
    url: '#',
    color: 'green',
  },
  {
    title: 'Data Engineer',
    issuer: 'DataCamp',
    image: '/certificates/cert4.png',
    url: '#',
    color: 'green',
  },
  {
    title: 'Machine Learning',
    issuer: 'Coursera',
    image: '/certificates/cert5.png',
    url: '#',
    color: 'blue',
  },
];

const CertificatesPage = () => {
  return (
    <div className="sketch-body">
      <div className="sketch-container">

        <header className="sketch-header">
          <Link to="/" className="sketch-logo">Portfolio.</Link>
          <nav className="sketch-nav">
            <Link to="/">Home</Link>
            <span className="sketch-nav-active">Certificates</span>
            <Link to="/projects">Work</Link>
            <a href="mailto:shreyash.aiml.dev@gmail.com">Contact</a>
          </nav>
        </header>

        <section className="sketch-page-hero">
          <h1 className="sketch-page-title">Certifications</h1>
          <p className="sketch-page-subtitle">Credentials and certifications I've earned along the way</p>
        </section>

        <div className="sketch-certs-wrapper">
          {certificates.map((cert, i) => (
            <a key={i} href={cert.url} target="_blank" rel="noreferrer" className="sketch-cert-card">
              <div className="sketch-cert-pin"></div>
              <div className="sketch-cert-img-wrap">
                <img src={cert.image} alt={cert.title} className="sketch-cert-img" onError={(e) => { e.target.style.display='none'; }} />
              </div>
              <div className="sketch-cert-info">
                <div className="sketch-cert-header">
                  <Star size={22} className={`sketch-cert-star sketch-cert-star--${cert.color}`} />
                  <div>
                    <h3 className="sketch-cert-title">{cert.title}</h3>
                    <p className="sketch-cert-issuer">{cert.issuer}</p>
                  </div>
                </div>
                <ExternalLink size={16} className="sketch-cert-link-icon" />
              </div>
            </a>
          ))}
        </div>

        <footer className="sketch-footer">
          <div className="sketch-footer-signature">Handcrafted by Shreyash</div>
          <div className="sketch-footer-copy">&copy; 2026 All rights reserved</div>
        </footer>
      </div>
    </div>
  );
};

export default CertificatesPage;
