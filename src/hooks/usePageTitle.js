import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { site } from '../data/site';

const BASE = `${site.name} | Portfolio`;

/**
 * Sets document.title (and the meta description, when given) for a route, and
 * points the canonical URL at the route actually being viewed.
 *
 * This is a single-page app: without it every route keeps the title baked into
 * index.html, so browser tabs, history entries and bookmarks all read the same
 * regardless of the page the visitor is on — and every page would tell crawlers
 * that the home page is its canonical URL, which asks them to drop it from the
 * index.
 *
 * Pass `null`/undefined for the home page to restore the base title.
 *
 * `noindex` marks a route that should stay out of search results. Everything is
 * served with a 200 here — vercel.json rewrites unknown paths to index.html —
 * so a missing page has no status code to signal with and needs the meta tag.
 */
export function usePageTitle(title, description, { noindex = false } = {}) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : BASE;
  }, [title]);

  useEffect(() => {
    if (!description) return;

    const tag = document.querySelector('meta[name="description"]');
    if (!tag) return;

    const previous = tag.getAttribute('content');
    tag.setAttribute('content', description);
    return () => tag.setAttribute('content', previous ?? '');
  }, [description]);

  useEffect(() => {
    // Trailing slash only on the root, so /projects and /projects/ never both
    // get advertised as canonical.
    const canonical = pathname === '/' ? `${site.url}/` : `${site.url}${pathname}`;

    const targets = [
      document.querySelector('link[rel="canonical"]'),
      document.querySelector('meta[property="og:url"]'),
    ];
    const attribute = ['href', 'content'];

    const previous = targets.map((tag, i) => tag?.getAttribute(attribute[i]));
    targets.forEach((tag, i) => tag?.setAttribute(attribute[i], canonical));

    return () => {
      targets.forEach((tag, i) => {
        if (tag && previous[i] != null) tag.setAttribute(attribute[i], previous[i]);
      });
    };
  }, [pathname]);

  useEffect(() => {
    if (!noindex) return;

    const tag = document.createElement('meta');
    tag.name = 'robots';
    tag.content = 'noindex, follow';
    document.head.appendChild(tag);
    return () => tag.remove();
  }, [noindex]);
}

export default usePageTitle;
