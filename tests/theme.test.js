// @vitest-environment jsdom

// The theme module, which is the whole of the dark-mode logic that is not CSS.
//
// Two things here are easy to get wrong in a way no one notices for months: a
// visitor who has never touched the toggle must keep following the operating
// system live, and a visitor who has used it must never have their choice
// overwritten when the OS flips at sunset. Both are asserted below.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  storedTheme,
  systemPrefersDark,
  activeTheme,
  applyTheme,
  toggleTheme,
  watchSystemTheme,
} from '../src/lib/theme';

// jsdom ships no matchMedia at all, so it has to be supplied. `listeners` is kept
// so a test can fire a change the way the OS would.
const fakeMedia = (prefersDark) => {
  const listeners = new Set();
  const query = {
    matches: prefersDark,
    media: '(prefers-color-scheme: dark)',
    addEventListener: (_event, handler) => listeners.add(handler),
    removeEventListener: (_event, handler) => listeners.delete(handler),
  };
  window.matchMedia = vi.fn(() => query);
  return {
    query,
    listeners,
    flip(toDark) {
      query.matches = toDark;
      listeners.forEach((handler) => handler(query));
    },
  };
};

const themeColour = () =>
  document.querySelector('meta[name="theme-color"]').getAttribute('content');

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  document.head.innerHTML = '<meta name="theme-color" content="#faf8f5">';
});

afterEach(() => {
  delete window.matchMedia;
});

describe('storedTheme', () => {
  it('is null until the visitor picks one', () => {
    fakeMedia(false);
    expect(storedTheme()).toBeNull();
  });

  it('reads back a stored choice', () => {
    localStorage.setItem('theme', 'dark');
    expect(storedTheme()).toBe('dark');
  });

  // Anything could be sitting under that key — an old value, another script, a
  // visitor editing storage by hand. Only the two known values count.
  it('ignores a value that is not one of the two themes', () => {
    localStorage.setItem('theme', 'midnight');
    expect(storedTheme()).toBeNull();
  });
});

describe('activeTheme', () => {
  it('follows the system when there is no stored choice', () => {
    fakeMedia(true);
    expect(systemPrefersDark()).toBe(true);
    expect(activeTheme()).toBe('dark');
  });

  it('lets a stored choice override the system', () => {
    fakeMedia(true);
    localStorage.setItem('theme', 'light');
    expect(activeTheme()).toBe('light');
  });

  // A browser with no matchMedia at all has no preference to read, and light is
  // the palette the CSS declares unconditionally.
  it('falls back to light when the browser cannot report a preference', () => {
    expect(systemPrefersDark()).toBe(false);
    expect(activeTheme()).toBe('light');
  });
});

describe('applyTheme', () => {
  it('writes the attribute the CSS keys off, and the browser chrome colour', () => {
    fakeMedia(false);
    applyTheme('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(themeColour()).toBe('#14120f');
  });

  // Removing the attribute is what hands control back to the OS: without it the
  // root keeps `color-scheme: light` and stops following anything.
  it('removes the attribute entirely when handed null', () => {
    fakeMedia(true);
    applyTheme('light');
    applyTheme(null);
    expect('theme' in document.documentElement.dataset).toBe(false);
    // The meta tag has no "follow the system" value, so it takes whatever that
    // currently resolves to.
    expect(themeColour()).toBe('#14120f');
  });

  it('does not throw when the meta tag is missing', () => {
    fakeMedia(false);
    document.head.innerHTML = '';
    expect(() => applyTheme('dark')).not.toThrow();
  });
});

describe('toggleTheme', () => {
  it('flips away from what is on screen and remembers it', () => {
    fakeMedia(false);
    expect(toggleTheme()).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  // The first click on a system-dark machine has to produce light. Flipping from
  // a hardcoded default instead would make that click appear to do nothing.
  it('flips away from the system preference on the first click', () => {
    fakeMedia(true);
    expect(toggleTheme()).toBe('light');
  });

  it('flips back', () => {
    fakeMedia(false);
    toggleTheme();
    expect(toggleTheme()).toBe('light');
    expect(themeColour()).toBe('#faf8f5');
  });
});

describe('watchSystemTheme', () => {
  it('reports an OS change while the visitor is still following the system', () => {
    const media = fakeMedia(false);
    const onChange = vi.fn();
    watchSystemTheme(onChange);

    media.flip(true);
    expect(onChange).toHaveBeenCalledWith('dark');
  });

  // The point of the guard: someone who chose light must not be flipped to dark
  // because their machine switched at sunset.
  it('stays quiet once the visitor has made a choice', () => {
    const media = fakeMedia(false);
    localStorage.setItem('theme', 'light');
    const onChange = vi.fn();
    watchSystemTheme(onChange);

    media.flip(true);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('unsubscribes, so an unmounted toggle stops being called', () => {
    const media = fakeMedia(false);
    const onChange = vi.fn();
    watchSystemTheme(onChange)();

    media.flip(true);
    expect(onChange).not.toHaveBeenCalled();
    expect(media.listeners.size).toBe(0);
  });

  it('returns a no-op teardown when the browser has no matchMedia', () => {
    expect(() => watchSystemTheme(vi.fn())()).not.toThrow();
  });
});

// localStorage is not merely empty in some privacy modes — the getter throws. An
// unguarded read there would take down the first render.
describe('storage that throws', () => {
  const real = window.localStorage;

  const breakStorage = () => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new DOMException('denied', 'SecurityError');
      },
    });
  };

  afterEach(() => {
    Object.defineProperty(window, 'localStorage', { configurable: true, value: real });
  });

  it('reads as no stored choice', () => {
    fakeMedia(true);
    breakStorage();
    expect(storedTheme()).toBeNull();
    expect(activeTheme()).toBe('dark');
  });

  it('still applies the toggle for the current page', () => {
    fakeMedia(false);
    breakStorage();
    expect(toggleTheme()).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
