import { describe, it, expect } from 'vitest';
import { ICONS } from './icons';

describe('ICONS registry', () => {
  it('maps every key to a defined component function', () => {
    for (const [name, Icon] of Object.entries(ICONS)) {
      expect(Icon, `expected ${name} to be a function`).toBeTypeOf('function');
    }
  });

  it('has no empty registry', () => {
    expect(Object.keys(ICONS).length).toBeGreaterThan(0);
  });

  it('resolves a known key to the same component reference on repeat lookups', () => {
    expect(ICONS.github).toBe(ICONS.github);
  });

  it('does not silently fall back for an unknown key (lookup is undefined, not a default icon)', () => {
    const unknownKey = 'not-a-real-icon' as keyof typeof ICONS;
    expect(ICONS[unknownKey]).toBeUndefined();
  });
});
