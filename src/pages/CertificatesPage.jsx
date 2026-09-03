import { useCallback, useState } from 'react';
import { Star, ExternalLink, Maximize2 } from 'lucide-react';
import PageShell from '../components/PageShell';
import Lightbox from '../components/Lightbox';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import JsonLd from '../components/JsonLd';
import { certificates } from '../data/certificates';
import { usePageTitle } from '../hooks/usePageTitle';
import { graph, breadcrumbSchema } from '../lib/structuredData';

/** Cards in the first grid row are above the fold, so their images load eagerly. */
const EAGER_COUNT = 2;

const CertCard = ({ cert, index, onOpen }) => {
  const [imgError, setImgError] = useState(false);
  const hasLink = Boolean(cert.url) && cert.url !== '#';
  const eager = index < EAGER_COUNT;

  return (
    <Reveal as="article" className="sketch-cert-card" delay={(index % 3) * 70}>
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
    </Reveal>
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
    <PageShell>
      {/* The credentials themselves are asserted on the Person schema in the
          served HTML, so this page only needs to place itself in the site. */}
      <JsonLd
        data={graph(breadcrumbSchema([['Home', '/'], ['Certifications', '/certificates']]))}
      />

      <PageHero
        title="Certifications"
        subtitle="Credentials and certifications I've earned along the way"
      />

      <div className="sketch-certs-grid" id="certificates">
        {certificates.map((cert, index) => (
          <CertCard key={cert.title} cert={cert} index={index} onOpen={setOpenIndex} />
        ))}
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
    </PageShell>
  );
};

export default CertificatesPage;
