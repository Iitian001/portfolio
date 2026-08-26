import { useState } from 'react';
import { Star, ExternalLink } from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
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
    color: 'green',
  },
  {
    title: 'Data Engineer',
    issuer: 'DataCamp',
    image: '/certificates/cert4.png',
    color: 'green',
  },
  {
    title: 'Machine Learning',
    issuer: 'Coursera',
    image: '/certificates/cert5.png',
    color: 'blue',
  },
];

const CertCard = ({ cert }) => {
  const [imgError, setImgError] = useState(false);
  const hasLink = Boolean(cert.url) && cert.url !== '#';

  const body = (
    <>
      <div className="sketch-cert-pin"></div>
      <div className="sketch-cert-img-wrap">
        {imgError ? (
          <div className="sketch-img-placeholder">{cert.title}</div>
        ) : (
          <img
            src={cert.image}
            alt={`${cert.title} certificate from ${cert.issuer}`}
            className="sketch-cert-img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className="sketch-cert-info">
        <div className="sketch-cert-header">
          <Star size={22} className={`sketch-cert-star sketch-cert-star--${cert.color}`} aria-hidden="true" />
          <div>
            <h3 className="sketch-cert-title">{cert.title}</h3>
            <p className="sketch-cert-issuer">{cert.issuer}</p>
          </div>
        </div>
        {hasLink && <ExternalLink size={16} className="sketch-cert-link-icon" aria-hidden="true" />}
      </div>
    </>
  );

  // Certificates without a public credential URL render as plain cards rather than
  // dead links that would open a blank tab.
  if (!hasLink) {
    return <div className="sketch-cert-card sketch-cert-card--static">{body}</div>;
  }

  return (
    <a href={cert.url} target="_blank" rel="noreferrer" className="sketch-cert-card">
      {body}
    </a>
  );
};

const CertificatesPage = () => {
  return (
    <div className="sketch-body">
      <div className="sketch-container">

        <SiteHeader />

        <section className="sketch-page-hero">
          <h1 className="sketch-page-title">Certifications</h1>
          <p className="sketch-page-subtitle">Credentials and certifications I've earned along the way</p>
        </section>

        <div className="sketch-certs-grid">
          {certificates.map((cert) => (
            <CertCard key={cert.title} cert={cert} />
          ))}
        </div>

        <SiteFooter />
      </div>
    </div>
  );
};

export default CertificatesPage;
