// A mass-spring-damper, solved analytically and sampled into CSS.
//
// Nothing here runs in the browser. `scripts/springs.mjs` calls it at authoring
// time and writes src/styles/springs.css, which is what ships — so the site pays
// no bytes for the physics and no frames for integrating it, and the curves are
// still derived from stiffness and damping rather than guessed at by dragging a
// bezier handle around.
//
// The reason this is worth doing at all: every transition on the site used `ease`
// or a hand-picked cubic-bezier, and neither can overshoot. A card that stops
// dead on its target has no mass. One that passes it by a percent and comes back
// does, and that single difference is most of what "physical" means in an
// interface.

/** Below this, a damping ratio counts as critical and the underdamped solution's
    `1 - zeta^2` term is too close to zero to divide by. */
const CRITICAL_EPSILON = 1e-6;

/**
 * Damping ratio: < 1 oscillates, 1 is the fastest approach with no overshoot,
 * > 1 crawls in from below. Worth having as its own export because it, not the
 * raw damping number, is what decides how a spring *reads*.
 *
 * @param {{ mass: number, stiffness: number, damping: number }} spring
 */
export const dampingRatio = ({ mass, stiffness, damping }) =>
  damping / (2 * Math.sqrt(stiffness * mass));

/** Undamped natural frequency, in radians per second. */
export const naturalFrequency = ({ mass, stiffness }) => Math.sqrt(stiffness / mass);

/**
 * Position at time `t` of a spring released from 0 at rest and settling at 1.
 *
 * This is the closed-form step response, not a numerical integration: at
 * authoring time there is no reason to accumulate error one frame at a time when
 * the exact answer is three lines of trigonometry.
 *
 * @param {number} t seconds
 * @param {{ mass: number, stiffness: number, damping: number }} spring
 * @returns {number} 0 at rest, 1 at target, and legitimately > 1 mid-flight when
 *   the spring overshoots — which is the entire point.
 */
export const springPosition = (t, spring) => {
  if (t <= 0) return 0;

  const w0 = naturalFrequency(spring);
  const zeta = dampingRatio(spring);

  // Underdamped: decaying envelope times an oscillation. The sine term is what
  // carries the overshoot.
  if (zeta < 1 - CRITICAL_EPSILON) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    return (
      1 -
      Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t))
    );
  }

  // Critically damped. Its own branch because the underdamped form divides by
  // `wd`, which is zero here.
  if (zeta <= 1 + CRITICAL_EPSILON) {
    return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
  }

  // Overdamped: two real roots, no oscillation. Included for completeness rather
  // than because the site uses it — an overdamped spring looks like a slow
  // ease-out, and if that is what is wanted, an ease-out is cheaper to read.
  const s = Math.sqrt(zeta * zeta - 1);
  const r1 = -w0 * (zeta - s);
  const r2 = -w0 * (zeta + s);
  return 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
};

/**
 * When the spring is close enough to 1 to stop drawing it.
 *
 * Scanned rather than solved. The analytic envelope bound only holds for the
 * underdamped case, and a scan is correct in all three regimes for the cost of
 * about a thousand multiplications at authoring time. It looks for the *last*
 * moment the curve is still outside tolerance, so a spring that crosses its
 * target and comes back is not cut off at the crossing.
 *
 * @param {{ mass: number, stiffness: number, damping: number }} spring
 * @param {number} [tolerance] how close to 1 counts as arrived
 * @param {number} [ceilingMs] give up here, so a near-undamped spring cannot spin
 */
export const settleTime = (spring, tolerance = 0.002, ceilingMs = 4000) => {
  const step = 1 / 480;
  const ceiling = ceilingMs / 1000;
  let last = 0;

  for (let t = 0; t <= ceiling; t += step) {
    if (Math.abs(springPosition(t, spring) - 1) > tolerance) last = t;
  }

  return Math.min(last + step, ceiling);
};

/** Trims float noise without flattening the curve: 4 places is ~0.01% of the
    travel, which is far finer than a pixel on anything this animates. */
const round = (n) => Number(n.toFixed(4));

/**
 * Samples a spring into a CSS `linear()` easing function and the duration it
 * should be played over.
 *
 * The duration matters as much as the curve. `linear()` is normalised to whatever
 * `transition-duration` says, so a spring stretched over the wrong duration is
 * just a squiggle — the settling time has to travel with it, which is why this
 * returns both and springs.css emits both.
 *
 * Stops are evenly spaced, so no percentages are needed: CSS distributes a bare
 * list across the duration. That is roughly half the bytes of the explicit form.
 *
 * @param {{ mass: number, stiffness: number, damping: number }} spring
 * @param {{ msPerSample?: number, minSamples?: number, maxSamples?: number }} [opts]
 */
export const springEasing = (spring, opts = {}) => {
  const { msPerSample = 8, minSamples = 12, maxSamples = 64 } = opts;

  const seconds = settleTime(spring);
  const ms = Math.round(seconds * 1000);
  const samples = Math.min(maxSamples, Math.max(minSamples, Math.round(ms / msPerSample)));

  const stops = [];
  for (let i = 0; i <= samples; i += 1) {
    stops.push(round(springPosition((i / samples) * seconds, spring)));
  }

  // Pinned rather than trusted. The solver lands within `tolerance` of 1, and a
  // transition that ends at 0.9987 of its target leaves a card permanently a
  // fraction of a pixel short of where the layout says it is.
  stops[0] = 0;
  stops[stops.length - 1] = 1;

  return {
    ms,
    samples,
    zeta: round(dampingRatio(spring)),
    // Overshoot is reported so the generator can print it in a comment: it is the
    // one number a reader wants when deciding whether a spring is too lively.
    peak: round(Math.max(...stops)),
    css: `linear(${stops.join(', ')})`,
  };
};
