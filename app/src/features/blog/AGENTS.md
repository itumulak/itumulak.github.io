# Blog content model

Markdown/MDX blog posts, read through an Astro content collection. Decided in [spec 0002](../../../../docs/specs/0002-blog-content-model.md); read that spec for the full rationale before changing anything here.

## Files

- `schema.ts`: exports `blogSchema`, a plain Zod schema (imports `z` from the `zod` package directly, not from `astro:content`, so it stays importable in a Vitest test; `astro:content` is server only and breaks under the default jsdom test environment).
- `posts.ts`: exports `PAGE_SIZE` (10) and `getPublishedPosts()`, the one read path every blog page must use. It filters out `draft: true` entries in production (`import.meta.env.PROD`) and sorts newest first, tiebreaking by `id` ascending for a stable build.
- `schema.test.ts`: Vitest coverage for `blogSchema` (accepts a valid post, rejects one missing `excerpt`, defaults `tags`/`draft`).
- `../../content.config.ts` (`app/src/content.config.ts`, required by Astro at that fixed path): registers the `blog` collection with a glob loader over `../content/blog/` and `blogSchema`.
- `../../content/blog/` (`app/src/content/blog/`): the posts themselves, `.md`/`.mdx` files. The filename (without extension) IS the slug; there is no separate `slug` frontmatter field.

## Conventions

- Every route that lists or looks up posts reads through `getPublishedPosts()`, never `getCollection('blog')` directly, or a draft could leak into a production page.
- The decided URL scheme (not yet built; features 8 and 9 build the actual routes): `/blog/[slug]/` per post, `/blog/` for the listing's page 1, `/blog/page/[page]/` for pages 2 and beyond, split specifically so the listing route can never collide with the article route at the same URL depth.
- `blogSchema` must keep importing `z` from `zod`, not `astro:content`; any content collection logic that needs to be unit testable in Vitest has to avoid the `astro:content` virtual module entirely.
- `getPublishedPosts()` itself cannot be exercised in a plain Vitest run in this project (the Content Layer data store isn't populated outside Astro's own dev/build lifecycle); it was verified via a temporary scratch page under `astro dev` and `astro build` instead (see `/check verify`'s report on spec 0002). Locking its behavior into `/test` needs that same approach, or a decision to invest in Astro's Vitest content testing utilities.

**Declined**: `@astrojs/mdx` (the installed `astro` skill already covers content collection/MDX conventions) · `zod` (a validation library, no meaningful Agent Skill or MCP surface).

_Drafted by /sync from the introducing change, worth a quick human pass._
