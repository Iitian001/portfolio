import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import ScrollProgress from './ScrollProgress';

/**
 * The frame every page sits in: grid paper, progress line, header, footer.
 *
 * All five pages built this by hand before, which meant five chances to forget a
 * piece — and they had: the project detail page and the 404 shipped with no skip
 * link, so keyboard visitors had to tab through the whole nav to reach content.
 *
 * The <main> landmark is new and applies everywhere. The skip link targets it
 * rather than a per-page anchor, so it lands at the top of the content instead
 * of past it: the home page used to skip the entire hero, which is content.
 * `tabIndex={-1}` is what actually moves focus — without it a browser scrolls to
 * the target but leaves focus in the nav, and the next Tab goes back into it.
 */
const PageShell = ({ children }) => (
  <div className="sketch-body">
    <a href="#main" className="sketch-skip-link">Skip to content</a>
    <ScrollProgress />

    <div className="sketch-container">
      <SiteHeader />

      <main id="main" tabIndex={-1}>
        {children}
      </main>

      <SiteFooter />
    </div>
  </div>
);

export default PageShell;
