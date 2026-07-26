import { getCollection } from 'astro:content';

/**
 * Posts per listing page (spec 0002). The listing page (feature 8) reads this
 * to build its pagination; do not hardcode 10 elsewhere.
 */
export const PAGE_SIZE = 10;

/**
 * Decided URL scheme (spec 0002), for the features that build these routes:
 * - `/blog/[slug]/` (feature 9): one page per collection entry id.
 * - `/blog/` (feature 8): the listing's page 1.
 * - `/blog/page/[page]/` (feature 8): the listing's page 2 and beyond.
 * The listing is split across two path shapes so it can never collide with
 * `/blog/[slug]/` at the same URL depth.
 */

export async function getPublishedPosts() {
  const posts = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });

  return posts.sort((a, b) => {
    const byDate = b.data.date.getTime() - a.data.date.getTime();
    return byDate !== 0 ? byDate : a.id.localeCompare(b.id);
  });
}
