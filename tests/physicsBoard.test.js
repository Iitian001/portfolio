// @vitest-environment jsdom
//
// The physics board, driven by the real engine.
//
// This is the payoff of `startBoard` taking Matter as an argument instead of
// importing it: the test injects the genuine library and stubs only `Runner`, so
// every number below comes out of the same solver that runs in the browser —
// while the clock belongs to the test. That matters twice over, because the
// preview harness reports `document.hidden`, so requestAnimationFrame never
// fires there and a rAF-driven runner can never be watched at all.
//
// What is actually being defended: the notes are the page's skills list. A
// regression that leaves them 40px from home, or 30 degrees over, does not look
// like a bug in an animation — it looks like the site cannot lay out text.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import Matter from 'matter-js';
import { startBoard } from '../src/lib/physicsBoard';

/** The real grid, measured in the browser at a 1440px viewport: 1036 x 138, two
    rows 79px apart, nine notes totalling 1589px of width. */
const SEATS = [
  { x: 0, y: 0, w: 102, h: 59 },
  { x: 120, y: 0, w: 265, h: 59 },
  { x: 404, y: 0, w: 113, h: 59 },
  { x: 536, y: 0, w: 210, h: 59 },
  { x: 766, y: 0, w: 194, h: 59 },
  { x: 98, y: 79, w: 241, h: 59 },
  { x: 358, y: 79, w: 183, h: 59 },
  { x: 560, y: 79, w: 113, h: 59 },
  { x: 692, y: 79, w: 168, h: 59 },
];

const BOARD_HEIGHT = 138;
const STEP = 1000 / 60;
const DEG = 180 / Math.PI;

/**
 * jsdom lays nothing out, so every offset it reports is 0. Each note is given
 * the geometry it has on the real page.
 *
 * `reads` records the board's two classes at the moment each measurement is
 * taken, which is how the ordering requirement in `startBoard` gets tested — and
 * it is a real requirement in both directions. `is-physical` has to be on
 * already, because offsetLeft is reported against the nearest positioned
 * ancestor and the notes are about to be placed in this box's coordinates.
 * `is-lifted` has to still be off, because it is what makes the notes absolute,
 * and an absolute child is not a flex item: lift them first and the row empties,
 * collapses to zero height, and all nine offsets describe a box that is gone.
 */
const makeBoard = (reads = []) => {
  const board = document.createElement('div');
  board.className = 'sketch-skills-grid';
  const note = (prop) =>
    reads.push({
      prop,
      physical: board.classList.contains('is-physical'),
      lifted: board.classList.contains('is-lifted'),
    });

  Object.defineProperty(board, 'clientHeight', {
    get: () => {
      note('clientHeight');
      // Once the height is frozen it is the inline value that is reported, the
      // same as in a browser; the flex row's own height is only readable before.
      if (board.style.height) return parseFloat(board.style.height);
      // The row is a row of in-flow notes. Lift them out and it has nothing left
      // to be as tall as — which is the collapse this ordering exists to avoid.
      return board.classList.contains('is-lifted') ? 0 : BOARD_HEIGHT;
    },
  });
  Object.defineProperty(board, 'clientWidth', { get: () => 1036 });

  const notes = SEATS.map((seat) => {
    const el = document.createElement('span');
    el.className = 'sketch-pill';
    for (const [prop, value] of [
      ['offsetLeft', seat.x],
      ['offsetTop', seat.y],
      ['offsetWidth', seat.w],
      ['offsetHeight', seat.h],
    ]) {
      Object.defineProperty(el, prop, {
        get: () => {
          note(prop);
          return value;
        },
      });
    }
    board.append(el);
    return el;
  });

  document.body.append(board);
  return { board, notes };
};

/** Matter, with the clock taken out. `Runner.run` hands back the engine so the
    test can step it, and every start/stop is counted. */
const stubRunner = () => {
  const calls = { created: 0, run: 0, stopped: 0 };
  let engine = null;
  const injected = {
    ...Matter,
    Runner: {
      create: () => {
        calls.created += 1;
        return { stubbed: true };
      },
      run: (_runner, e) => {
        calls.run += 1;
        engine = e;
      },
      stop: () => {
        calls.stopped += 1;
      },
    },
  };
  return { injected, calls, getEngine: () => engine };
};

