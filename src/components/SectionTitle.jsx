import Reveal from './Reveal';
import SketchUnderline from './SketchUnderline';

/**
 * Section heading whose underline draws itself when the heading scrolls into
 * view. The inner span exists so the underline can be sized to the text rather
 * than to the full-width heading.
 */
const SectionTitle = ({ children, ...rest }) => (
  <Reveal as="h2" className="sketch-section-title" {...rest}>
    <span className="sketch-title-inner">
      {children}
      <SketchUnderline />
    </span>
  </Reveal>
);

export default SectionTitle;
