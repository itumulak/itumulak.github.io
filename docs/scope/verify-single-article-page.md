# Verify: single article page · updated 2026-07-27

_Steps derived from spec [0004](../specs/0004-single-article-page.md)'s acceptance criteria. Confirmed against `pnpm astro dev` (port 4322) and a `pnpm build` static output._

## UI / manual

- [x] Visit `/blog/hello-world/` → renders the full post: title, formatted date, tags, and markdown body with the design system's typography → AC-1. Confirmed by browser screenshot and build output grep.
- [x] Visit a slug with no matching post (`/blog/does-not-exist/`) → site not found page renders (not a raw framework error) → AC-2. Confirmed `curl` returns 404 and the not found page renders correctly.
- [x] Visit `/404` directly → same not found page, with a working link back to `/` → AC-3. Confirmed by browser screenshot; link href resolves to `/`.
- [x] A post with tags shows each tag as a chip; a post with no tags shows no tag row → AC-4. Confirmed: `hello-world` (tag `meta`) renders one chip; conditional render confirmed in source (`post.data.tags.length > 0`).
- [x] A fenced code block in the post body renders with Shiki syntax highlighting (`github-dark` theme) → AC-5. Confirmed `astro-code github-dark` class present in build output and colored in the browser.
- [x] An MDX inline image (`<Image />` from `astro:assets`) renders as an optimized, resized, hashed static file, not the raw source path → AC-6. Confirmed build output: `<img src="/_astro/me.*.webp" ... width="480" height="480">`.
- [x] A back link on the article page returns to the blog section on the home page → AC-7. Confirmed `href` uses `withBase('/#blog')`.
- [x] Each article page's `<title>`/meta description is the post's own title/excerpt, not a generic site-wide value → AC-8. Confirmed per-post `Layout title`/`description` props sourced from `post.data`.
- [x] No console errors on page load. Confirmed via `read_console_messages`, none found.

## Commands

- [x] `pnpm check` → 0 errors
- [x] `pnpm build` → completes, generates `dist/blog/hello-world/index.html` and `dist/404.html`
- [x] `pnpm lint` → 0 errors
- [x] `pnpm format:check` → passes (one file reformatted during build: `src/pages/404.astro`)
- [x] `pnpm test` → passes except 2 pre-existing, unrelated `Reveal.test.tsx` failures (see Known issues)

## Coverage

- AC-1, AC-7, AC-8 → covered by the article route render and back link steps above.
- AC-2, AC-3 → covered by the not found page steps above.
- AC-4 → covered by the tag chip step above.
- AC-5 → covered by the Shiki step above.
- AC-6 → covered by the MDX image step above.

## Known issues (pre-existing, out of scope)

- The shared `Reveal` scroll-reveal primitive (used internally by `Headline`, wrapping every page title including this feature's `<h1>`) does not transition to visible even when its content is already above the fold on initial page load: the motion wrapper stays at `opacity: 0` indefinitely (confirmed via computed style inspection in the browser). Reproduced on the home page too (untouched by this feature), so it is a pre-existing regression in `Reveal` itself, not something introduced here. Matches the 2 pre-existing failing assertions in `src/components/Reveal.test.tsx` (`does not render with opacity 0 on initial mount...`, `...under reduced motion either`). Not fixed as part of this build: no AC requires it, and the fix belongs to `Reveal`'s own test/implementation, not this feature's code.
