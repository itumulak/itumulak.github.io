import { afterEach, describe, expect, it, vi } from 'vitest';

type FilterFn = (entry: { data: { draft: boolean } }) => boolean;

const getCollectionMock = vi.fn<(collection: string, filter?: FilterFn) => Promise<unknown[]>>();

vi.mock('astro:content', () => ({
  getCollection: (...args: Parameters<typeof getCollectionMock>) => getCollectionMock(...args),
}));

const { getPublishedPosts, PAGE_SIZE } = await import('./posts');

function entry(id: string, date: string, draft = false) {
  return { id, data: { title: id, date: new Date(date), excerpt: '', tags: [], draft } };
}

function mockEntries(entries: ReturnType<typeof entry>[]) {
  getCollectionMock.mockImplementation(async (_collection, filter) =>
    filter ? entries.filter((e) => filter(e)) : entries,
  );
}

describe('getPublishedPosts', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    getCollectionMock.mockReset();
  });

  it('returns published posts sorted newest first (AC-4)', async () => {
    mockEntries([entry('older', '2026-01-01'), entry('newer', '2026-03-01')]);

    const posts = await getPublishedPosts();

    expect(posts.map((p) => p.id)).toEqual(['newer', 'older']);
  });

  it('breaks a tie between same-date posts by id ascending, for a stable order (AC-4)', async () => {
    mockEntries([entry('b-post', '2026-01-01'), entry('a-post', '2026-01-01')]);

    const posts = await getPublishedPosts();

    expect(posts.map((p) => p.id)).toEqual(['a-post', 'b-post']);
  });

  it('excludes draft posts in a production build (AC-3)', async () => {
    vi.stubEnv('PROD', true);
    mockEntries([entry('published', '2026-01-01'), entry('draft', '2026-01-02', true)]);

    const posts = await getPublishedPosts();

    expect(posts.map((p) => p.id)).toEqual(['published']);
  });

  it('includes draft posts outside a production build (AC-3)', async () => {
    vi.stubEnv('PROD', false);
    mockEntries([entry('published', '2026-01-01'), entry('draft', '2026-01-02', true)]);

    const posts = await getPublishedPosts();

    expect(posts.map((p) => p.id)).toEqual(['draft', 'published']);
  });

  it('returns an empty array when there are no published posts (AC-5)', async () => {
    mockEntries([]);

    const posts = await getPublishedPosts();

    expect(posts).toEqual([]);
  });

  it('exports the decided listing page size', () => {
    expect(PAGE_SIZE).toBe(10);
  });
});
