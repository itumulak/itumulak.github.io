import { describe, expect, it } from 'vitest';

import { blogSchema } from './schema';

describe('blogSchema', () => {
  it('accepts a post with every required field', () => {
    const result = blogSchema.safeParse({
      title: 'Hello world',
      date: '2026-01-01',
      excerpt: 'A short preview.',
    });

    expect(result.success).toBe(true);
  });

  it('rejects a post missing excerpt', () => {
    const result = blogSchema.safeParse({
      title: 'Hello world',
      date: '2026-01-01',
    });

    expect(result.success).toBe(false);
  });

  it('defaults tags to an empty array and draft to false', () => {
    const result = blogSchema.parse({
      title: 'Hello world',
      date: '2026-01-01',
      excerpt: 'A short preview.',
    });

    expect(result.tags).toEqual([]);
    expect(result.draft).toBe(false);
  });
});
