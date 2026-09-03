// The z-index ladder, read out of the stylesheet itself.
//
// This exists because of a bug that no other kind of test here could have caught.
// The collapsed nav panel was painted *behind* the hero title on a phone: the
// header was `position: relative` with z-index auto, so it never established a
// stacking context, and the panel's own z-index competed in the root stacking
// context against every element in <main> — where .sketch-title, promoted to a
// compositing layer by its entrance animation, beat it. Raising the panel's
// z-index changed nothing; the header had to win as a unit.
//
// jsdom has no layout, so nothing can assert the *rendered* order. What is
// asserted is the invariant that the fix rests on: each of these four layers
// declares a z-index, and they are ordered. The values are read from the CSS
// rather than duplicated here, so this fails when someone edits the stylesheet
// and not when someone edits this file.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const css = readFileSync(join(process.cwd(), 'src', 'styles', 'sketchbook.css'), 'utf8');

/**
 * The z-index declared in one rule block.
 *
 * Brace-counting rather than a CSS parser: every rule here is flat, and a
 * dependency-free reader is worth more than generality this file will never use.
 *
 * @param {string} selector e.g. '.sketch-header'
 * @param {number} [indent] leading spaces, so a rule inside a media query can be
 *   told apart from a same-named rule at the top level
 */
const layerOf = (selector, indent = 0) => {
  const open = css.indexOf(`\n${' '.repeat(indent)}${selector} {`);
  if (open === -1) throw new Error(`no rule for ${selector} at indent ${indent}`);
  const close = css.indexOf('\n' + ' '.repeat(indent) + '}', open);
  const match = /z-index:\s*(-?\d+)/.exec(css.slice(open, close));
  if (!match) throw new Error(`${selector} declares no z-index`);
  return Number(match[1]);
};

describe('stacking order', () => {
  // Named so a failure says which pair inverted, not just that a number moved.
  const header = () => layerOf('.sketch-header');
  const skipLink = () => layerOf('.sketch-skip-link');
  const progress = () => layerOf('.sketch-progress');
  const lightbox = () => layerOf('.sketch-lightbox');

  // The whole point of the fix: an integer z-index on a positioned element is
  // what makes the header a stacking context, so the panel inside it cannot be
  // overtaken by page content whatever <main> does with its own layers.
  it('gives the header a stacking context of its own', () => {
    expect(Number.isInteger(header())).toBe(true);
    expect(header()).toBeGreaterThan(0);
    expect(/\n\.sketch-header \{[^}]*position:\s*relative/.test(css)).toBe(true);
  });

  // A focused skip link sits over the header's top-left corner, where the logo
  // is. Below the header it would be invisible to the keyboard visitor it exists
  // for — and it comes first in the DOM, so an equal value would lose too.
  it('keeps the skip link above the header', () => {
    expect(skipLink()).toBeGreaterThan(header());
  });

  it('keeps the scroll progress bar above both', () => {
    expect(progress()).toBeGreaterThan(skipLink());
  });

  // A modal that anything can cover is not a modal.
  it('puts the lightbox on top', () => {
    expect(lightbox()).toBeGreaterThan(progress());
  });

  it('is strictly ordered, with no two layers sharing a value', () => {
    const ladder = [header(), skipLink(), progress(), lightbox()];
    expect(new Set(ladder).size).toBe(ladder.length);
    expect([...ladder].sort((a, b) => a - b)).toEqual(ladder);
  });
});

describe('the collapsed nav panel', () => {
  // Indented: this is the rule inside the max-width media query, not the flex
  // row at the top level, which declares no z-index at all.
  const panel = () => layerOf('.sketch-nav', 2);

  it('is positioned, so it overlays the page instead of pushing it down', () => {
    const open = css.indexOf('\n  .sketch-nav {');
    const block = css.slice(open, css.indexOf('\n  }', open));
    expect(block).toMatch(/position:\s*absolute/);
    // Opaque background and a border: the hero is directly behind it.
    expect(block).toMatch(/background:\s*var\(--card\)/);
  });

  // It only has to beat the logo and the two buttons now. This asserts it still
  // beats something — a panel at z-index auto would fall back to DOM order and
  // lose to the header controls that follow it.
  it('outranks its siblings inside the header', () => {
    expect(panel()).toBeGreaterThan(0);
  });
});
