// The spring solver, and the one thing that can silently rot about it: the CSS in
// the repository is generated, so nothing at runtime would notice if a parameter
// were edited and `npm run springs` never run. The last test in this file is the
// only thing standing between that and a shipped stylesheet whose comments
// describe curves it does not contain.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dampingRatio, naturalFrequency, springPosition, settleTime, springEasing } from '../src/lib/spring';
import { SPRINGS, buildSpringCss, springCssPath } from '../scripts/springs.mjs';

const UNDER = { mass: 1, stiffness: 1000, damping: 20 };
const CRITICAL = { mass: 1, stiffness: 400, damping: 40 };
const OVER = { mass: 1, stiffness: 400, damping: 120 };

/** Densely enough sampled to catch a peak the 8ms authoring grid would step over. */
const scan = (spring, seconds = 3, step = 0.0005) => {
  const out = [];
  for (let t = 0; t <= seconds; t += step) out.push(springPosition(t, spring));
  return out;
};

describe('damping ratio and frequency', () => {
  it('reads 1 exactly when damping is 2*sqrt(k*m)', () => {
    expect(dampingRatio(CRITICAL)).toBe(1);
    expect(dampingRatio(UNDER)).toBeLessThan(1);
    expect(dampingRatio(OVER)).toBeGreaterThan(1);
  });

  it('is independent of mass only in the sense that mass enters both terms', () => {
    expect(naturalFrequency({ mass: 1, stiffness: 400 })).toBe(20);
    // Four times the mass halves the frequency — the spring takes twice as long.
    expect(naturalFrequency({ mass: 4, stiffness: 400 })).toBe(10);
  });
});

describe('step response', () => {
  it('starts at 0 and ends at 1 in all three regimes', () => {
    for (const spring of [UNDER, CRITICAL, OVER]) {
      expect(springPosition(0, spring)).toBe(0);
      expect(springPosition(-1, spring)).toBe(0);
      expect(springPosition(10, spring)).toBeCloseTo(1, 6);
    }
  });

  it('overshoots when underdamped and never when it is not', () => {
    expect(Math.max(...scan(UNDER))).toBeGreaterThan(1.05);
    // The whole reason `settle` exists as its own spring: text that passes its
    // final position and comes back reads as a mistake.
    expect(Math.max(...scan(CRITICAL))).toBeLessThanOrEqual(1);
    expect(Math.max(...scan(OVER))).toBeLessThanOrEqual(1);
  });

  it('crosses its target more than once when it is lively enough', () => {
    const crossings = scan(SPRINGS.wobble).reduce(
      (n, v, i, all) => (i > 0 && (all[i - 1] < 1) !== (v < 1) ? n + 1 : n),
      0,
    );
    expect(crossings).toBeGreaterThanOrEqual(3);
  });
});

describe('settle time', () => {
  it('is a moment after which the curve stays inside tolerance', () => {
    const tolerance = 0.002;
    const t = settleTime(CRITICAL, tolerance);
    for (let u = t; u <= t + 1; u += 0.001) {
      expect(Math.abs(springPosition(u, CRITICAL) - 1)).toBeLessThanOrEqual(tolerance);
    }
    // ...and a moment before which it was not, or the answer is just padding.
    expect(Math.abs(springPosition(t - 0.01, CRITICAL) - 1)).toBeGreaterThan(tolerance);
  });

  it('shortens as the spring stiffens', () => {
    expect(settleTime({ mass: 1, stiffness: 2000, damping: 60 })).toBeLessThan(
      settleTime({ mass: 1, stiffness: 200, damping: 19 }),
    );
  });

  it('cannot run away on a nearly undamped spring', () => {
    expect(settleTime({ mass: 1, stiffness: 400, damping: 0.01 }, 0.002, 4000)).toBeLessThanOrEqual(4);
  });
});

describe('linear() emission', () => {
  it('pins both ends, whatever the solver landed on', () => {
    const { css } = springEasing(UNDER);
    const stops = css.slice('linear('.length, -1).split(', ').map(Number);
    expect(stops[0]).toBe(0);
    expect(stops.at(-1)).toBe(1);
    expect(stops.length).toBeGreaterThan(12);
  });

  it('keeps the sample count inside its bounds', () => {
    // A very fast spring would otherwise emit three stops, a very slow one hundreds.
    expect(springEasing({ mass: 1, stiffness: 90000, damping: 600 }).samples).toBe(12);
    expect(springEasing({ mass: 1, stiffness: 400, damping: 1 }).samples).toBe(64);
  });

  it('reports the peak so the generator can describe the curve honestly', () => {
    expect(springEasing(CRITICAL).peak).toBe(1);
    expect(springEasing(SPRINGS.wobble).peak).toBeGreaterThan(1.2);
  });
});

describe('the committed stylesheet', () => {
  const committed = readFileSync(springCssPath, 'utf8');

  it('is exactly what the solver produces today', () => {
    // If this fails, the parameters in scripts/springs.mjs were changed without
    // running `npm run springs`. The fix is to run it, not to edit the CSS.
    expect(committed).toBe(buildSpringCss());
  });

  it('defines a curve and a duration for every spring', () => {
    for (const name of Object.keys(SPRINGS)) {
      expect(committed).toContain(`--spring-${name}: linear(`);
      expect(committed).toMatch(new RegExp(`--spring-${name}-ms: \\d+ms;`));
    }
  });

  it('guards the fallback behind a negative @supports', () => {
    // A plain declaration above the linear() one would lose everywhere and then
    // fail at substitution time in exactly the browsers it was meant to protect.
    const [, guarded] = committed.split('@supports not (transition-timing-function: linear(0, 1))');
    expect(guarded).toBeDefined();
    for (const name of Object.keys(SPRINGS)) {
      expect(guarded).toContain(`--spring-${name}: cubic-bezier(`);
    }
  });

  it('has no spring the site never asks for', () => {
    const sheet = readFileSync(new URL('../src/styles/sketchbook.css', import.meta.url), 'utf8');
    for (const name of Object.keys(SPRINGS)) {
      expect(sheet).toContain(`var(--spring-${name},`);
      expect(sheet).toContain(`var(--spring-${name}-ms,`);
    }
  });
});
