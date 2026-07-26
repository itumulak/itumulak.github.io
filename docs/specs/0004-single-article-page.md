# 0004. Single article page

**Date**: 2026-07-26
**Status**: Accepted

## Summary

This decision designs the page that renders one full blog post at `/blog/[slug]/`, plus the site's not found (404) page for a bad or missing slug. It builds the article's look by hand with the project's own Tailwind tokens rather than a generic typography plugin, keeps tags as small plain text chips instead of forcing them into components built for a different shape, and scopes inline post images to MDX posts only, using Astro's own image optimizer. The blog section on the home page already links to this route; today those links lead nowhere.

## Context

Spec 0002 (blog content model) fixed the data shape and URL scheme every blog page builds on: posts are markdown or MDX files read through a content collection, `getPublishedPosts()` is the one approved read path, and the article route is `/blog/[slug]/`, one per published post. That spec deliberately left the article page itself, and the site's not found page, for this feature to design; it only notes that an unknown slug should fall through to a 404 page this feature provides.

`design.md` (the project's design system record) documents the home page's single scrolling page composition (`Section` wrapping `Container` wrapping a `Headline` and content), but says plainly that a detail page family like this one is not yet covered, and that future pages will extend these patterns rather than replace them. So the article page's typography (headings, links, code, quotes, lists) and its overall layout are genuinely undecided going in.

Two smaller data mismatches also need resolving here. Post tags are a plain array of strings (spec 0002's schema), but the existing `Tags` component expects one icon per tag and `Pill` expects a link URL; neither fits a post tag as is. And posts can be `.md` or `.mdx` today, with no post yet using an image, no code fence syntax highlighting decision made, and no image handling convention recorded.

The site builds to fully static output for GitHub Pages (spec 0001): every route, including the 404 page, is generated at build time via `getStaticPaths`; there is no per request server logic available to fall back on.

## Requirements

**User stories**:
- As a site visitor, I want to open a blog post link and read its full content, so that I can actually read the article instead of hitting a dead link.
- As a site visitor who follows a bad or outdated blog link, I want a clear "not found" page with a way back, so that I am not left on a broken page.

**Acceptance criteria**:
- **AC-1**: Visiting `/blog/[slug]/` for an existing, published post renders that post's title, date, tags (when present), and full rendered body, styled with the site's design tokens (Poppins, dark canvas, brand accent).
- **AC-2**: Visiting `/blog/[slug]/` for a slug with no matching published post (an unknown slug, or a draft post's slug in the production build) shows the site's not found page, not a broken route.
- **AC-3**: The site's not found page (`src/pages/404.astro`) shows a "Post not found" message with a link back to the home page, and is reachable for any bad URL on the site, not only bad blog slugs.
- **AC-4**: A post with no tags renders with no empty or broken tags row; the row only appears when the post has at least one tag.
- **AC-5**: A markdown code fence in a post body renders with syntax highlighting (Shiki, `github-dark` theme).
- **AC-6**: An `.mdx` post can embed an inline image via Astro's `<Image />` component (imported, colocated next to the post file) and it renders as optimized output (resized, hashed filename); plain `.md` posts stay text and code only, no inline images.
- **AC-7**: The article page shows an inline "back to blog" link (pointing at `/#blog`, the home page's blog section, since the dedicated listing page is not built yet) directly above the post title, in addition to the header's existing "Blog" nav item.
- **AC-8**: The article page's `<title>` and meta description reflect the specific post (its title plus the site's existing suffix style, and its excerpt), not the home page's generic metadata.

## Options considered

### Option 1: Hand rolled Astro page, hand rolled prose typography (recommended, chosen)

A new static route composes the existing `LayoutHeader`, `Section`, `Container`, and `Headline` components, plus a small set of net new pieces (a tag chip, a back link, hand written prose classes for the rendered body) built directly from `design.md`'s own tokens.

**Pros**:
- Full visual control, matching the "port, not redesign" mandate the rest of the design system follows; no fighting a plugin's own defaults.
- Zero new dependencies; reuses components and tokens already in the project.

**Cons**:
- More upfront CSS to write by hand for headings, links, quotes, lists, and code than a ready made plugin would give for free.

### Option 2: `@tailwindcss/typography` plugin for the prose body

Adds the official Tailwind prose plugin and lets it style the rendered markdown automatically.

**Pros**:
- Fast to wire up; covers most markdown elements out of the box.

**Cons**:
- Its default look is light theme first; matching this site's near black canvas and single accent color needs real override work anyway, undoing much of the time saved.
- A new dependency with no other consumer anywhere in this port.

### Option 3: Require every post to be `.mdx`, drop plain `.md` support

Simplifies image handling by making every post capable of an inline `<Image />`, removing the two tier `.md` versus `.mdx` split.

**Pros**:
- One content format, one set of rules for what a post can contain.

**Cons**:
- Unnecessary churn: the existing sample post (`hello-world.mdx`) is already MDX, but nothing requires it, and forcing MDX on text only posts adds no value for them.
- Takes away simple markdown as a lower friction option for posts that never need an image.

## Decision

**Chosen option**: Option 1: Hand rolled Astro page, hand rolled prose typography.

Build `src/pages/blog/[slug].astro` as a static route over `getPublishedPosts()`, styled by hand from `design.md`'s tokens, plus `src/pages/404.astro` as the site's not found page.

**Implementation skills**: `astro` (`astrolicious/agent-skills`, `.agents/skills/astro/`) · `tailwind-4-docs` (`lombiq/tailwind-agent-skills`, `.agents/skills/tailwind-4-docs/`)

## Rationale

Option 1 wins because this project's whole design system is built the same way: exact tokens, hand fitted to the legacy site's look, with libraries added only when they earn their keep (see `design.md`'s "kept vs. dropped" list, which already dropped MUI for the same reason: a generic tool that would need most of its defaults overridden anyway). `@tailwindcss/typography`'s light first defaults would need the same dark theme rework the project has already done once for its own components, for a one page consumer, so it does not pay for itself here. Option 3 was rejected because nothing about this feature requires every post to support images; keeping `.md` available for text only posts costs nothing and matches the flexibility spec 0002 already established.

The tag chip, back link, and 404 page decisions all follow the same reasoning: reuse an existing component only where its shape actually fits (a plain string tag has no icon and no URL, so a new small chip is cheaper and clearer than bending `Tags` or `Pill` to fit), and build the smallest new piece the requirement actually needs.

One deliberate deviation from `design.md`'s stated convention that every ported component reuses the `Reveal` scroll animation: this page skips `Reveal` entirely, on the reasoning that animating a full article's paragraphs in on scroll is disorienting for a reading page, not a showcase page. This is called out explicitly in Consequences below as an intentional exception, not an oversight.

## Feature design

**Data model sketch**:
No new entities. Reuses the `blog` content collection and `blogSchema` exactly as spec 0002 defined them: `id` (slug, from filename), `title`, `date`, `excerpt`, `tags` (default `[]`), `draft` (default `false`), plus the rendered body. `getPublishedPosts()` remains the one approved read path (excludes `draft: true` in production).

**State transitions**: none: a post's published or draft state is decided once at build time by `getPublishedPosts()` (spec 0002); this feature does not add a new state machine.

**API surface**:
| Endpoint | Method | Key inputs | Key outputs | Auth | Key errors |
|---|---|---|---|---|---|
| `/blog/[slug]/` | GET (static) | `slug`, from `getStaticPaths` over `getPublishedPosts()`, one path per published post id | rendered title, date, tags, full body | none (public) | unknown slug: no static path generated, falls through to the site's not found page |
| `/404` (`src/pages/404.astro`) | GET (static) | none | "Post not found" message, link to home | none (public) | n/a, this is itself the fallback |

**Value sourcing**:
| Action | Value produced / displayed | Source |
|---|---|---|
| Render `/blog/[slug]/` | Post title | `entry.data.title` (blog collection frontmatter, spec 0002) |
| Render `/blog/[slug]/` | Post date | `entry.data.date` |
| Render `/blog/[slug]/` | Post tags (chip row) | `entry.data.tags`, defaults to `[]`; row hidden when empty |
| Render `/blog/[slug]/` | Post body | `render(entry)`'s `Content`, from the post file's markdown or MDX body |
| Render `/blog/[slug]/` | URL slug | `entry.id`, the filename derived id from the glob loader (spec 0002), no separate slug field |
| Render `/blog/[slug]/` | Which slugs exist versus 404 | `getPublishedPosts()` (spec 0002; excludes `draft: true` in the production build) |
| Render `/blog/[slug]/` | `<title>` and meta description | `entry.data.title` plus the fixed site suffix already used on the home page ("— Ian Tumulak"); `entry.data.excerpt` for the description |
| Render an `.mdx` post's inline image | Image `src`, width, height, optimized output | The image file imported directly in the MDX body, colocated next to the post in `src/content/blog/`, passed to Astro's `<Image />` |

**Key invariants**:
- Every slug that renders a page corresponds 1:1 to a `getPublishedPosts()` entry id; no other slug produces a page.
- The tags chip row renders only when `tags.length > 0`.
- Every code fence in every post body renders through the same project wide Shiki `github-dark` configuration; no per post override.

**Security model**: Fully public, no authentication or authorization; the content is the site's own public blog, already public today via the home page preview.

**Configuration required**: none. The syntax highlighting theme is a markdown configuration entry in `astro.config.mjs`, not an environment variable or credential.

**Critical test scenarios**:
- Happy path: the existing `hello-world` post renders at `/blog/hello-world/` with its title, date, tag, and body, verifies **AC-1**
- Failure case: visiting `/blog/does-not-exist/` (or a draft post's slug, in a production build) shows the site's not found page instead of a broken route, verifies **AC-2**
- Edge case: a post with an empty `tags` array renders with no tags row at all, verifies **AC-4**

## Build plan

Ordered per the project's Tracer Bullet approach: stand up one real post rendering fully end to end first, then layer each remaining concern on top.

1. [x] Build `src/pages/blog/[slug].astro`: `getStaticPaths` over `getPublishedPosts()`, `render(entry)` for the body, composed from `LayoutHeader`, a back link, `Headline` for the title, a small meta row for the date, and hand written prose classes for the body, satisfies **AC-1**, **AC-7**, **AC-8**
2. [x] Build `src/pages/404.astro`: reuses `Layout`/`Section`/`Headline` for a "Post not found" message and a link to home, Astro's own static site wide not found convention, satisfies **AC-2**, **AC-3**
3. [x] Add the tag chip: a small net new, non interactive chip (brand dark background, no icon, no link), rendered only when the post has at least one tag, satisfies **AC-4**
4. [x] Configure Shiki syntax highlighting: set the `github-dark` theme in `astro.config.mjs`'s markdown configuration, confirm a fenced code block in a post renders highlighted, satisfies **AC-5**
5. [x] Prove the MDX image convention end to end: add one real inline image to an MDX post (the existing `hello-world.mdx` or a new sample post), imported and passed to `<Image />`, confirm optimized output in the build, satisfies **AC-6**

## Consequences

**Positive**:
- Unblocks the blog section links on the home page (feature 7), which already point at `/blog/[slug]/` with nothing there to receive them.
- Establishes the site's first not found page, and the first per page (non home) `<title>`/meta description pattern.
- Settles a tag display, a code highlighting theme, and an image convention that later posts and the blog listing page (feature 8) can reuse.

**Negative / tradeoffs**:
- Hand rolled prose typography is more upfront CSS than a plugin, and grows as markdown feature usage grows (tables, footnotes, and so on are not styled by this build unless a post actually uses them).
- Image support is MDX only; a plain `.md` post cannot embed an image without first being converted to `.mdx`.
- This page deliberately skips the `Reveal` scroll animation that every other ported component reuses, an intentional, stated exception to that convention, not an oversight.

**Neutral**:
- First content driven static route in the project; until now only the single home page existed as a route.

## Follow-up

- [ ] Blog listing page (feature 8) will likely want the same tag chip and date formatting; once it needs the same markup, consider extracting a small shared partial rather than duplicating it for a second consumer.
- [ ] SEO pass (feature 11) still owns Open Graph tags, canonical URLs, and article structured data (JSON-LD) for this page; this spec only sets a basic `<title>` and meta description.
- [ ] The `Reveal`-skipping decision on this page is a stated exception to `design.md`'s "every component reuses Reveal" convention; record the exception in `design.md` via `/sync` once this page is built.
