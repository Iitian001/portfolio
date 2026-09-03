import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

// Nav entries. `match` decides when the entry is the current section, so the
// active state is derived from the URL instead of hardcoded per page.
const links = [
  { label: 'Home', to: '/', match: (p) => p === '/' },
  { label: 'Certificates', to: '/certificates', match: (p) => p.startsWith('/certificates') },
  { label: 'Work', to: '/projects', match: (p) => p.startsWith('/projects') || p.startsWith('/project/') },
  { label: 'Contact', to: '/#contact', match: () => false },
];

const NAV_ID = 'site-nav';

/**
 * Site header, with a collapsing nav below 900px.
 *
 * Until now the narrow layout only stacked the header and shrank the type, which
 * left four links wrapping under the logo and pushed the hero most of a screen
 * down on a phone. The panel below replaces that.
 *
 * The nav element itself is always rendered rather than mounted on open: it is
 * the only navigation landmark on the page, and a crawler or a screen reader
 * reading the document outline should not have to open a menu to find it. CSS
 * hides it at narrow widths instead.
 */
const SiteHeader = () => {
  const { pathname, hash, key } = useLocation();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const navRef = useRef(null);

  // Any navigation closes the panel. `key` is included so tapping the link for
  // the page you are already on still closes it.
  useEffect(() => setOpen(false), [pathname, hash, key]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      // Escape has to hand focus back, or it lands on <body> and the next Tab
      // restarts at the top of the document.
      buttonRef.current?.focus();
    };

    // A tap anywhere else dismisses the panel, which is what a menu that
    // overlaps content has to do to avoid trapping the visitor behind it.
    const onPointerDown = (event) => {
      if (navRef.current?.contains(event.target)) return;
      if (buttonRef.current?.contains(event.target)) return;
      setOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  return (
    <header className="sketch-header sketch-enter">
      <Link to="/" className="sketch-logo">Portfolio.</Link>

      <div className="sketch-header-actions">
        <nav
          id={NAV_ID}
          ref={navRef}
          className={open ? 'sketch-nav is-open' : 'sketch-nav'}
          aria-label="Main navigation"
        >
          {links.map(({ label, to, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={label}
                to={to}
                className={active ? 'sketch-nav-active' : undefined}
                aria-current={active ? 'page' : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <ThemeToggle />

        <button
          type="button"
          ref={buttonRef}
          className="sketch-menu-btn"
          aria-expanded={open}
          aria-controls={NAV_ID}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((wasOpen) => !wasOpen)}
        >
          {open ? <X size={26} aria-hidden="true" /> : <Menu size={26} aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
};

export default SiteHeader;
