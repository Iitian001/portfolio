// @vitest-environment jsdom
//
// The gate in front of the physics.
//
// Every assertion here is about a visitor who does not get the showpiece. The
// skills list is real content, and the engine is a 26 kB enhancement layered on
// top of it — so a phone, a keyboard-only visitor, someone who asked for reduced
// motion and a failed chunk request all have to end at the plain readable grid,
// and none of them should pay to download the library that draws the other one.
//
// `motionEnabled` is resolved once when src/lib/motion.js is imported, so each
// case resets the module registry and imports the component again under different
// globals — the same arrangement as tests/motion.test.js. React Testing Library
// is imported in the same batch, or it would hold a different copy of React than
// the component and every hook would fail.
import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { skills } from '../src/data/skills';

/** Hoisted, because vi.mock's factory is lifted above the imports. */
const { startBoard, handle } = vi.hoisted(() => {
  const board = { stop: vi.fn(), shake: vi.fn(), setRunning: vi.fn() };
  return { handle: board, startBoard: vi.fn(() => board) };
});

// The engine itself is exercised against the real library in
// tests/physicsBoard.test.js. What matters here is only whether it is reached.
vi.mock('matter-js', () => ({ default: { stubbed: true } }));
vi.mock('../src/lib/physicsBoard', () => ({ startBoard }));

const START_DELAY = 700;
const RESIZE_DEBOUNCE = 250;

/** Observers created since the last reset, in construction order. */
let observers = [];

class FakeObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.targets = [];
    observers.push(this);
  }

  observe(target) {
    this.targets.push(target);
  }

  unobserve() {}

  disconnect() {
    this.disconnected = true;
  }
}

/** The board's own observer, told apart from the nine the pills create by the
    threshold it was given. */
const boardObserver = () => observers.find((o) => o.options?.threshold === 0.35);

/** jsdom reports 0 for every layout property, which would trip the width gate in
    every test. Stubbed on the prototype because the element the component
    measures is created by React and cannot be reached before it exists. */
let boardWidth = 1036;

const load = async ({ hover = true, reduce = false } = {}) => {
  window.IntersectionObserver = FakeObserver;
  window.matchMedia = vi.fn((query) => ({
    matches: query.includes('reduce') ? reduce : query.includes('hover') ? hover : false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));

  vi.resetModules();
  // One batch, so React, the renderer and the component are all the same fresh
  // copy. Importing the component alone would give it a React the already-loaded
  // Testing Library does not share, and every hook would throw.
  const [react, rtl, mod] = await Promise.all([
    import('react'),
    import('@testing-library/react'),
    import('../src/components/SkillsBoard'),
  ]);
  return { ...rtl, StrictMode: react.StrictMode, SkillsBoard: mod.default };
};

/** Runs the timer the board is waiting on and lets the two dynamic imports
    resolve. Both halves are needed: the start is a timeout, the load is a promise. */
const settle = async (act, ms = START_DELAY) => {
  await act(async () => {
    vi.advanceTimersByTime(ms);
  });
};

// Building the module graph — React, the DOM renderer, Testing Library — is what
// this file actually spends its time on, and `vi.resetModules()` makes every case
// pay for it again. Doing one build here, under a hook timeout rather than a test
// timeout, keeps a cold first case from failing purely because it went first.
beforeAll(async () => {
  await load();
}, 30000);

beforeEach(() => {
  observers = [];
  boardWidth = 1036;
  startBoard.mockClear();
  handle.stop.mockClear();
  handle.shake.mockClear();
  handle.setRunning.mockClear();
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get: () => boardWidth,
  });
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  delete HTMLElement.prototype.clientWidth;
  delete window.IntersectionObserver;
  delete window.matchMedia;
  document.body.innerHTML = '';
});

describe('the list itself', () => {
  // One case per test rather than a loop inside one: each rebuilds the module
  // graph, and three of those in a single test outruns the default timeout.
  for (const [who, env] of [
    ['a mouse', {}],
    ['a touchscreen', { hover: false }],
    ['a visitor who asked for less motion', { reduce: true }],
  ]) {
    it(`is every skill, in order, for ${who}`, async () => {
      const { render, cleanup, SkillsBoard } = await load(env);
      render(<SkillsBoard />);
      // The physics never renames, reorders or drops a skill, because the markup
      // is the same markup either way.
      const pills = Array.from(document.querySelectorAll('.sketch-pill'));
      expect(pills.map((el) => el.textContent)).toEqual(skills.map((s) => s.name));
      cleanup();
    });
  }
});

