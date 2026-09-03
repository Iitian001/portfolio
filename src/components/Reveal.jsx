import { useEffect, useRef, useState } from 'react';
import { motionEnabled, revealObserverOptions } from '../lib/motion';

/**
 * Reveals its children once they scroll into view.
 *
 * Renders the element you ask for via `as` rather than wrapping it in an extra
 * div, so a grid item can reveal itself without a spare box changing the
 * layout — e.g. <Reveal as="article" className="sketch-cert-card">.
 *
 * `delay` staggers siblings. It is applied as a CSS custom property so the
 * animation stays entirely in the stylesheet.
 */
const Reveal = ({ as: Tag = 'div', delay = 0, className, style, children, ...rest }) => {
  const ref = useRef(null);
  // When motion is off the element is born shown and no observer is created.
  const [shown, setShown] = useState(!motionEnabled);

  useEffect(() => {
    if (!motionEnabled) return undefined;

    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setShown(true);
          // One-shot: the element never hides again, so stop watching it.
          observer.unobserve(entry.target);
        }
      });
    }, revealObserverOptions);

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={['sketch-reveal', shown ? 'is-shown' : null, className].filter(Boolean).join(' ')}
      style={delay ? { ...style, '--reveal-delay': `${delay}ms` } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
