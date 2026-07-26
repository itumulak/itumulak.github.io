# 0002. Blog content model (markdown collection, schema, and routing pattern)

**Date**: 2026-07-26
**Status**: Accepted

## Summary

This decision defines how blog posts are stored and validated: plain markdown/MDX files in an Astro content collection, checked against a schema at build time (title, date, excerpt, tags, draft; the slug comes from the filename, not a separate field). It also fixes the URL and pagination pattern (10 posts per listing page, at a URL that cannot collide with an article's URL) that the later listing and article page features will build on. No database or headless CMS is involved; every post is a file in the repository.

## Context

The site is porting from a React single page app that used Sanity (a headless CMS) for blog content. The scope for this rebuild already decided to retire Sanity and migrate nothing: blog content will be plain files in the repository, read at build time by Astro's static site generation. What has not yet been decided is the concrete shape of that content: what fields a post must have, how a build should react to a malformed post, how a post's URL is chosen, and how many posts a listing page shows at once.

Three later features depend directly on this: the blog section on the home page (needs title, date, excerpt for a preview list), the blog listing page (needs the pagination pattern), and the single article page (needs the full body and the URL scheme). Getting the field set and the routing pattern wrong here means rework in all three.

## Requirements

**User stories**:
- As the site owner, I want to write a blog post as a single markdown file with frontmatter so that publishing needs no database or CMS, only a file and a commit.
- As a site owner, I want a post with bad or missing frontmatter to fail the build loudly so that a mistake never reaches production silently.
- As a future feature (listing, home page, article page), I want a stable, typed way to read published posts, sorted and paginated, so that each page's build does not reinvent content loading.

**Acceptance criteria**:
- **AC-1**: A markdown or MDX file placed in the blog content collection, with valid frontmatter (title, date, excerpt; tags optional), builds successfully, and its title, date, slug (from the filename), excerpt, tags, and rendered body are readable by any page that queries the collection.
- **AC-2**: A file missing a required frontmatter field (title, date, or excerpt), or with a field of the wrong type, fails the build with a schema error naming the file and field. The build does not succeed with a bad post silently dropped.
- **AC-3**: A post with `draft: true` is excluded from the collection's results in a production build, but included when running the local dev server.
- **AC-4**: `getPublishedPosts()` returns published posts sorted newest first, with a stable order even when two posts share a date.
- **AC-5**: With zero published posts, `getPublishedPosts()` still returns an empty array rather than erroring, so a paginated route built on it can render an empty first page instead of failing.
- **AC-6**: Every collection entry has a unique id (its filename, enforced by the filesystem), so a 1:1 slug to URL mapping is possible without a separate uniqueness check.

The stronger, route level version of AC-4/5/6 (an actual paginated listing at 10 posts a page, an actual article route, an actual not found page) is proven by features 8 and 9 respectively, which build the routes; this spec proves the collection they read from.

## Options considered

### Option 1: Astro Content Layer API with a glob loader (current, Astro 5+)

Define the collection with `defineCollection({ loader: glob(...), schema: z.object({...}) })` in `src/content.config.ts`. This is Astro's current content API (the one Astro 7, the version this project runs, ships and documents as the way forward), backed by Zod for schema validation.

**Pros**:
- Built into Astro, no extra dependency beyond the MDX integration
- Schema errors are Zod errors: a specific field and file, exactly what AC-2 needs
- Actively maintained, the path Astro itself is moving all collections towards

**Cons**:
- Content Layer API changed between Astro major versions; anyone reading older Astro tutorials will see the previous `type: 'content'` syntax and may copy it by mistake

### Option 2: Legacy content collections (`type: 'content'`)

The content collections API that predates the Content Layer API (Astro 2 through 4). Still present in Astro 7 for compatibility.

**Pros**:
- Slightly simpler mental model (no explicit loader function)

**Cons**:
- Superseded pattern; Astro's own docs point new projects at the Content Layer API instead
- No real advantage over Option 1 on this stack, just older

### Option 3: Manual frontmatter parsing (no Astro content collections)

Read `.md`/`.mdx` files directly with a library such as `gray-matter`, parse frontmatter by hand, validate fields with hand written checks.

**Pros**:
- No dependency on Astro's content collection API shape at all

**Cons**:
- No built in schema validation; AC-2 (fail the build on a bad post) has to be built and maintained by hand instead of reusing Zod
- Astro's own static path and image handling integrate with content collections, not with hand rolled file reads; loses that integration for no benefit

### Option 4: A headless CMS (e.g. re-adopt Sanity)

Store posts in an external CMS, fetched at build or request time.

**Pros**:
- A UI for writing posts, no git commit required to publish

**Cons**:
- Already rejected for this rebuild (the scope explicitly retires Sanity and migrates nothing); reintroduces a database and an external service this project deliberately removed

## Decision

**Chosen option**: Option 1: Astro Content Layer API with a glob loader

Blog posts live as `.md`/`.mdx` files under `src/content/blog/`, defined as a collection with a glob loader and a Zod schema in `src/content.config.ts`, using MDX (via the `@astrojs/mdx` integration) rather than plain markdown so a post can later embed a component if needed.

**Implementation skills**: `astro` (`astrolicious/agent-skills`, `.agents/skills/astro/`) · `vitest` (`antfu/skills`, `.agents/skills/vitest/`)

## Rationale

The project is already on Astro 7, so Option 1 costs nothing extra beyond the MDX integration and is the pattern Astro's own documentation teaches for new collections; picking the legacy API (Option 2) would mean building on a path Astro itself is phasing out, for no gain. Manual parsing (Option 3) throws away the one feature this decision most needs, build time schema validation, which is exactly what AC-2 requires: the "done when" bar for this feature is that a sample post validates against a schema, and Zod validation inside a content collection gives that directly. A CMS (Option 4) reopens a decision the scope already closed: no database, no external service, content lives in git.

MDX over plain markdown was the engineer's explicit call during design: it costs one extra integration and a marginally heavier build, in exchange for posts being able to embed a real component later without a second content model change.

## Feature design

**Data model sketch**:

| Field | Type | Required | Notes |
|---|---|---|---|
| slug | string | yes, but not frontmatter | the filename without extension, used as the entry's `id` by the glob loader; not a field the author writes, the file name IS the slug |
| title | string | yes | |
| date | date | yes | publish date, used for sort order; parsed with `z.coerce.date()` so a plain YAML date string works |
| excerpt | string | yes | preview copy for listing and home page cards |
| tags | string array | no | defaults to an empty array |
| draft | boolean | no | defaults to false; true hides the post in a production build |
| body | MDX content | yes | the post itself, not a frontmatter field, read through Astro's `render()` |

No relationships: a single collection, no foreign keys, tags are a plain string array on the post rather than their own entity. The slug is deliberately not a frontmatter field: the glob loader already derives a unique `id` from each file's path, and giving posts a second, independently written slug field would create two identities for one post with no named rule for which one wins. Using the filename as the slug also makes a duplicate slug a filesystem impossibility (two files cannot share a name in the same directory), rather than a rule to enforce.

**State transitions**:
A post has two effective states, draft and published, controlled by the `draft` field. There is no transition history and no separate publish action: flipping the field in a commit is the transition. No further state machine needed.

**API surface**:

This is a static content collection, not an HTTP API; "endpoint" below means the build time read function or the page route that later features will implement against this collection.

| Surface | Kind | Key inputs | Key outputs | Auth | Key errors |
|---|---|---|---|---|---|
| `getCollection('blog', filter)` | build time read | an optional draft filter function | typed entries: id (slug), title, date, excerpt, tags, draft | none (public content) | Zod schema error at build time if any entry's frontmatter is invalid |
| `/blog/[slug]/` (future article page, feature 9) | static route | `slug` param from `getStaticPaths`, one per collection entry id | full rendered body plus frontmatter fields | none | no static path generated for an unknown slug, falls through to the site's 404 (feature 9 provides the 404 page) |
| `/blog/` (future listing page, feature 8, page 1) | static route, paginated | none, always page 1 | the first `PAGE_SIZE = 10` posts, newest first | none | none (always exists once the collection is defined, even if empty) |
| `/blog/page/[page]/` (future listing page, feature 8, pages 2+) | static route, paginated | `page` param, `PAGE_SIZE = 10` | a page of up to 10 posts, newest first | none | an out of range page number is a route Astro's `paginate()` never generates, falls through to the site's 404 |

The listing route is split into two path shapes (`/blog/` for page 1, `/blog/page/[page]/` for the rest) specifically so it cannot collide with `/blog/[slug]/`: a single `/blog/[page]/` pattern would match the same URL depth as an article and Astro could not tell a page number from a slug.

**Value sourcing**:

| Action | Value produced / displayed | Source |
|---|---|---|
| Read the collection | title, date, excerpt, tags | the post's own frontmatter fields (named above) |
| Read the collection | rendered body | the MDX file's body content, via Astro's `render()` on the entry |
| Read the collection | published vs hidden | the `draft` field, filtered by `import.meta.env.PROD` (true in production build, false in local dev), decided in this spec |
| Listing/article route | sort order | derived from the `date` field, descending (newest first); ties broken by `id` ascending so build output is stable, decided in this spec |
| Listing route | page size | fixed constant `PAGE_SIZE = 10`, decided in this spec |
| Article route | URL segment | the collection entry's `id`, which the glob loader derives from the filename (no frontmatter slug field), decided in this spec |
| Listing route | page 1 vs page 2+ URL | `/blog/` is always page 1, `/blog/page/[page]/` is page 2 and beyond, decided in this spec to avoid colliding with `/blog/[slug]/` |

**Key invariants**:
- Every entry in the collection satisfies the Zod schema, or the build fails (AC-2).
- `tags` is always an array (empty, never null or undefined).
- A production build never includes an entry with `draft: true`.
- Every entry's id (and therefore its slug) is unique, guaranteed by the filesystem (two files cannot share a name in the same directory); no separate uniqueness check is needed.
- Every page route that lists or looks up posts reads through `getPublishedPosts()`, never `getCollection('blog')` directly; otherwise a route could leak a draft post that the intended filter would have excluded.

**Security model**:
All blog content is public. No roles, no ownership, no compliance scope; this is public marketing/blog content, not user data.

**Configuration required**:
None. No new environment variables or credentials; `import.meta.env.PROD` is Astro's existing build mode flag.

**Critical test scenarios**:
- Happy path: a sample `.mdx` file with full valid frontmatter builds, and `getCollection('blog')` returns it with correctly typed fields, verifies **AC-1**.
- Failure case: a fixture post missing `excerpt` fails schema validation with an error naming the file and field, verifies **AC-2**.
- Draft handling: a post with `draft: true` is absent from a production `getCollection` read but present in dev, verifies **AC-3**.

## Build plan

1. Add and register the `@astrojs/mdx` integration in `astro.config.mjs`, pinned to an exact version (matching how spec 0001 pins every other dependency), satisfies **AC-1**
2. Define the `blog` collection in `app/src/features/blog/content.ts`: glob loader pointed at `src/content/blog/`, and an exported, importable `blogSchema` (a named `z.object({...})`, not inlined into `defineCollection`, so it can be tested directly) for title, date (`z.coerce.date()`), excerpt (required), tags (default `[]`), draft (default `false`); no `slug` field, the loader's own filename derived `id` is the slug, satisfies **AC-1**, **AC-2**, **AC-6**
3. Add a `getPublishedPosts()` helper in the same module that reads the collection, filters out drafts when `import.meta.env.PROD`, and sorts by `date` descending with `id` ascending as the tiebreak, satisfies **AC-3**, **AC-4**, **AC-5**
4. Add one sample `.mdx` post under `src/content/blog/` with complete, valid frontmatter, confirming the schema end to end (this is the feature's "done when" bar), satisfies **AC-1**
5. Add a Vitest test that imports `blogSchema` directly and asserts it rejects an inline object missing a required field (no on disk fixture, so an intentionally invalid file never risks breaking the real build), satisfies **AC-2**
6. Record the `PAGE_SIZE = 10` constant and the three route patterns (`/blog/[slug]/`, `/blog/` for listing page 1, `/blog/page/[page]/` for pages 2+) alongside `getPublishedPosts()`, so the listing, home page, and article page features (6 through 9) build against the same values and URL shapes instead of re-deciding them, satisfies **AC-6**

## Consequences

**Positive**:
- A bad post is caught at build time, before it ever reaches a deployed page (AC-2), with no CMS or database to run or pay for.
- The listing and article page features inherit a fixed, typed read path (`getPublishedPosts()`) and a settled URL/pagination scheme, so they do not each re-decide it.
- MDX support means a future post can embed a real component without another content model change.

**Negative / tradeoffs**:
- MDX is a slightly heavier build than plain markdown and is one more integration to keep updated.
- Renaming a post's file changes its URL (the filename is the slug), so a published post's URL is not stable across a filename change; a redirect would have to be added by hand if that ever happens.
- The listing page's URL shifts shape between page 1 (`/blog/`) and later pages (`/blog/page/[page]/`), one more pattern for the listing feature to implement correctly, in exchange for not colliding with the article route.

**Neutral**:
- Posts are edited as files and published by committing; there is no writing UI, which is consistent with the project's existing "no CMS" direction, not a new tradeoff introduced here.

## Follow-up

- [ ] The home page's blog section (feature 7) still needs to decide how many recent posts it shows; this spec fixes the listing page's page size (10) but not that separate count.
- [ ] Feature 9 (single article page) owns adding the site's not found (404) page; this spec assumes one exists for an unknown slug to fall through to, but does not build it.
- [ ] `@astrojs/mdx` was added without a dedicated Agent Skill or MCP search (declined during design, the installed `astro` skill was judged sufficient coverage); revisit if MDX specific conventions turn out not to be covered there.
