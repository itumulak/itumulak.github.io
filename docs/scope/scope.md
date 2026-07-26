# Scope: iantumulak personal site (Astro port)

A personal portfolio and blog site, ported from an existing React SPA (`~/Projects/personal/iantumulak-website`) into Astro, for the site owner and its visitors and blog readers.

**Build approach:** Tracer Bullet (prove the whole pipe, local dev through build through deploy, connects end to end before any single page is built out in full).
**Workflow:** Lean (the tail after develop: `/check verify` on the real app; no separate test suite or fresh model review by default). Architect still gates any feature that needs a decision at every tier; two foundations below are tagged `Medium` (adds `/test`) since they are the costliest to redo.

## At a glance

| # | Feature | Phase | Status |
|---|---------|-------|--------|
| 1 | Stack & architecture | Foundation | in-progress |
| 2 | Coding standards & tooling | Foundation | done |
| 3 | Blog content model | Foundation | done |
| 4 | Design system & UI foundation | Foundation | done |
| 5 | Local dev to deploy walking skeleton | Skeleton | in-progress |
| 6 | Home page port | Slice 2 | in-progress |
| 7 | Blog section on home page | Slice 3 | planned |
| 8 | Blog listing page | Slice 3 | planned |
| 9 | Single article page | Slice 4 | planned |
| 10 | Disqus comments | Slice 5 | planned |
| 11 | SEO optimization pass | Slice 6 | planned |
| 12 | Cookie consent banner | Slice 7 | planned |

## Foundations

### 1. Stack & architecture · Medium
Astro project setup in `app/`, the Docker dev environment (Dockerfile, docker compose copied from `~/Projects/personal/personal-web-astro` and its Traefik proxy network, served at `iantumulak.localhost`), and the GitHub Pages deploy path (base path, GitHub Actions build and publish).
**Done when:** the stack and dev/deploy setup are recorded in a spec, `docker compose up` serves the app at `iantumulak.localhost` through the existing proxy, and the empty scaffold builds.
- [x] Decide the stack (spec): [0001](../specs/0001-stack-and-architecture/index.md)
- [x] Scaffold from the decision: `/develop stack & architecture`
  Code: `app/`, `docker-compose.yml`, `.github/workflows/deploy.yml`
- [x] Verify it: `/check verify`, `pnpm build` confirmed clean, `docker compose up` confirmed serving at `iantumulak.localhost` through Traefik (HTTP 200). Caught and fixed a real regression: the tooling task's `prepare` script crash looped the container (see commit `a877d6e`). Medium tier: `/test` still required before `done`

### 2. Coding standards & tooling
Capture conventions, then install lint, format, and any pre commit checks from the real scaffolded project.
**Done when:** root `AGENTS.md` reflects the real stack, and lint and format run clean.
- [x] Capture conventions and tooling choices: `/audit`
- [x] Install lint, format, pre commit, CI: `/develop tooling`
  Code: `app/eslint.config.js`, `app/.prettierrc.json`, `app/.lintstagedrc.json`, `.githooks/pre-commit`, `.github/workflows/ci.yml`
