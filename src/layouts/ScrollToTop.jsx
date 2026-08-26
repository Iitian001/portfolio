import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** ~20 frames (≈330ms at 60fps) of grace for a hash target that is still mounting. */
const MAX_FRAMES = 20;

/** How long to let a smooth scroll finish before correcting where it landed. */
const SMOOTH_TIMEOUT_MS = 700;

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Manages scroll position across navigations. Mounted once inside <BrowserRouter>
 * in App.jsx so it applies to every route.
 *
 * Plain route change: jump to the top. `behavior: 'instant'` is required because
 * sketchbook.css sets `html { scroll-behavior: smooth }` — without it, each route
 * change animates a long glide instead of jumping.
 *
 * Hash route change (e.g. /#contact from another page): scroll to the target. The
 * scroll is deferred two frames because the browser applies its own scroll position
 * for the new history entry after React commits, which cancels anything scrolled
 * from inside this effect. Retrying across frames also covers a target that has not
 * finished mounting yet.
 *
 * `key` is in the deps so clicking the same hash link twice re-runs the scroll.
 */
function ScrollToTop() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    if (!hash) {
      toTop();
      return undefined;
    }

    let frames = 0;
    let raf = 0;
    let timer = 0;
    let cancelSettle = null;

    const findTarget = () => {
      try {
        return document.querySelector(hash);
      } catch {
        return null; // not a valid selector, e.g. "#2fa"
      }
    };

    const run = () => {
      const target = findTarget();

      if (!target) {
        if (frames++ < MAX_FRAMES) {
          raf = requestAnimationFrame(run);
          return;
        }
        toTop(); // hash points at nothing — don't strand the user mid-page
        return;
      }

      const jump = () => target.scrollIntoView({ behavior: 'instant', block: 'start' });

      if (prefersReducedMotion()) {
        jump();
        return;
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // A smooth scroll is not reliable on its own: it can be dropped outright (layout
      // shifting underneath it, or a compositor that isn't ticking), or overshoot when
      // images above the target resize mid-animation. Re-issue it instantly once the
      // animation should be done — a no-op if it already landed, a correction if not.
      // Bail out if the visitor takes over scrolling in the meantime.
      const events = ['wheel', 'touchstart', 'keydown'];
      cancelSettle = () => {
        clearTimeout(timer);
        events.forEach((e) => window.removeEventListener(e, cancelSettle));
        cancelSettle = null;
      };
      events.forEach((e) => window.addEventListener(e, cancelSettle, { passive: true, once: true }));

      timer = setTimeout(() => {
        jump();
        cancelSettle?.();
      }, SMOOTH_TIMEOUT_MS);
    };

    raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(run);
    });

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      cancelSettle?.();
    };
  }, [pathname, hash, key]);

  return null;
}

export default ScrollToTop;
