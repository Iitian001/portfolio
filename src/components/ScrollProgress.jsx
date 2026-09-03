import { useEffect, useState } from 'react';

/**
 * Marker line across the top of the page tracking how far down you are.
 *
 * Driven by the visitor's own scrolling rather than by a timer, so it is left
 * in place under `prefers-reduced-motion` — there is no self-starting movement
 * to suppress. Scroll events are coalesced into one measurement per frame.
 */
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const { scrollHeight, clientHeight } = document.documentElement;
      const scrollable = scrollHeight - clientHeight;
      setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="sketch-progress" aria-hidden="true">
      <span className="sketch-progress-bar" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
};

export default ScrollProgress;
