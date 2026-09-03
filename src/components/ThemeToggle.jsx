import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { activeTheme, toggleTheme, watchSystemTheme } from '../lib/theme';

/**
 * Light/dark switch.
 *
 * The theme itself is already correct before this mounts — an inline script in
 * index.html applies the stored choice before the first paint, and the CSS
 * follows the OS on its own when there is none. This component only exists to
 * let someone override that, and to keep its own icon in sync.
 */
const ThemeToggle = () => {
  const [theme, setTheme] = useState(activeTheme);

  // While no explicit choice is stored, the OS flipping at sunset should move
  // the site with it — including the icon here, which would otherwise go stale.
  useEffect(() => watchSystemTheme(setTheme), []);

  const dark = theme === 'dark';

  return (
    <button
      type="button"
      className="sketch-theme-btn"
      onClick={() => setTheme(toggleTheme())}
      // The control is a switch between two states, so the label has to say
      // which one it moves to; "Theme" alone tells a screen reader nothing.
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
    >
      {dark ? <Sun size={22} aria-hidden="true" /> : <Moon size={22} aria-hidden="true" />}
    </button>
  );
};

export default ThemeToggle;