- [x] Verify it: `/check verify`, lint/format/typecheck/test confirmed clean, pre commit hook confirmed firing on a real commit, `ci.yml` confirmed green on a real GitHub Actions run (PR #1)

### 3. Blog content model
Markdown/MDX content shape for blog posts (Astro content collections): frontmatter fields (title, date, excerpt, tags; slug comes from the filename), and the pagination and routing pattern the listing and article pages both depend on. Sanity is retired, nothing migrated.
**Done when:** a sample markdown post validates against the schema and produces the fields later pages need, with no database involved.
- [x] Design it (spec): [0002](../specs/0002-blog-content-model.md)
- [x] Build it: `/develop blog content model`
  - [x] MDX integration and the `blog` collection schema (glob loader, Zod), satisfies AC-1, AC-2, AC-6
  - [x] `getPublishedPosts()` helper: draft filtering, sort with stable tiebreak, satisfies AC-3, AC-4, AC-5
  - [x] Sample validating post plus a Vitest test for a rejected post, satisfies AC-1, AC-2
  - [x] Record `PAGE_SIZE` and the three route patterns for later features to build against, satisfies AC-6
  Code: `app/src/content.config.ts`, `app/src/features/blog/`, `app/src/content/blog/`
- [x] Verify it: `/check verify`, all six acceptance criteria confirmed against the real build and a running dev server (schema validation, draft filtering dev vs prod, sort with stable tiebreak, empty collection, filename uniqueness); see spec 0002 for the checklist
- [x] Test it: `/test`, `getPublishedPosts()` covered via a mocked `astro:content` (draft filter, sort tiebreak, empty collection); `blogSchema` already covered

### 4. Design system & UI foundation · Medium
How the existing site's visual language and components (Menu, Avatar, Headline, Timeline, Card, Socials, Pill, Modal, Reveal, Tags) port into Astro: which of Tailwind, MUI, styled components, and Framer Motion carry over versus get replaced by lighter equivalents, base layout, and responsive breakpoints. This decision also carries the performance and accessibility goals (partial hydration, minimal shipped JS).
**Done when:** `design.md` covers the ported component set, type and spacing, and states which original libraries are kept versus dropped and why.
- [x] Design it (spec): [0003](../specs/0003-design-system-ui-foundation/index.md)
- [x] Build it: `/develop design system & UI foundation`
  - [x] Tokens, layer order, self-hosted Poppins, base layout (`global.css`, `Layout.astro`)
  - [x] 13 ported components + shared icon registry (`app/src/components/`)
  - [x] `design.md`: character, component set, type/spacing, kept vs. dropped libraries
  Code: `app/src/components/`, `app/src/layouts/Layout.astro`, `app/src/styles/global.css`, `app/design.md`
- [x] Verify it: `/check verify`, production build fixed (missing `sharp` dependency), accessibility (Menu `aria-expanded`/`Escape`/scroll-lock, Tags/Card sr-only names), icon-prop serialization, and Pill contrast confirmed live; focus-trap/focus-restore blocked in the automated browser tab (couldn't receive DOM focus at all), locked in via `/test` instead
- [x] Test it: `/test`, 30 tests across 5 files (`icons`, `Reveal`, `Menu`, `Socials`, `Timeline`), including the focus-trap and focus-restore behavior `/check verify` couldn't exercise

## Skeleton

### 5. Local dev to deploy walking skeleton
The thinnest real thread through every layer: Astro scaffold renders one placeholder page, `docker compose up` serves it locally at `iantumulak.localhost`, and a GitHub Actions workflow builds and publishes it live on GitHub Pages. Proves the pipe connects before any real page is built.
**Done when:** a change pushed to the branch is visible on the live GitHub Pages URL, and local dev via the Docker proxy reflects edits live.
- [ ] Build it: `/develop local dev to deploy walking skeleton`
  Local dev leg proven: `docker compose up`, `iantumulak.localhost` returns 200 through Traefik. Deploy leg blocked: repo (`itumulak/itumulak.github.io`) is private, GitHub Pages needs a public repo or a paid plan; engineer chose to skip this leg for now. Resume by making the repo public (or confirming a paid plan), then push to `main` and confirm the live URL serves the page.

## Slice 2: Home page port

### 6. Home page port
Full port of the existing single page site (menu, hero/avatar, headline, experience timeline, project cards, socials) into Astro using the design system, matching current content and functionality.
**Done when:** every section from the existing site renders with the same content, is fully responsive across mobile, tablet, and desktop, and matches existing functionality (menu navigation, modal, reveal animations).
- [x] Build it: `/develop home page port`
  Code: `app/src/pages/index.astro`, `app/src/features/home/data.ts`, `app/src/assets/{me.jpg,ecommerce.png,mern-stack.jpg,firebase-auth.png,docker.png}`, `app/public/resume.pdf`. First pass was checked only against a local, partly stale clone of the legacy repo (uncommitted draft edits + an under-read component); re-verified against the live production site (iantumulak-website.vercel.app) and corrected several real mismatches: `app/src/components/Menu.tsx` (mobile drawer clipped to header height by a `backdrop-filter` containing block; missing `emphasized` pill style for the Resume link), `app/src/components/Timeline.tsx` (wrong layout — default two-column instead of legacy's single left column; company/role text colors swapped; third-party `animate` scroll-reveal left content stuck at `visibility:hidden`, duplicating the project's own `Reveal` primitive), `index.astro` (hero avatar wasn't positioned beside the heading like legacy's desktop layout; About bio paragraphs and one Experience description used draft text instead of the live copy; Contact heading wrongly forced through the shared `Headline` component instead of its own bespoke centered style), `global.css` (added `scroll-behavior: smooth` matching legacy's smooth anchor-scroll, honoring `prefers-reduced-motion`)

## Slice 3: Blog listing

### 7. Blog section on home page
A recent articles preview list on the home page, pulled from the markdown content collection.
**Done when:** the home page shows the N most recent posts (title, date, excerpt) linking to their article pages, and renders an empty state gracefully if there are no posts yet.
- [ ] Build it: `/develop blog section on home page`

### 8. Blog listing page
A dedicated page listing all articles with pagination.
**Done when:** all posts are listed newest first, paginated per the content model's routing pattern, and each page of results is directly linkable.
- [ ] Build it: `/develop blog listing page`

## Slice 4: Single article page

### 9. Single article page
A page that renders the full content of one selected markdown article.
**Done when:** a post's slug route renders its full markdown content with the design system's typography, and a bad or missing slug renders a not found state.
- [ ] Build it: `/develop single article page`

## Slice 5: Disqus comments

### 10. Disqus comments
Disqus comment thread embedded on the article page, gated behind cookie consent.
**Done when:** a comment thread loads on each article page, scoped to that article's identity, and does not load until cookie consent is accepted.
- [ ] Build it: `/develop disqus comments`

## Slice 6: SEO

### 11. SEO optimization pass
Meta tags, sitemap, robots.txt, Open Graph and social card tags, and structured data for articles, across the pages built so far.
**Done when:** every page has correct title and meta description, a sitemap and robots.txt are published, article pages carry Open Graph tags and article structured data, and links preview correctly when shared.
- [ ] Build it: `/develop seo optimization pass`

## Slice 7: Cookie consent

### 12. Cookie consent banner
A consent banner gating Disqus (and any future analytics) until the visitor accepts, with the choice persisted.
**Done when:** a first time visitor sees the banner, declining keeps Disqus from loading, accepting persists the choice and does not re-prompt.
- [ ] Build it: `/develop cookie consent banner`

## Deferred
Out of scope for the current build pass, kept so the plan stays honest.
- **Analytics or error monitoring**: page view analytics or production error tracking · needs a decision
- **React to Preact swap**: replace React with Preact (via `preact/compat`) for the interactive islands, once the site is built and verified on React · needs a decision · from spec [0001](../specs/0001-stack-and-architecture/index.md)

## Legend

**The decision box.** Every feature carries exactly one, the sub-task whose label ends with `(spec)`. Its wording varies, so skills locate it by that `(spec)` suffix, never by an exact label. Every other box is an execution box and `/architect` never ticks one.

**Feature lifecycle**: the scope updates as a feature moves; each row is what it shows and who sets it:

| State | Set by | The feature shows |
|---|---|---|
| `planned` · needs a decision | `/scope` | one box: `Design it (spec): /architect <feature>` |
| `in-progress` (designed) | `/architect` at spec capture | `Design it` ticked; spec linked; `Build it: /develop <feature>` plus 2 to 5 milestones rolled up from the spec; `Verify it` box; any surfaced follow up enrolled |
| `in-progress` (building) | `/develop` | milestone sub boxes tick one by one; code pointer filled |
| `in-progress` (verified) | `/check verify` | `Build it` plus milestones ticked; `Verify it` ticked |
| `done` | the tier's last required stage (`Lean` here, so `/check verify`), then `/sync` | the tier's required boxes ticked; `/sync` captures the slice's conventions into `AGENTS.md` |

- **Next step** = the first unticked box (always a command or a tracked milestone).
- **needs a decision** = run `/architect` first; otherwise straight to `/develop` (or `/audit` for standards and tooling). The tag drops once the spec is captured.
- **Atomic build tasks live in the spec's `## Build plan`, not here**: the scope carries only the milestone rollup.
- **Status** `planned` then `in-progress` then `done`, plus `existing` (pre workflow) and `dropped` (de scoped, kept for history).
- **Workflow tier tag** beside a heading (here, `· Medium` on two foundations) overrides the project default `Lean` tier for that one feature; no tag means inherit.
- **Workflow** (header line) is the project default tier: `Lean` runs `/check verify` after `/develop`, and that is what closes a feature to `done`. A feature's own tier tag overrides this default.