/** Deterministic, because the entry kick and every shake read Math.random and a
    flaky peak-displacement assertion is worse than none. */
const seeded = (seed = 7) => {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
};

const offsets = (notes) =>
  notes.map((el) => {
    const [x, y] = (el.style.translate || '0px 0px').split(' ').map(parseFloat);
    return Math.hypot(x, y);
  });

const angles = (notes) =>
  notes.map((el) => Math.abs(parseFloat(el.style.rotate || '0')) * DEG);

let random;

beforeEach(() => {
  random = vi.spyOn(Math, 'random').mockImplementation(seeded());
});

afterEach(() => {
  random.mockRestore();
  document.body.innerHTML = '';
});

/** @param {{ steps?: number }} [opts] */
const start = ({ steps = 0 } = {}) => {
  const reads = [];
  const { board, notes } = makeBoard(reads);
  const { injected, calls, getEngine } = stubRunner();
  const handle = startBoard({ Matter: injected, board, notes });
  const step = (n) => {
    for (let i = 0; i < n; i += 1) Matter.Engine.update(getEngine(), STEP);
  };
  step(steps);
  return { board, notes, handle, calls, reads, engine: getEngine(), step };
};

describe('taking the grid over', () => {
  it('returns the three controls the caller needs', () => {
    const { handle } = start();
    expect(typeof handle.stop).toBe('function');
    expect(typeof handle.shake).toBe('function');
    expect(typeof handle.setRunning).toBe('function');
  });

  it('is already the positioning context when it measures', () => {
    const { reads } = start();
    // Four offsets per note, plus the row's own height.
    expect(reads.length).toBe(SEATS.length * 4 + 1);
    // Every single read, not just most of them: one measured against the wrong
    // ancestor puts one note somewhere else on the page.
    expect(reads.every((r) => r.physical)).toBe(true);
  });

  it('measures the row before it empties it', () => {
    const { reads, board } = start();
    // The other half of the ordering, and the one that actually shipped broken:
    // `is-lifted` is what makes a note absolute, and an absolute child is not a
    // flex item. Lift the notes before reading and the row has nothing left to be
    // as tall as, so the height comes back 0 and every offset is measured against
    // a box that no longer exists.
    expect(reads.every((r) => r.lifted === false)).toBe(true);
    // And it does get lifted, or the notes would still be in the flow fighting
    // the coordinates just written onto them.
    expect(board.classList.contains('is-lifted')).toBe(true);
  });

  it('freezes the height it had, so the page below cannot jump', () => {
    const { board } = start();
    // The notes are absolute now, so this flex row has no in-flow children left
    // and would otherwise collapse to nothing.
    expect(board.style.height).toBe(`${BOARD_HEIGHT}px`);
  });

  it('pins each note to the pixels it already occupied', () => {
    const { notes } = start();
    notes.forEach((el, i) => {
      expect(el.style.left).toBe(`${SEATS[i].x}px`);
      expect(el.style.top).toBe(`${SEATS[i].y}px`);
      expect(el.style.width).toBe(`${SEATS[i].w}px`);
      // Nothing else inline: taking the notes out of the flow is the same
      // instruction for all nine, so it is a rule on `.is-physical` instead.
      expect(el.style.position).toBe('');
      expect(el.style.margin).toBe('');
    });
  });

  it('takes the notes out of the flow through the class, not nine inline writes', () => {
    // Not a URL relative to import.meta.url: this file runs in jsdom, where that
    // is an http:// document URL rather than a file path.
    const sheet = readFileSync(join(process.cwd(), 'src', 'styles', 'sketchbook.css'), 'utf8');
    const ruleFor = (selector) => {
      const at = sheet.indexOf(`${selector} {`);
      expect(at).toBeGreaterThan(-1);
      const rule = sheet.slice(at);
      return rule.slice(0, rule.indexOf('}'));
    };

    // On `is-lifted`, which is added after the measurement — and specifically not
    // on `is-physical`, which is added before it. jsdom applies no stylesheets, so
    // no amount of DOM assertion can catch these two being merged; only reading
    // the file can.
    const lifted = ruleFor('.sketch-skills-grid.is-lifted .sketch-pill');
    expect(lifted).toMatch(/position:\s*absolute/);
    expect(lifted).toMatch(/margin:\s*0/);
    // And the note must not re-wrap. `offsetWidth` is an integer, so a note laid
    // out at 210.4px is pinned to 210 — measured, that was enough to push two of
    // the nine onto a second line and grow them from 59px to 92px while their
    // bodies stayed 59px. jsdom cannot wrap text, so the file is the only witness.
    expect(lifted).toMatch(/white-space:\s*nowrap/);

    const physical = ruleFor('.sketch-skills-grid.is-physical .sketch-pill');
    expect(physical).not.toMatch(/position:\s*absolute/);
    expect(physical).not.toMatch(/margin:/);

    // The board has to be the positioning context those coordinates belong to.
    expect(ruleFor('.sketch-skills-grid.is-physical')).toMatch(/position:\s*relative/);
  });

  it('uses two constraints per note, not one', () => {
    const { engine } = start();
    const bodies = Matter.Composite.allBodies(engine.world);
    const pins = Matter.Composite.allConstraints(engine.world).filter((c) => c.bodyB);
    expect(bodies.length).toBe(SEATS.length);
    // A single point constraint does not resist rotation: measured, one centre
    // pin left the notes resting 29deg over and threw them past 129deg.
    expect(pins.length).toBe(SEATS.length * 2);
    for (const body of bodies) {
      expect(pins.filter((c) => c.bodyB === body).length).toBe(2);
    }
  });

  it('starts the clock once and paints through the engine, not a loop of its own', () => {
    const { calls, notes, step } = start();
    expect(calls.created).toBe(1);
    expect(calls.run).toBe(1);
    // Nothing has been stepped yet, so nothing has been painted.
    expect(notes[0].style.translate).toBe('');
    step(1);
    expect(notes[0].style.translate).not.toBe('');
    // Individual properties, so the pill's own transform and scale-in survive.
    expect(notes[0].style.transform).toBe('');
    expect(notes[0].style.rotate).toMatch(/rad$/);
  });

  it('does not swallow the visitor\'s scroll', () => {
    const { board } = start();
    // Matter's Mouse binds wheel and touch handlers that call preventDefault,
    // which on a page rather than a game means the board eats the page scroll.
    const wheel = new Event('wheel', { bubbles: true, cancelable: true });
    board.dispatchEvent(wheel);
    expect(wheel.defaultPrevented).toBe(false);

    const touch = new Event('touchstart', { bubbles: true, cancelable: true });
    board.dispatchEvent(touch);
    expect(touch.defaultPrevented).toBe(false);
  });
});

