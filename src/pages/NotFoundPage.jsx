import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageShell from '../components/PageShell';
import PageHero from '../components/PageHero';
import { usePageTitle } from '../hooks/usePageTitle';

/**
 * Catch-all route. Without this, an unknown URL matches no <Route> and renders a
 * blank page — and because vercel.json rewrites everything to index.html, every
 * typo'd or stale link in production would land there.
 */
const NotFoundPage = () => {
  usePageTitle('Page Not Found', undefined, { noindex: true });

  return (
    <PageShell>
      <PageHero
        title="Page Not Found"
        subtitle={<>This page isn&rsquo;t in the sketchbook. Try the nav above &mdash; or head back home.</>}
      >
        <Link to="/" className="sketch-btn sketch-detail-back">
          <ArrowLeft size={20} /> Back Home
        </Link>
      </PageHero>
    </PageShell>
  );
};

export default NotFoundPage;
