import { Link, useLocation } from 'react-router-dom';

// Nav entries. `match` decides when the entry is the current section, so the
// active state is derived from the URL instead of hardcoded per page.
const links = [
  { label: 'Home', to: '/', match: (p) => p === '/' },
  { label: 'Certificates', to: '/certificates', match: (p) => p.startsWith('/certificates') },
  { label: 'Work', to: '/projects', match: (p) => p.startsWith('/projects') || p.startsWith('/project/') },
  { label: 'Contact', to: '/#contact', match: () => false },
];

const SiteHeader = () => {
  const { pathname } = useLocation();

  return (
    <header className="sketch-header">
      <Link to="/" className="sketch-logo">Portfolio.</Link>
      <nav className="sketch-nav" aria-label="Main navigation">
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
    </header>
  );
};

export default SiteHeader;