describe('the rest state is the readable grid', () => {
  it('announces itself with a visible nudge and then settles back', () => {
    const { notes, step } = start();
    step(6);
    // The notes were pinned exactly where they already sat, so without the entry
    // kick the handover to physics would be literally invisible.
    expect(Math.max(...offsets(notes))).toBeGreaterThan(1);

    step(400);
    // What the visitor is left looking at is the list they were reading.
    expect(Math.max(...offsets(notes))).toBeLessThan(1);
    expect(Math.max(...angles(notes))).toBeLessThan(0.5);
  });

  it('does not let gravity sag a note off its line', () => {
    const { notes } = start({ steps: 400 });
    const dy = notes.map((el) => parseFloat(el.style.translate.split(' ')[1]));
    // Full earth gravity, and the pins give up half a pixel to it. That half pixel
    // is what buys the throw its arc — see PIN_STIFFNESS — and on a 59px note
    // under a 2px border there is nothing there to see.
    expect(Math.max(...dy.map(Math.abs))).toBeLessThan(1);
  });

  it('reassembles itself exactly after a throw', () => {
    const { notes, handle, step } = start({ steps: 400 });
    handle.shake();

    let peak = 0;
    let peakFrame = 0;
    let peakTilt = 0;
    for (let i = 1; i <= 120; i += 1) {
      step(1);
      const now = Math.max(...offsets(notes));
      if (now > peak) {
        peak = now;
        peakFrame = i;
      }
      peakTilt = Math.max(peakTilt, ...angles(notes));
    }
    // Unmistakably physical: notes cross the 20px gap between the two rows.
    expect(peak).toBeGreaterThan(25);
    // And they travel to get there. This is the assertion the first version of
    // this file was missing: with a stiffer pin the apex landed on frame 1, so the
    // notes never moved across the screen at all — they appeared displaced and
    // converged, which reads as a rendering glitch rather than a throw.
    expect(peakFrame).toBeGreaterThan(1);
    // Still readable while they do it — nothing tumbles.
    expect(peakTilt).toBeGreaterThan(3);
    expect(peakTilt).toBeLessThan(30);

    step(600);
    expect(Math.max(...offsets(notes))).toBeLessThan(1);
    expect(Math.max(...angles(notes))).toBeLessThan(0.5);
  });

  it('announces itself more gently than a deliberate shake', () => {
    const { notes, handle, step } = start();
    let entry = 0;
    let entryTilt = 0;
    for (let i = 0; i < 40; i += 1) {
      step(1);
      entry = Math.max(entry, ...offsets(notes));
      entryTilt = Math.max(entryTilt, ...angles(notes));
    }

    step(400);
    handle.shake();
    let shake = 0;
    let shakeTilt = 0;
    for (let i = 0; i < 40; i += 1) {
      step(1);
      shake = Math.max(shake, ...offsets(notes));
      shakeTilt = Math.max(shakeTilt, ...angles(notes));
    }

    // Both, not just the displacement: `setAngularVelocity` is absolute, so a
    // fixed spin would have made the entrance turn the notes exactly as hard as
    // pressing the button does.
    expect(entry).toBeLessThan(shake);
    expect(entryTilt).toBeLessThan(shakeTilt);
  });

  it('survives being thrown repeatedly', () => {
    const { notes, handle, step } = start({ steps: 300 });
    for (let i = 0; i < 8; i += 1) {
      handle.shake();
      step(200);
    }
    expect(Math.max(...offsets(notes))).toBeLessThan(1);
    expect(Math.max(...angles(notes))).toBeLessThan(0.5);
  });
});

