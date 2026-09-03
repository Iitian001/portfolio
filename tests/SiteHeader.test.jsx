// @vitest-environment jsdom

// The collapsing nav and the theme switch.
//
// Neither has any visible state of its own to check — the panel is shown and
// hidden entirely by CSS at a width jsdom does not have. What is asserted here is
// the part that carries the behaviour to assistive technology and to the keyboard:
// aria-expanded, aria-controls, aria-current, and the two ways the panel closes.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SiteHeader from '../src/components/SiteHeader';

const at = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <SiteHeader />
    </MemoryRouter>,
  );

const menuButton = () => screen.getByRole('button', { name: /menu$/i });
const nav = () => screen.getByRole('navigation', { name: 'Main navigation' });

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  document.head.innerHTML = '<meta name="theme-color" content="#faf8f5">';
  window.matchMedia = vi.fn((query) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
});

afterEach(() => {
  cleanup();
  delete window.matchMedia;
});

describe('nav landmark', () => {
  // The nav is always in the document rather than mounted on open, so the
  // document outline has a navigation landmark whether or not the menu is used.
  it('is present even while the menu is closed', () => {
    at('/');
    expect(nav()).toBeTruthy();
    expect(screen.getAllByRole('link').length).toBeGreaterThan(3);
  });

  it('points the button at the panel it controls', () => {
    at('/');
    expect(menuButton().getAttribute('aria-controls')).toBe(nav().id);
    expect(nav().id).toBeTruthy();
  });
});

describe('current page', () => {
  it.each([
    ['/', 'Home'],
    ['/projects', 'Work'],
    ['/certificates', 'Certificates'],
  ])('%s marks %s', (path, label) => {
    at(path);
    expect(screen.getByRole('link', { name: label }).getAttribute('aria-current')).toBe('page');
  });

  // A detail page is still inside the Work section, and the nav should say so.
  it('keeps Work marked on a project detail page', () => {
    at('/project/bloom-chat');
    expect(screen.getByRole('link', { name: 'Work' }).getAttribute('aria-current')).toBe('page');
  });

  it('marks exactly one entry', () => {
    at('/projects');
    expect(screen.getAllByRole('link', { current: 'page' })).toHaveLength(1);
  });

  // Contact is an in-page anchor on the home page, not a section of its own.
  it('never marks Contact', () => {
    at('/');
    expect(screen.getByRole('link', { name: 'Contact' }).getAttribute('aria-current')).toBeNull();
  });
});

describe('the menu button', () => {
  it('starts closed and announces it', () => {
    at('/');
    expect(menuButton().getAttribute('aria-expanded')).toBe('false');
    expect(nav().className).not.toContain('is-open');
  });

  it('opens and closes on click, and relabels itself', () => {
    at('/');
    fireEvent.click(menuButton());
    expect(menuButton().getAttribute('aria-expanded')).toBe('true');
    expect(menuButton().getAttribute('aria-label')).toBe('Close menu');
    expect(nav().className).toContain('is-open');

    fireEvent.click(menuButton());
    expect(menuButton().getAttribute('aria-expanded')).toBe('false');
    expect(menuButton().getAttribute('aria-label')).toBe('Open menu');
  });

  it('closes on Escape and hands focus back, so the next Tab resumes here', () => {
    at('/');
    const button = menuButton();
    fireEvent.click(button);
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button);
  });

  it('ignores other keys', () => {
    at('/');
    fireEvent.click(menuButton());
    fireEvent.keyDown(document, { key: 'a' });
    expect(menuButton().getAttribute('aria-expanded')).toBe('true');
  });

  // An open panel overlaps the page, so a tap outside has to dismiss it or the
  // visitor is stuck behind a menu with no visible way out.
  it('closes on a tap outside itself', () => {
    at('/');
    fireEvent.click(menuButton());
    fireEvent.pointerDown(document.body);
    expect(menuButton().getAttribute('aria-expanded')).toBe('false');
  });

  it('stays open on a tap inside the panel', () => {
    at('/');
    fireEvent.click(menuButton());
    fireEvent.pointerDown(nav());
    expect(menuButton().getAttribute('aria-expanded')).toBe('true');
  });

  // Tapping a link navigates and the panel has to follow, or it stays over the
  // page that just loaded.
  it('closes when a nav link is followed', () => {
    at('/');
    fireEvent.click(menuButton());
    fireEvent.click(screen.getByRole('link', { name: 'Work' }));
    expect(menuButton().getAttribute('aria-expanded')).toBe('false');
  });
});

describe('the theme switch', () => {
  const themeButton = () => screen.getByRole('button', { name: /switch to/i });

  // The label has to name the state it moves to. "Theme" alone tells a screen
  // reader nothing about what the control does.
  it('offers dark while the site is light', () => {
    at('/');
    expect(themeButton().getAttribute('aria-label')).toBe('Switch to dark theme');
  });

  it('applies the theme and inverts its own label', () => {
    at('/');
    fireEvent.click(themeButton());

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(themeButton().getAttribute('aria-label')).toBe('Switch to light theme');
  });

  it('goes back', () => {
    at('/');
    fireEvent.click(themeButton());
    fireEvent.click(themeButton());
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  // The switch sits outside the collapsing nav, so it is reachable at any width
  // without opening the menu.
  it('is not inside the panel that collapses', () => {
    at('/');
    expect(nav().contains(themeButton())).toBe(false);
  });
});
