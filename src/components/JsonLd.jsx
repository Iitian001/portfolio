import { useEffect } from 'react';

/** Marks the tags this component owns, so it never touches the one that
    vite.config.js injects into index.html at build time. */
const OWNED = 'data-route-schema';

/**
 * Puts a JSON-LD document in <head> for as long as the route is mounted.
 *
 * Renders nothing itself.
 */
const JsonLd = ({ data }) => {
  // Serialised outside the effect, and the effect reads this rather than `data`.
  // Callers build their schema inline on every render, so a new object arrives
  // each time and a dependency on `data` itself would tear the tag down and
  // rebuild it forever. The string is the thing that actually changes.
  const json = data ? JSON.stringify(data) : null;

  useEffect(() => {
    if (!json) return undefined;

    const tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.setAttribute(OWNED, '');
    // textContent, not markup: a `</script>` sequence inside the data cannot
    // terminate the element early the way it could if this were serialised into
    // HTML. vite.config.js has no DOM to build against and escapes instead.
    tag.textContent = json;
    document.head.appendChild(tag);

    return () => tag.remove();
  }, [json]);

  return null;
};

export default JsonLd;