describe('pausing', () => {
  it('stops and restarts the clock without disturbing the world', () => {
    const { notes, handle, calls, step } = start({ steps: 20 });
    const before = notes[1].style.translate;

    handle.setRunning(false);
    expect(calls.stopped).toBe(1);
    // The runner is what wakes the main thread every frame; a body with a
    // constraint attached can never sleep, because Constraint.postSolveAll wakes
    // anything its impulses touched.
    expect(notes[1].style.translate).toBe(before);

    handle.setRunning(true);
    expect(calls.run).toBe(2);
    // Positions carried across the pause, which is the whole difference between
    // this and stop().
    expect(notes[1].style.translate).toBe(before);
    step(1);
    expect(notes[1].style.translate).not.toBe(before);
  });

  it('ignores a request for the state it is already in', () => {
    const { handle, calls } = start();
    handle.setRunning(true);
    expect(calls.run).toBe(1);
    handle.setRunning(false);
    handle.setRunning(false);
    expect(calls.stopped).toBe(1);
  });

  it('is left stopped by a teardown, so a later resume cannot restart a dead engine', () => {
    const { handle, calls } = start();
    handle.stop();
    expect(calls.stopped).toBe(1);
    handle.setRunning(false);
    expect(calls.stopped).toBe(1);
  });
});

describe('handing the grid back', () => {
  it('unwrites every style it wrote', () => {
    const { board, notes, handle } = start({ steps: 60 });
    handle.stop();

    expect(board.classList.contains('is-physical')).toBe(false);
    expect(board.classList.contains('is-lifted')).toBe(false);
    expect(board.style.height).toBe('');
    for (const el of notes) {
      // Back in the flex row it came from, so a resize can re-measure the newly
      // wrapped grid and hand it over again from scratch.
      expect(el.getAttribute('style')).toBe('');
      expect(el.className).toBe('sketch-pill');
    }
  });

  it('stops painting', () => {
    const { notes, handle, step } = start({ steps: 60 });
    handle.stop();
    step(60);
    expect(notes[0].style.translate).toBe('');
  });

  it('can hand the same grid over again', () => {
    const { board, notes, handle } = start({ steps: 60 });
    handle.stop();

    const { injected, getEngine } = stubRunner();
    const again = startBoard({ Matter: injected, board, notes });
    for (let i = 0; i < 400; i += 1) Matter.Engine.update(getEngine(), STEP);
    expect(board.style.height).toBe(`${BOARD_HEIGHT}px`);
    expect(Math.max(...offsets(notes))).toBeLessThan(1);
    again.stop();
  });
});
