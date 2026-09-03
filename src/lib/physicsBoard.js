// The skills board: real rigid-body physics on real DOM text.
//
// Deliberately framework-free and Matter-injected rather than imported. The
// caller owns the `import('matter-js')`, which is what keeps 25 kB out of the
// initial bundle, and a test can drive this with the real engine while stubbing
// only the runner, which is how the numbers below were measured.
//
// The design constraint that shapes everything: the notes are the page's actual
// skills list, not decoration. So the notes are not dropped into a pile — a pile
// hides words, and nine notes totalling 1589px of width in a 1036px box can only
// pile by overlapping. Each note is pinned instead, by two constraints through
// its top edge, exactly where it already sat. Physics is then what happens when
// the visitor disturbs them, and the rest state is the readable grid it started
// as: measured at half a pixel and 0.01deg from home, and back to that inside
// 1.6s after every throw.

/** Paper, roughly. Barely bounces, grips what it lands on, and is slowed by air
    far more than a dense object would be — a sticky note does not sail. */
const NOTE = {
  restitution: 0.18,
  friction: 0.55,
  frictionAir: 0.035,
  density: 0.0012,
};

/** Earth. Nothing falls into a heap here, so there is no reason to weaken it —
    what gravity does on this board is make a note hang from its pins and give a
    thrown one somewhere to come back down to. */
const GRAVITY_Y = 1;

/** The two pins, as a spring.
 *
 * This is the only knob that shapes how the board *moves*, and finding that out
 * took ruling the obvious one out. Matter's constraints are positional, not
 * force-based: `Constraint.solve` splits its correction by
 * `bodyB.mass / (bodyA.mass + bodyB.mass)`, and against a static world point
 * bodyB takes all of it however much it weighs. Measured — sweeping density over
 * a 20x range produced byte-identical trajectories. So heavier paper is not
 * available as a tuning knob; only the fraction of the error a pin removes per
 * step is.
 *
 * The trade it controls is sag against travel, and it is monotone (measured at
 * 60fps, throw force 0.16):
 *
 *   stiffness   rest sag   apex     apex at   quiet again
 *   0.06        0.21px     27px     frame 1   1.0s
 *   0.03        0.51px     40px     frame 2   1.6s
 *   0.02        0.82px     50px     frame 2   2.4s
 *   0.012       1.43px     62px     frame 3   never (>6.6s)
 *
 * 0.06 is stiffer than it sounds: the apex lands on the very first painted frame,
 * so the notes never travel anywhere — they appear displaced and converge, which
 * reads as a glitch rather than a throw. Below 0.02 the list is still twitching
 * seconds later. 0.03 buys a real arc and three visible swings for half a pixel
 * of sag, which on a 59px note under a 2px border is not a thing anyone can see.
 */
const PIN_STIFFNESS = 0.03;
const PIN_DAMPING = 0.05;

/**
 * Half the distance between the two pins, as a fraction of the note's width.
 *
 * This is the constant that took the most finding. One pin per note cannot work:
 * a point constraint does not resist rotation, so the only thing righting a
 * tilted note is gravity's torque about the pin — which, against a note's
 * inertia, is far too weak. Measured, a single centre pin left the notes resting
 * 29deg over and sent them past 129deg on a throw, i.e. upside down.
 *
 * Two pins fix it because rotating the note has to stretch both, and the
 * restoring torque grows with the square of this arm. Proportional to width
 * rather than a fixed offset so a 102px note and a 265px one resist a spin
 * equally: 0.42 of the width took the tilt while dragging from 111deg to 11deg.
 */
const PIN_ARM = 0.42;

/** Multiplies the moment of inertia Matter derives from the shape. Notes still
    turn as they are pulled, but they resist being set spinning, so they settle at
    angles a label is readable at. 14 was tried and rotated too freely on a
    shake — 24deg against this 14deg. */
const INERTIA_SCALE = 6;

/** Grabbing paper, not a handle welded to it. Low stiffness lets the note lag
    behind the cursor — measured 98px of travel for 148px of drag — and swing
    under its own weight on the way back. */
const DRAG_STIFFNESS = 0.18;

/**
 * Two uses of one mechanism. The smaller kick is the entrance: the notes are
 * pinned exactly where they already were, so without it the handover to physics
 * would be literally invisible. The larger is the replay.
 *
 * `applyForce` writes `body.force`, which Matter clears at the end of the step,
 * so this is an impulse and the number is really an initial velocity:
 * `force / mass * deltaTimeSquared`, about 278x the value at 60fps. Both are set
 * against the pins above rather than in isolation — measured, the shake's
 * displacement peak by frame, in px:
 *
 *   36 40 30 19 18 26 26 22 15 16 15 11 8 7 5 3 3 4 7 8 9 9 9 8 8 8 8 7 6 5
 *
 * — an apex on frame 2, a second swing at frame 6 and a third around frame 21,
 * quiet again inside 1.6s. The entrance is the same shape at 23px.
 */
