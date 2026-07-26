# Home page

The single-page portfolio home page (hero, about, projects, experience, contact). Content ported from the legacy React SPA (`~/Projects/personal/iantumulak-website`); see the scope's feature 6 entry for the full port history and the real mismatches it caught against the live production site.

## Files

- `data.ts`: the structured content lists (menu items, socials, five tech stack groups, four projects, seven experience entries), shaped to match the ported components' props (`MenuItem`, `SocialLink`, `ExperienceEntry`, `Card`'s stack/link shapes). Singleton page content (hero headline text, bio paragraphs, contact blurb) lives directly in `../../pages/index.astro` instead, since it's unique to the page rather than a reusable list.
- `../../pages/index.astro`: composes the page from `../../components/`, importing this feature's data plus the avatar image (`../../assets/me.jpg`).

## Conventions

- Content source of truth is the **live production site** (`iantumulak-website.vercel.app`), not the local legacy clone at `~/Projects/personal/iantumulak-website` — that clone can carry uncommitted draft edits that never shipped; compare against the deployed site when porting or updating copy.
- The hero avatar is positioned beside the heading on desktop via `lg:absolute` classes on a wrapper `div` in `index.astro`, not inside the shared `Avatar` component — `Avatar` itself stays a plain, reusable static shell; this page-specific placement is composition, not a component change.
- Experience entries map legacy `company` → `ExperienceEntry.position` and legacy `position` (job title) → `ExperienceEntry.title`; see `../../components/AGENTS.md` for why that pairing controls color/prominence in `Timeline`.

_Drafted by /sync from the introducing change, worth a quick human pass._
