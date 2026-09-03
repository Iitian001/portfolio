import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import PageHero from '../components/PageHero';
import { usePageTitle } from '../hooks/usePageTitle';
import '../layouts/sketchbook.css';

/**
 * Catch-all route. Without this, an unknown URL matches no <Route> and renders a
 * blank page — and because vercel.json rewrites everything to index.html, every
 * typo'd or stale link in production would land there.
 */
const NotFoundPage = () => {
  usePageTitle('Page Not Found', undefined, { noindex: true });

  return (
    <div className="sketch-body">
      <div className="sketch-container">
        <SiteHeader />

        <PageHero
          title="Page Not Found"
          subtitle={<>This page isn&rsquo;t in the sketchbook. Try the nav above &mdash; or head back home.</>}
        >
          <Link to="/" className="sketch-btn sketch-detail-back">
            <ArrowLeft size={20} /> Back Home
          </Link>
        </PageHero>

        <SiteFooter />
      </div>
    </div>
  );
};

export default NotFoundPage;