describe('who gets the engine', () => {
  it('nobody whose pointer cannot hover and aim', async () => {
    const { render, act, cleanup, SkillsBoard } = await load({ hover: false });
    render(<SkillsBoard />);
    await settle(act);
    // A note that cannot be dragged is worse than no physics: the cursor
    // promises something the finger cannot collect.
    expect(startBoard).not.toHaveBeenCalled();
    expect(boardObserver()).toBeUndefined();
    expect(document.querySelector('.sketch-skills-shake')).toBeNull();
    cleanup();
  });

  it('nobody who asked for less motion', async () => {
    const { render, act, cleanup, SkillsBoard } = await load({ reduce: true });
    render(<SkillsBoard />);
    await settle(act);
    expect(startBoard).not.toHaveBeenCalled();
    expect(document.querySelector('.sketch-skills-shake')).toBeNull();
    cleanup();
  });

  it('nobody on a board too narrow to be a board', async () => {
    boardWidth = 600;
    const { render, act, cleanup, SkillsBoard } = await load();
    render(<SkillsBoard />);
    await act(async () => {
      boardObserver().callback([{ isIntersecting: true }]);
    });
    await settle(act);
    // Below this the row wraps into four or five lines of one note, and the 20px
    // gap a thrown note travels through no longer exists.
    expect(startBoard).not.toHaveBeenCalled();
    cleanup();
  });

  it('a mouse, once the section is actually on screen', async () => {
    const { render, act, cleanup, SkillsBoard } = await load();
    render(<SkillsBoard />);

    // Mounting is not enough. Nothing is fetched for a visitor who never
    // scrolls this far.
    await settle(act);
    expect(startBoard).not.toHaveBeenCalled();

    await act(async () => {
      boardObserver().callback([{ isIntersecting: true }]);
    });
    // Still waiting: the pills' own staggered entrance has to finish first.
    expect(startBoard).not.toHaveBeenCalled();

    await settle(act);
    expect(startBoard).toHaveBeenCalledTimes(1);
    const args = startBoard.mock.calls[0][0];
    expect(args.board.className).toContain('sketch-skills-grid');
    expect(args.notes.length).toBe(skills.length);
    expect(args.Matter).toEqual({ stubbed: true });
    cleanup();
  });
});

describe('the shake control', () => {
  it('holds its space from the start and only becomes visible once physics is live', async () => {
    const { render, act, cleanup, SkillsBoard } = await load();
    render(<SkillsBoard />);
    const slot = document.querySelector('.sketch-skills-shake');
    // Present before the engine is, so nothing moves when the engine arrives —
    // and this happens on scroll, which does not count as recent input, so a
    // shift here would post a real CLS score.
    expect(slot).not.toBeNull();
    expect(slot.className).not.toContain('is-live');

    await act(async () => {
      boardObserver().callback([{ isIntersecting: true }]);
    });
    await settle(act);
    expect(document.querySelector('.sketch-skills-shake').className).toContain('is-live');
    cleanup();
  });

  it('throws the notes when it is pressed', async () => {
    const { render, screen, act, cleanup, SkillsBoard } = await load();
    render(<SkillsBoard />);
    await act(async () => {
      boardObserver().callback([{ isIntersecting: true }]);
    });
    await settle(act);

    await act(async () => {
      screen.getByRole('button', { name: /shake/i }).click();
    });
    expect(handle.shake).toHaveBeenCalledTimes(1);
    cleanup();
  });
});

