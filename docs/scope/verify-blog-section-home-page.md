# Verify: blog section on home page · updated 2026-07-26

_Steps derived from the scope's "Done when" criteria (feature 7 has no governing spec; the input coverage gap was judged a local implementation detail, not an owed decision: `RECENT_POSTS_COUNT` defaulted to 3). Confirmed live against `docker compose up` (`iantumulak.localhost`, real Traefik proxy path)._

## UI / manual

- [x] Visit `/` → a "Blog" nav item appears in the header (desktop bar and mobile drawer) and jumps to a `#blog` section between Experience and Contact → Done-when support (nav parity with the site's other sections). Confirmed both desktop (1568px) and mobile (390px) drawer screenshots.
- [x] With 1+ published posts in `app/src/content/blog/`, the `#blog` section lists up to 3 posts, newest first, each showing title, formatted date, and excerpt → Done-when: "the home page shows the N most recent posts (title, date, excerpt)". Confirmed live: "Hello, world" / "January 1, 2026" / excerpt text rendered.
- [x] Click a listed post's title → navigates to `/blog/<slug>/` (404s until feature 9 ships the article route; the link itself is correct). Confirmed `href="/blog/hello-world/"`, navigated there, got Astro's clean 404 page (expected, route not built yet).
- [x] Remove/rename every file in `app/src/content/blog/` (clear `node_modules/.astro/data-store.json` first, the content layer caches entries across builds even when the source glob matches zero files) → rebuild → the section renders "No posts yet, check back soon." instead of an empty list → Done-when: "renders an empty state gracefully if there are no posts yet". Confirmed live: renamed the sample post file, curled the running dev server, got "No posts yet, check back soon."; restored the file, confirmed the post came back.
- [x] Scroll to the `#blog` section → each post entry fades/slides in via the shared `Reveal` primitive, consistent with the rest of the page. Confirmed by screenshot (opacity/translateY inline styles present pre-reveal, content visible post-reveal).
- [x] No console errors on page load. Confirmed via `read_console_messages` (onlyErrors), none found.

## Commands

- [x] `pnpm check` → 0 errors
- [x] `pnpm build` → completes, `dist/index.html` contains the `#blog` section and the sample post's title

## Coverage

- Done-when "N most recent posts (title, date, excerpt) linking to their article pages" → covered by the listing and click-through steps above.
- Done-when "renders an empty state gracefully if there are no posts yet" → covered by the empty-content-dir step above.
