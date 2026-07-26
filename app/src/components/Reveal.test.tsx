import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Reveal } from './Reveal';

function mockMatchMedia(reducedMotion: boolean) {
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

describe('Reveal', () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  it('renders its children', () => {
    render(
      <Reveal>
        <p>hello world</p>
      </Reveal>,
    );
    expect(screen.getByText('hello world')).toBeInTheDocument();
  });

  it('does not render with opacity 0 on initial mount (no flash of hidden content)', () => {
    render(
      <Reveal>
        <p>visible content</p>
      </Reveal>,
    );
    const wrapper = screen.getByText('visible content').parentElement;
    expect(wrapper?.style.opacity).not.toBe('0');
  });

  it('still renders children when the user prefers reduced motion', () => {
    mockMatchMedia(true);
    render(
      <Reveal>
        <p>reduced motion content</p>
      </Reveal>,
    );
    expect(screen.getByText('reduced motion content')).toBeInTheDocument();
  });

  it('does not force opacity 0 under reduced motion either', () => {
    mockMatchMedia(true);
    render(
      <Reveal>
        <p>reduced motion visible</p>
      </Reveal>,
    );
    const wrapper = screen.getByText('reduced motion visible').parentElement;
    expect(wrapper?.style.opacity).not.toBe('0');
  });

  it('accepts delay, y, once, and amount props without throwing', () => {
    expect(() =>
      render(
        <Reveal delay={0.2} y={40} once={false} amount={0.5}>
          <p>configured</p>
        </Reveal>,
      ),
    ).not.toThrow();
    expect(screen.getByText('configured')).toBeInTheDocument();
  });
});
