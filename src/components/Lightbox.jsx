import { useCallback, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Full-screen image viewer.
 *
 * Certificate thumbnails are contain-fitted into a 220px box, which makes the
 * text on them unreadable — the point of a certificate is that it can be read.
 * This shows the original at full size.
 *
 * Accessibility: traps initial focus on the close button, restores focus to
 * whatever opened it, closes on Escape or a backdrop click, and locks body
 * scroll so the page behind doesn't move. Arrow keys step through the set when
 * `onPrev`/`onNext` are supplied.
 */
const Lightbox = ({ src, alt, caption, onClose, onPrev, onNext }) => {
  const closeRef = useRef(null);
  const openerRef = useRef(null);

  // Capture the element that had focus before the dialog opened so it can be
  // restored on close — otherwise focus falls back to <body> and keyboard users
  // lose their place in the grid.
  useEffect(() => {
    openerRef.current = document.activeElement;
    closeRef.current?.focus();

    return () => {
      const opener = openerRef.current;
      if (opener instanceof HTMLElement && document.contains(opener)) opener.focus();
    };
  }, []);

  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (event.key === 'ArrowLeft' && onPrev) {
        event.preventDefault();
        onPrev();
      } else if (event.key === 'ArrowRight' && onNext) {
        event.preventDefault();
        onNext();
      }
    },
    [onClose, onPrev, onNext],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="sketch-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={caption ? `${caption} — full size` : 'Image viewer'}
      onClick={onClose}
    >
      {/* Stop clicks inside the frame from reaching the backdrop handler. */}
      <div className="sketch-lightbox-frame" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          ref={closeRef}
          className="sketch-lightbox-close"
          onClick={onClose}
          aria-label="Close viewer"
        >
          <X size={26} aria-hidden="true" />
        </button>

        {onPrev && (
          <button
            type="button"
            className="sketch-lightbox-nav sketch-lightbox-nav--prev"
            onClick={onPrev}
            aria-label="Previous certificate"
          >
            <ChevronLeft size={30} aria-hidden="true" />
          </button>
        )}

        <img src={src} alt={alt} className="sketch-lightbox-img" />

        {onNext && (
          <button
            type="button"
            className="sketch-lightbox-nav sketch-lightbox-nav--next"
            onClick={onNext}
            aria-label="Next certificate"
          >
            <ChevronRight size={30} aria-hidden="true" />
          </button>
        )}

        {caption && <p className="sketch-lightbox-caption">{caption}</p>}
      </div>
    </div>
  );
};

export default Lightbox;
