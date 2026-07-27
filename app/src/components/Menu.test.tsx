import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Menu, type MenuItem } from './Menu';

function mockMatchMedia(reducedMotion = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: reducedMotion && query.includes('reduce'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

const items: MenuItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Resume', href: '/resume.pdf', external: true },
];

describe('Menu', () => {
  beforeEach(() => {
    mockMatchMedia(false);
    document.body.style.position = '';
    document.body.style.top = '';
  });

  it('renders every item as a desktop nav link', () => {
    render(<Menu items={items} />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(nav).getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about');
    expect(within(nav).getByRole('link', { name: 'Resume' })).toHaveAttribute(
      'href',
      '/resume.pdf',
    );
  });

  it('opens an external item in a new tab with rel=noreferrer, keeps internal items in the same tab', () => {
    render(<Menu items={items} />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    const aboutLink = within(nav).getByRole('link', { name: 'About' });
    const resumeLink = within(nav).getByRole('link', { name: 'Resume' });
    expect(aboutLink).not.toHaveAttribute('target');
    expect(resumeLink).toHaveAttribute('target', '_blank');
    expect(resumeLink).toHaveAttribute('rel', 'noreferrer');
  });

  it('starts closed: toggle has aria-expanded=false and an "Open menu" label', () => {
    render(<Menu items={items} />);
    const toggle = screen.getByRole('button', { name: 'Open menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', 'mobile-menu-panel');
  });

  it('opens the mobile panel on toggle click: aria-expanded flips, panel is an accessible dialog', async () => {
    const user = userEvent.setup();
    render(<Menu items={items} />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    const panel = screen.getByRole('dialog', { name: 'Menu' });
    expect(panel).toHaveAttribute('id', 'mobile-menu-panel');
    expect(panel).toHaveAttribute('aria-modal', 'true');
  });

  it('moves focus to the first link inside the panel when it opens', async () => {
    const user = userEvent.setup();
    render(<Menu items={items} />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    const panel = screen.getByRole('dialog', { name: 'Menu' });
    const firstLink = within(panel).getAllByRole('link')[0];
    expect(document.activeElement).toBe(firstLink);
  });

  it('closes on Escape and returns focus to the toggle button', async () => {
    const user = userEvent.setup();
    render(<Menu items={items} />);
    const toggle = screen.getByRole('button', { name: 'Open menu' });
    await user.click(toggle);
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    await user.keyboard('{Escape}');

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Open menu' }));
  });

  it('closes and returns focus to the toggle when a panel link is clicked', async () => {
    const user = userEvent.setup();
    render(<Menu items={items} />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    const panel = screen.getByRole('dialog', { name: 'Menu' });
    await user.click(within(panel).getByRole('link', { name: 'About' }));

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Open menu' }));
  });

  it('traps Tab focus inside the panel: tabbing past the last link wraps to the first', async () => {
    const user = userEvent.setup();
    render(<Menu items={items} />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    const panel = screen.getByRole('dialog', { name: 'Menu' });
    const links = within(panel).getAllByRole('link');
    links[links.length - 1].focus();
    expect(document.activeElement).toBe(links[links.length - 1]);

    await user.tab();

    expect(document.activeElement).toBe(links[0]);
  });

  it('traps Shift+Tab inside the panel: shift-tabbing before the first link wraps to the last', async () => {
    const user = userEvent.setup();
    render(<Menu items={items} />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    const panel = screen.getByRole('dialog', { name: 'Menu' });
    const links = within(panel).getAllByRole('link');
    links[0].focus();
    expect(document.activeElement).toBe(links[0]);

    await user.tab({ shift: true });

    expect(document.activeElement).toBe(links[links.length - 1]);
  });

  it('locks body scroll while the panel is open and unlocks it on close, preserving scroll position', async () => {
    const user = userEvent.setup();
    Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 240 });
    render(<Menu items={items} />);
    expect(document.body.style.position).toBe('');

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(document.body.style.position).toBe('fixed');
    expect(document.body.style.top).toBe('-240px');

    await user.keyboard('{Escape}');
    expect(document.body.style.position).toBe('');
    expect(document.body.style.top).toBe('');
  });

  it('restores scroll position instantly on close, bypassing global smooth scroll behavior', async () => {
    const user = userEvent.setup();
    Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 240 });
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    render(<Menu items={items} />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.keyboard('{Escape}');

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 240, left: 0, behavior: 'instant' });
  });
});
