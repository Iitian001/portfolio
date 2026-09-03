import { useCallback, useState } from 'react';
import { Star, ExternalLink, Maximize2 } from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import Lightbox from '../components/Lightbox';
import { usePageTitle } from '../hooks/usePageTitle';
import '../layouts/sketchbook.css';

// `width`/`height` are the images' real intrinsic pixel sizes. They let the
// browser reserve the right box before the bytes arrive, so the grid doesn't
// reflow as each certificate decodes.
const certificates = [
  {
    title: 'Data Analytics Foundations',
    issuer: 'DeepLearning.AI',
    image: '/certificates/cert1.png',
    width: 1024,
    height: 768,
    url: 'https://learn.deeplearning.ai/certificates/2272a4ee-5c3e-4b27-95fd-b7bd70b0bd27',
    color: 'blue',
  },
  {
    title: 'Fast Prototyping of GenAI Apps',
    issuer: 'DeepLearning.AI',
    image: '/certificates/cert2.png',
    width: 1024,
    height: 768,
    url: 'https://learn.deeplearning.ai/certificates/907381d1-8616-4b35-9eac-d588876d0d19',
    color: 'red',
  },
  {
    title: 'AI Engineer for Data Scientists',
    issuer: 'DataCamp',
    image: '/certificates/cert3.png',
    width: 1719,
    height: 988,
    color: 'green',
  },
  {
    title: 'Data Engineer',
    issuer: 'DataCamp',
    image: '/certificates/cert4.png',
    width: 1719,
    height: 988,
    color: 'green',
  },
  {
    title: 'Machine Learning',
    issuer: 'Coursera',
    image: '/certificates/cert5.png',
    width: 1650,
    height: 1275,
    color: 'blue',
  },
];

/** Cards in the first grid row are above the fold, so their images load eagerly. */
const EAGER_COUNT = 2;

const CertCard = ({ cert, index, onOpen }) => {
  const [imgError, setImgError] = useState(false);
  const hasLink = Boolean(cert.url) && cert.url !== '#';
  const eager = index < EAGER_COUNT;

  return (
    <article className="sketch-cert-card">
      <div className="sketch-cert-pin" aria-hidden="true"></div>

      <button
        type="button"
        className="sketch-cert-img-btn"
        onClick={() => onOpen(index)}
        aria-label={`View ${cert.title} certificate full size`}
      >
        {imgError ? (
          <div className="sketch-img-placeholder">{cert.title}</div>
        ) : (
          <img
            src={cert.image}
            alt={`${cert.title} certificate from ${cert.issuer}`}
            className="sketch-cert-img"
            width={cert.width}
            height={cert.height}
            // Only below-the-fold cards defer: a lazy image that never enters an
            // observed viewport is never requested at all, which left the whole
            // grid blank in some browsers.
            loading={eager ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'auto'}
            decoding="async"
            onError={() => setImgError(true)}
          />
        )}
        <span className="sketch-cert-zoom">
          <Maximize2 size={15} aria-hidden="true" /> View full size
        </span>
      </button>

      <div className="sketch-cert-info">
        <div className="sketch-cert-header">
          <Star size={22} className={`sketch-cert-star sketch-cert-star--${cert.color}`} aria-hidden="true" />
          <div>
            <h3 className="sketch-cert-title">{cert.title}</h3>
            <p className="sketch-cert-issuer">{cert.issuer}</p>
          </div>
        </div>
        {/* Certificates without a public credential URL simply omit the link
            rather than rendering one that opens a blank tab. */}
        {hasLink && (
          <a
            href={cert.url}
            target="_blank"
            rel="noreferrer"
            className="sketch-cert-verify"
            aria-label={`Verify ${cert.title} credential (opens in a new tab)`}
          >
            Verify <ExternalLink size={15} aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
};

const CertificatesPage = () => {
  usePageTitle(
    'Certifications',
    'Credentials and certifications earned by Shreyash across AI engineering, data engineering and machine learning.',
  );

  const [openIndex, setOpenIndex] = useState(null);
  const open = openIndex !== null ? certificates[openIndex] : null;

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta) => setOpenIndex((i) => (i === null ? i : (i + delta + certificates.length) % certificates.length)),
    [],
  );

  return (
    <div className="sketch-body">
      <a href="#certificates" className="sketch-skip-link">Skip to certificates</a>

      <div className="sketch-container">

        <SiteHeader />

        <section className="sketch-page-hero">
          <h1 className="sketch-page-title">Certifications</h1>
          <p className="sketch-page-subtitle">Credentials and certifications I've earned along the way</p>
        </section>

        <div className="sketch-certs-grid" id="certificates">
          {certificates.map((cert, index) => (
            <CertCard key={cert.title} cert={cert} index={index} onOpen={setOpenIndex} />
          ))}
        </div>

        <SiteFooter />
      </div>

      {open && (
        <Lightbox
          src={open.image}
          alt={`${open.title} certificate from ${open.issuer}`}
          caption={`${open.title} — ${open.issuer}`}
          onClose={close}
          onPrev={certificates.length > 1 ? () => step(-1) : undefined}
          onNext={certificates.length > 1 ? () => step(1) : undefined}
        />
      )}
    </div>
  );
};

export default CertificatesPage;
