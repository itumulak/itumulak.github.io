import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Socials, type SocialLink } from './Socials';

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

describe('Socials', () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  it('renders one accessible link per data item', () => {
    const data: SocialLink[] = [
      { name: 'GitHub', url: 'https://github.com/example', icon: 'github' },
      { name: 'LinkedIn', url: 'https://linkedin.com/in/example', icon: 'linkedin' },
    ];
    render(<Socials data={data} />);

    const github = screen.getByRole('link', { name: 'GitHub' });
    expect(github).toHaveAttribute('href', 'https://github.com/example');
    const linkedin = screen.getByRole('link', { name: 'LinkedIn' });
    expect(linkedin).toHaveAttribute('href', 'https://linkedin.com/in/example');
  });

  it('opens every link in a new tab with rel=noreferrer', () => {
    render(<Socials data={[{ name: 'GitHub', url: 'https://github.com', icon: 'github' }]} />);
    const link = screen.getByRole('link', { name: 'GitHub' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });

  it('resolves the icon name to a real rendered icon, not empty or broken', () => {
    render(<Socials data={[{ name: 'GitHub', url: 'https://github.com', icon: 'github' }]} />);
    const link = screen.getByRole('link', { name: 'GitHub' });
    expect(link.querySelector('svg')).not.toBeNull();
  });

  it('renders nothing when data is empty', () => {
    render(<Socials data={[]} />);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});
