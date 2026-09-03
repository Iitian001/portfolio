// @vitest-environment jsdom

// The reveal-on-scroll gate.
//
// Everything here is about what happens when the animation must NOT run. The base
// stylesheet leaves content visible and `js-reveal` on <html> is the only thing
// that opts a visitor into the hidden-then-animate start state — so if this gate
// ever opened in a browser without IntersectionObserver, the site would be a page
// of permanently transparent boxes with no error anywhere.
//
// motionEnabled is computed once at import, so each case has to reset the module
// registry and import it again under different globals.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const setEnvironment = ({ observer = true, reducedMotion = false, media = true }) => {
  if (observer) window.IntersectionObserver = class {};
  else delete window.IntersectionObserver;

  if (media) {
    window.matchMedia = vi.fn((query) => ({
      matches: query.includes('reduce') ? reducedMotion : false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
  } else {
    delete window.matchMedia;
  }
};

/** Fresh import under the current globals. */
const load = async () => {
  vi.resetModules();
  return import('../src/lib/motion');
};

beforeEach(() => {
  document.documentElement.className = '';
});

afterEach(() => {
  delete window.IntersectionObserver;
  delete window.matchMedia;
});

const revealed = () => document.documentElement.classList.contains('js-reveal');

describe('enableReveal', () => {
  it('opts in when the browser can observe and the visitor has not opted out', async () => {
    setEnvironment({});
    const { motionEnabled, enableReveal } = await load();
    enableReveal();
    expect(motionEnabled).toBe(true);
    expect(revealed()).toBe(true);
  });

  it('does nothing when the visitor asked for reduced motion', async () => {
    setEnvironment({ reducedMotion: true });
    const { motionEnabled, enableReveal } = await load();
    enableReveal();
    expect(motionEnabled).toBe(false);
    expect(revealed()).toBe(false);
  });

  // Without IntersectionObserver nothing would ever fire the callback that makes a
  // hidden element visible again, so the start state must never be applied.
  it('does nothing without IntersectionObserver', async () => {
    setEnvironment({ observer: false });
    const { motionEnabled, enableReveal } = await load();
    enableReveal();
    expect(motionEnabled).toBe(false);
    expect(revealed()).toBe(false);
  });

  it('does nothing when matchMedia is missing, since the preference cannot be read', async () => {
    setEnvironment({ media: false });
    const { motionEnabled, enableReveal } = await load();
    enableReveal();
    expect(motionEnabled).toBe(false);
    expect(revealed()).toBe(false);
  });
});

describe('observer options', () => {
  it('hold the reveal back until an element is inside the fold', async () => {
    setEnvironment({});
    const { revealObserverOptions } = await load();
    expect(revealObserverOptions.rootMargin).toContain('-');
    expect(revealObserverOptions.threshold).toBeGreaterThan(0);
  });
});
