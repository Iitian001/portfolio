// Theme state. The CSS does the actual work: every colour token in
// sketchbook.css is declared with light-dark(), so switching theme comes down to
// changing the `color-scheme` that those tokens resolve against. `data-theme` on
// <html> is the only handle this module needs to touch.
//
// With no `data-theme` at all the root keeps `color-scheme: light dark` and
// follows the operating system — which is what a visitor who has never touched
// the toggle gets, with or without JavaScript.

const STORAGE_KEY = 'theme';

/** Matches the --paper token for each theme, for the browser UI chrome. */
const THEME_COLOUR = { light: '#faf8f5', dark: '#14120f' };

/** localStorage throws outright in some privacy modes, so every access is guarded. */
const safeStorage = {
  get() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  },
  set(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* A visitor who cannot persist the choice still gets it for this page. */
    }
  },
};

/** The stored override, or null when the visitor is still following the system. */
export const storedTheme = () => {
  const value = safeStorage.get();
  return value === 'light' || value === 'dark' ? value : null;
};

export const systemPrefersDark = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

/** What the visitor is actually looking at right now. */
export const activeTheme = () => storedTheme() ?? (systemPrefersDark() ? 'dark' : 'light');

/**
 * Writes the choice to <html> and to the theme-color meta tag.
 *
 * Passing null clears the override and hands control back to the system. The
 * meta tag has no "follow the system" value, so it is set to whichever theme
 * that resolves to at the time.
 */
export const applyTheme = (theme) => {
  const root = document.documentElement;

  if (theme) {
    root.dataset.theme = theme;
  } else {
    delete root.dataset.theme;
  }

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', THEME_COLOUR[theme ?? activeTheme()]);
};

/**
 * Flips between light and dark and remembers it.
 *
 * Deliberately two-state rather than a light/dark/system cycle: the first click
 * is itself the decision to stop following the system, and a third "system"
 * stop is a state most people never look for. Clearing the site's storage
 * restores it.
 */
export const toggleTheme = () => {
  const next = activeTheme() === 'dark' ? 'light' : 'dark';
  safeStorage.set(next);
  applyTheme(next);
  return next;
};

/**
 * Calls back when the OS preference changes, but only while the visitor has no
 * explicit override — otherwise their choice would be overwritten by the system
 * flipping at sunset.
 */
export const watchSystemTheme = (onChange) => {
  if (typeof window.matchMedia !== 'function') return () => {};

  const query = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = () => {
    if (!storedTheme()) onChange(systemPrefersDark() ? 'dark' : 'light');
  };

  query.addEventListener('change', handler);
  return () => query.removeEventListener('change', handler);
};
