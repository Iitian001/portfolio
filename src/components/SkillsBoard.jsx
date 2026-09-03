import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';
import { skills } from '../data/skills';
import { motionEnabled } from '../lib/motion';

/**
 * The skills list, and — for visitors who can actually play with it — the same
 * list handed over to a rigid-body engine.
 *
 * The markup is unchanged from the plain grid it replaced. That is the whole
 * point of the arrangement: the physics is an enhancement layered onto a list
 * that is already correct, so every path where the engine does not load ends at
 * exactly the page that existed before it.
 */

/**
 * A note that cannot be dragged is worse than no physics at all — the cursor
 * says nothing, and `physicsBoard` deliberately releases Matter's touch handlers
 * so that flicking the page scrolls it instead of throwing stationery. So the
 * engine is only loaded for a pointer that can hover and aim.
 *
 * Called on every render rather than resolved once at module load, so a test can
 * decide what kind of pointer it is pretending to be.
 */
const canDrag = () =>
  motionEnabled && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Below this the row wraps to four or five lines of one or two notes, which is
    not a board — and it is the width at which the second row's 20px gap, the
    space a thrown note actually travels through, stops existing. */
const MIN_WIDTH = 720;

/**
 * Long enough for the pills' own staggered entrance to finish before physics
 * touches them: eight notes at 45ms apart plus a 321ms pop is ~680ms, and a kick
 * arriving mid-fade looks like a glitch rather than a nudge.
 */
const START_DELAY = 700;

/** A window drag fires resize continuously; the board is torn down on the first
    event and rebuilt once the mouse has been still this long. */
const RESIZE_DEBOUNCE = 250;

/** A third of the section on screen. Lower and the board starts while it is a
    sliver at the bottom edge, so the entrance is over before it is visible. */
const OBSERVER = { threshold: 0.35 };

const SkillsBoard = () => {
  const boardRef = useRef(null);
  const handleRef = useRef(null);
  // Drives the shake control's visibility only. Deliberately not the source of
  // truth for whether physics is running — that is handleRef, which the effect
  // owns and which never goes stale between renders.
  const [live, setLive] = useState(false);
  const draggable = canDrag();

  useEffect(() => {
    const board = boardRef.current;
    if (!board || !draggable) return undefined;

    // StrictMode mounts, unmounts and remounts. Every one of these is captured
    // by the closure the cleanup below closes over, so the first pass cannot
    // leave a timer or a half-finished import behind to act on the second.
    let cancelled = false;
    let visible = false;
    let loading = false;
    let startTimer = 0;
    let resizeTimer = 0;

    const begin = async () => {
      if (cancelled || loading || handleRef.current) return;
      // Re-checked here rather than once up front, because a rebuild after a
      // resize comes through this same path and the window may now be narrow.
      if (board.clientWidth < MIN_WIDTH) return;
      loading = true;

      try {
        // Both imports are dynamic and both are the point: matter-js is 26 kB
        // gzipped, and it is not fetched at all for a visitor who never scrolls
        // to the skills section.
        const [matter, physics] = await Promise.all([
          import('matter-js'),
          import('../lib/physicsBoard'),
        ]);
        if (cancelled) return;

        // matter-js is CommonJS. Vite's interop hands it back under `default`;
        // a bare Node import of the same package may not.
        const Matter = matter.default ?? matter;
        handleRef.current = physics.startBoard({
          Matter,
          board,
          notes: Array.from(board.querySelectorAll('.sketch-pill')),
        });
        // The delay above may have outlived the section's time on screen.
        handleRef.current.setRunning(visible);
        setLive(true);
      } catch {
        // A failed chunk leaves the readable grid exactly as it is. There is
        // nothing to tell the visitor, because nothing they can see is broken.
      } finally {
        loading = false;
      }
    };

    const teardown = () => {
      if (!handleRef.current) return;
      handleRef.current.stop();
      handleRef.current = null;
      setLive(false);
    };

    // Every seat is a pixel measurement of a wrapped flex row, so a resize
    // invalidates all of them at once. `stop` restores the row it came from,
    // which makes rebuilding from scratch both the simplest correct answer and
    // the only one that re-measures — hence no resize logic inside the engine.
    const onResize = () => {
      teardown();
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(begin, RESIZE_DEBOUNCE);
    };

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        visible = entry.isIntersecting;
        if (handleRef.current) handleRef.current.setRunning(visible);
        // Started once, on the first sighting. Coming back to the section later
        // resumes the world it left rather than resetting it.
        else if (visible && !startTimer) startTimer = setTimeout(begin, START_DELAY);
      }
    }, OBSERVER);

    observer.observe(board);
    window.addEventListener('resize', onResize);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      clearTimeout(startTimer);
      clearTimeout(resizeTimer);
      teardown();
    };
  }, [draggable]);

  return (
    <>
      <div className="sketch-skills-grid" ref={boardRef}>
        {/* Each pill pops in on its own short delay, so the row assembles
            left to right instead of landing as one block. */}
        {skills.map((skill, index) => (
          <Reveal
            as="span"
            key={skill.name}
            className={`sketch-pill sketch-pill--${skill.color} sketch-reveal--pop`}
            delay={index * 45}
          >
            {skill.name}
          </Reveal>
        ))}
      </div>

      {/* Rendered as soon as the pointer qualifies, not when the engine arrives,
          so its box is reserved before anything can shift. Invisible until then —
          see .sketch-skills-shake, which also keeps it out of the tab order. */}
      {draggable && (
        <div className={`sketch-skills-shake${live ? ' is-live' : ''}`}>
          <button type="button" onClick={() => handleRef.current?.shake()}>
            Shake the board
          </button>
        </div>
      )}
    </>
  );
};

export default SkillsBoard;