describe('while the visitor scrolls', () => {
  it('runs only while the section is on screen, and resumes rather than restarts', async () => {
    const { render, act, cleanup, SkillsBoard } = await load();
    render(<SkillsBoard />);
    const observer = boardObserver();

    await act(async () => observer.callback([{ isIntersecting: true }]));
    await settle(act);
    expect(handle.setRunning).toHaveBeenLastCalledWith(true);

    await act(async () => observer.callback([{ isIntersecting: false }]));
    // A constrained body can never sleep, so pausing the runner is the only thing
    // that actually stops the work for a board that has scrolled away.
    expect(handle.setRunning).toHaveBeenLastCalledWith(false);

    await act(async () => observer.callback([{ isIntersecting: true }]));
    expect(handle.setRunning).toHaveBeenLastCalledWith(true);
    // The world it left, not a new one: coming back does not reset the notes.
    expect(startBoard).toHaveBeenCalledTimes(1);
    expect(handle.stop).not.toHaveBeenCalled();
    cleanup();
  });

  it('does not start running when the delay outlives the section on screen', async () => {
    const { render, act, cleanup, SkillsBoard } = await load();
    render(<SkillsBoard />);
    const observer = boardObserver();

    await act(async () => observer.callback([{ isIntersecting: true }]));
    await act(async () => observer.callback([{ isIntersecting: false }]));
    await settle(act);

    expect(startBoard).toHaveBeenCalledTimes(1);
    // Handed over, but paused: a fast scroll past the section must not leave a
    // simulation stepping behind it.
    expect(handle.setRunning).toHaveBeenCalledWith(false);
    cleanup();
  });
});

describe('when the window changes size', () => {
  it('hands the grid back at once and re-pins it when the mouse stops', async () => {
    const { render, act, cleanup, SkillsBoard } = await load();
    render(<SkillsBoard />);
    await act(async () => boardObserver().callback([{ isIntersecting: true }]));
    await settle(act);
    expect(startBoard).toHaveBeenCalledTimes(1);

    await act(async () => {
      window.dispatchEvent(new Event('resize'));
    });
    // Every seat is a measurement of a wrapped flex row, so all nine are wrong
    // the moment the row re-wraps. The notes go back into the flow immediately
    // rather than hanging in stale positions for the length of the debounce.
    expect(handle.stop).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.sketch-skills-shake').className).not.toContain('is-live');

    await settle(act, RESIZE_DEBOUNCE);
    // Rebuilt from scratch, which is what re-measures.
    expect(startBoard).toHaveBeenCalledTimes(2);
    cleanup();
  });

  it('rebuilds once for a whole drag, not once per event', async () => {
    const { render, act, cleanup, SkillsBoard } = await load();
    render(<SkillsBoard />);
    await act(async () => boardObserver().callback([{ isIntersecting: true }]));
    await settle(act);

    await act(async () => {
      for (let i = 0; i < 20; i += 1) window.dispatchEvent(new Event('resize'));
    });
    await settle(act, RESIZE_DEBOUNCE);
    expect(startBoard).toHaveBeenCalledTimes(2);
    cleanup();
  });

  it('stays out of the way if the window is now too narrow', async () => {
    const { render, act, cleanup, SkillsBoard } = await load();
    render(<SkillsBoard />);
    await act(async () => boardObserver().callback([{ isIntersecting: true }]));
    await settle(act);

    boardWidth = 500;
    await act(async () => {
      window.dispatchEvent(new Event('resize'));
    });
    await settle(act, RESIZE_DEBOUNCE);
    expect(startBoard).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.sketch-skills-shake').className).not.toContain('is-live');
    cleanup();
  });
});

describe('unmounting', () => {
  it('hands the grid back and releases the observer', async () => {
    const { render, act, cleanup, SkillsBoard } = await load();
    render(<SkillsBoard />);
    const observer = boardObserver();
    await act(async () => observer.callback([{ isIntersecting: true }]));
    await settle(act);

    cleanup();
    expect(handle.stop).toHaveBeenCalledTimes(1);
    expect(observer.disconnected).toBe(true);
  });

  it('cannot be left mid-import by a mount that is immediately discarded', async () => {
    const { render, act, cleanup, StrictMode, SkillsBoard } = await load();
    render(
      <StrictMode>
        <SkillsBoard />
      </StrictMode>,
    );
    // StrictMode mounts, tears down and mounts again. The first pass must not
    // leave its start timer behind to hand the same grid over twice.
    await act(async () => {
      for (const observer of observers.filter((o) => o.options?.threshold === 0.35)) {
        observer.callback([{ isIntersecting: true }]);
      }
    });
    await settle(act);
    expect(startBoard).toHaveBeenCalledTimes(1);
    cleanup();
  });
});
