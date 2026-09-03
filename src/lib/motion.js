// Reveal-on-scroll is strictly progressive enhancement.
//
// The base stylesheet leaves every .sketch-reveal element fully visible. The
// `js-reveal` class on <html> is the *only* thing that opts a visitor into the
// hidden-then-animate start state, and it is added from JavaScript after the
// checks below. So a crawler, a browser without IntersectionObserver, or anyone
// who has asked for reduced motion sees finished content instead of a page of
// permanently transparent boxes.
export const motionEnabled =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  'IntersectionObserver' in window &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Called once at startup, before the first render. */
export const enableReveal = () => {
  if (motionEnabled) {
    document.documentElement.classList.add('js-reveal');
  }
};

/**
 * Shared observer options. The negative bottom margin holds the reveal back
 * until an element is a little way into the viewport, so cards don't animate
 * while still clipped by the fold.
 */
export const revealObserverOptions = {
  rootMargin: '0px 0px -8% 0px',
  threshold: 0.06,
};
