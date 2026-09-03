import { useEffect } from 'react';
import { site } from '../data/site';

const BASE = `${site.name} | Portfolio`;

/**
 * Sets document.title (and the meta description, when given) for a route.
 *
 * This is a single-page app: without it every route keeps the title baked into
 * index.html, so browser tabs, history entries and bookmarks all read the same
 * regardless of the page the visitor is on.
 *
 * Pass `null`/undefined for the home page to restore the base title.
 */
export function usePageTitle(title, description) {
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
}

export default usePageTitle;