const ENTRY_FORCE = 0.09;
const SHAKE_FORCE = 0.16;

/** Radians per step of spin a full-strength shake adds, before the random
    factor. Enough to see the notes turn — it peaks near 24deg eight frames in —
    and not enough to tumble them. A weaker throw gets proportionally less, so
    the entrance is quieter than the deliberate shake in both respects. */
const SHAKE_SPIN = 0.2;

/**
 * Where each note sits right now, measured while it is still in normal flow.
 *
 * Read in one pass before anything is mutated: asking for offsetWidth after
 * having written a style forces a synchronous layout per note, and interleaving
 * the two is how a smooth start becomes a visible stutter.
 *
 * `offsetLeft`/`offsetTop` and not `getBoundingClientRect`, because the pills may
 * still be mid-way through their scale-in when this runs and a rect reports the
 * transformed box while the offsets report the laid-out one.
 *
 * @param {HTMLElement[]} notes
 * @returns {{ el: HTMLElement, x: number, y: number, w: number, h: number }[]}
 */
const measure = (notes) =>
  notes.map((el) => ({
    el,
    x: el.offsetLeft,
    y: el.offsetTop,
    w: el.offsetWidth,
    h: el.offsetHeight,
  }));

/**
 * Matter's Mouse binds wheel and touch listeners that call preventDefault, which
 * on a page — as opposed to a full-screen game — means the board eats the
 * visitor's scroll the moment the cursor crosses it.
 *
 * Removing them costs the ability to drag a note with a finger, and that is the
 * right trade: nobody wants to discover that flicking a portfolio upward throws
 * stationery instead of scrolling.
 */
const releaseScroll = (mouse) => {
  const { element } = mouse;
  element.removeEventListener('wheel', mouse.mousewheel);
  element.removeEventListener('mousewheel', mouse.mousewheel);
  element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
  element.removeEventListener('touchstart', mouse.mousedown);
  element.removeEventListener('touchmove', mouse.mousemove);
  element.removeEventListener('touchend', mouse.mouseup);
};

/**
 * The pair of pins holding one note to the spot it was laid out on.
 *
 * Both anchor into the world at the note's top edge and into the body at its own
 * top edge, so the rest length is zero and "at rest" is the seat itself rather
 * than somewhere near it.
 */
const pinsFor = (Matter, body, seat) => {
  const arm = seat.w * PIN_ARM;
  return [-arm, arm].map((dx) =>
    Matter.Constraint.create({
      pointA: { x: seat.x + seat.w / 2 + dx, y: seat.y },
      bodyB: body,
      pointB: { x: dx, y: -seat.h / 2 },
      stiffness: PIN_STIFFNESS,
      damping: PIN_DAMPING,
      length: 0,
      render: { visible: false },
    }),
  );
};

/**
 * Hands the skills grid over to a physics engine, and returns the function that
 * hands it back.
 *
 * The notes do not move when this is called. They are pinned to the exact pixels
 * they already occupied, and only then are they nudged — so the transition into
 * physics is invisible and what the visitor sees is the list they were reading
 * beginning to move.
 *
 * @param {object} args
 * @param {object} args.Matter the module, injected so the caller owns the import
 * @param {HTMLElement} args.board the container the notes are positioned against
 * @param {HTMLElement[]} args.notes
 * @returns {{ stop: () => void, shake: () => void, setRunning: (on: boolean) => void }}
 *   stop restores flow layout and releases every listener; shake throws the notes
 *   again; setRunning pauses and resumes the clock without losing state.
 */
