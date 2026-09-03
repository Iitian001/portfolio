import SketchUnderline from './SketchUnderline';

/**
 * Title block for the inner pages. Shared by /projects, /certificates, the
 * 404 page and the "project not found" branch, which all had the same markup.
 *
 * These headings are above the fold, so the entrance is a plain CSS animation
 * rather than a scroll observer — nothing here waits on JavaScript.
 */
const PageHero = ({ title, subtitle, children }) => (
  <section className="sketch-page-hero">
    <h1 className="sketch-page-title sketch-enter">
      <span className="sketch-title-inner">
        {title}
        <SketchUnderline />
      </span>
    </h1>

    {subtitle && <p className="sketch-page-subtitle sketch-enter sketch-enter--2">{subtitle}</p>}

    {children && <div className="sketch-page-hero-actions sketch-enter sketch-enter--3">{children}</div>}
  </section>
);

export default PageHero;