export const startBoard = ({ Matter, board, notes }) => {
  const { Engine, Runner, Composite, Bodies, Body, Mouse, MouseConstraint, Events } = Matter;

  // Before measuring, not after. `is-physical` is what makes the board
  // `position: relative`, and offsetLeft/offsetTop are reported relative to the
  // nearest positioned ancestor — measure first and every note gets placed using
  // coordinates that belong to some box further up the page.
  board.classList.add('is-physical');

  const seats = measure(notes);
  // Read before the notes are taken out of the flow, or the flex container has no
  // in-flow children left, collapses to zero, and the whole page below jumps up.
  const height = board.clientHeight;

  board.style.height = `${height}px`;

  // The second class, and the reason there are two. Establishing the coordinate
  // space has to happen *before* the measurement and lifting the notes out of the
  // flow has to happen *after* it, so they cannot be the same class: adding one
  // that did both made every note absolute while the row was still being read,
  // which collapsed the row to zero height and returned nine meaningless offsets.
  board.classList.add('is-lifted');

  for (const seat of seats) {
    // Only the three measurements. `position: absolute` and `margin: 0` are the
    // same for every note, so they belong to `.is-lifted` in the stylesheet and
    // are undone by removing the class rather than by nine more property writes.
    Object.assign(seat.el.style, {
      left: `${seat.x}px`,
      top: `${seat.y}px`,
      width: `${seat.w}px`,
    });
  }

  // No sleeping, and not by omission: `Constraint.postSolveAll` wakes any body
  // whose constraints produced an impulse, which for a permanently pinned note is
  // every single step. Measured — a pinned body's sleep counter never leaves 0
  // even with its motion at 1e-29. `setRunning` below is what actually stops the
  // work when the section is not on screen.
  const engine = Engine.create();
  engine.gravity.y = GRAVITY_Y;

  const bodies = seats.map((seat) => {
    const body = Bodies.rectangle(seat.x + seat.w / 2, seat.y + seat.h / 2, seat.w, seat.h, {
      // Paper corners are not sharp, and a rounded body stops two notes catching
      // on each other's exact corner.
      chamfer: { radius: 6 },
      ...NOTE,
    });
    // setInertia after creation, because Matter derives the initial value from
    // the vertices.
    Body.setInertia(body, body.inertia * INERTIA_SCALE);
    return { body, seat, pins: pinsFor(Matter, body, seat) };
  });

  const mouse = Mouse.create(board);
  releaseScroll(mouse);
  const drag = MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: DRAG_STIFFNESS, render: { visible: false } },
  });

  Composite.add(engine.world, [
    ...bodies.flatMap((n) => [n.body, ...n.pins]),
    drag,
  ]);

  // The one place the simulation reaches the screen. `translate` and `rotate` as
  // individual properties, not `transform`, matching the rest of the stylesheet:
  // it leaves the pill's own hover transform and its scale-in animation alone.
  const paint = () => {
    for (const { body, seat } of bodies) {
      const dx = body.position.x - (seat.x + seat.w / 2);
      const dy = body.position.y - (seat.y + seat.h / 2);
      seat.el.style.translate = `${dx.toFixed(2)}px ${dy.toFixed(2)}px`;
      seat.el.style.rotate = `${body.angle.toFixed(4)}rad`;
    }
  };
  Events.on(engine, 'afterUpdate', paint);

  const runner = Runner.create();
  Runner.run(runner, engine);
  let running = true;

  /**
   * Stops and restarts the clock without disturbing the world.
   *
   * The runner would otherwise keep waking the main thread every frame for a set
   * of notes that has scrolled off the top of the page. Bodies keep their
   * positions across a pause, which is the whole difference between this and
   * `stop`.
   *
   * Resuming after a long gap is safe without resetting anything: Matter's runner
   * rejects a frame delta larger than `maxFrameTime` and reuses the last good
   * one, so the pause cannot arrive as one enormous step.
   */
  const setRunning = (on) => {
    if (on === running) return;
    running = on;
    if (on) Runner.run(runner, engine);
    else Runner.stop(runner);
  };

  /**
   * Throws every note, and is also how the board announces itself.
   *
   * The section only comes alive once, and the notes start pinned exactly where
   * they already were — so without a kick, the handover to physics would be
   * invisible, and a visitor who scrolls back later would find a grid with no
   * evidence anything had ever moved. Both problems have the same answer, at two
   * different strengths.
   */
  const throwNotes = (force) => {
    // Proportional, so the entrance is a gentler version of the shake rather than
    // a quieter one that spins just as hard. Spin does not scale with force on
    // its own: `setAngularVelocity` is absolute.
    const spin = SHAKE_SPIN * (force / SHAKE_FORCE);
    for (const { body } of bodies) {
      Body.applyForce(body, body.position, {
        // Scaled by mass so a wide note and a narrow one leap the same height,
        // rather than the short ones firing off the top of the box.
        x: (Math.random() - 0.5) * 1.6 * force * body.mass,
        y: -force * body.mass,
      });
      Body.setAngularVelocity(body, (Math.random() - 0.5) * spin);
    }
  };

  throwNotes(ENTRY_FORCE);

  const stop = () => {
    Events.off(engine, 'afterUpdate', paint);
    releaseScroll(mouse);
    Runner.stop(runner);
    running = false;
    Composite.clear(engine.world, false);
    Engine.clear(engine);

    // Everything this function wrote, unwritten. The notes go back into the flex
    // row they came from, so a re-render — or a window resize, which is what
    // re-wraps the row and therefore invalidates every seat — gets the readable
    // grid back and can hand it over again from scratch.
    board.style.height = '';
    board.classList.remove('is-physical', 'is-lifted');
    for (const { el } of seats) {
      for (const prop of ['left', 'top', 'width', 'translate', 'rotate']) {
        el.style.removeProperty(prop);
      }
    }
  };

  return { stop, shake: () => throwNotes(SHAKE_FORCE), setRunning };
};
