# Verify: home page port · updated 2026-07-26

_Steps derived from the scope's "Done when" criteria (feature 6 has no governing spec). Reference for content parity is the live production site (iantumulak-website.vercel.app), not the local legacy clone — that clone had uncommitted draft edits that diverge from what's actually deployed._

## UI / manual

- [ ] Visit `/` at desktop width (1440px) → hero (avatar + "Hi, I'm Ian." + "I build awesome things."), About me (3 bio paragraphs + Tech Stack tag groups), Passion Projects (4 cards with images/links/stacks), Experience (7 timeline entries newest first), Contact (blurb + mailto link) all render with the same content as the legacy site → Done-when: "every section... renders with the same content"
- [ ] At desktop width, hero avatar sits beside the "Hi, I'm Ian." heading (top-right, absolutely positioned), not stacked above it; at mobile width it's centered above the heading
- [ ] Experience timeline is a single left-aligned column (not an alternating two-column zigzag); each entry's company name renders in brand green, role in plain white
- [ ] Menu's "Resume" item (desktop bar and mobile drawer) renders as a bordered brand-green pill, distinct from the plain text links
- [ ] Contact heading is a large centered "Contact." (not the left-aligned accent-bar `Headline` style used by the other sections)
- [ ] Resize to tablet (768px) and mobile (390px) width → sections reflow to single column, text remains readable, no horizontal overflow or clipped content → Done-when: "fully responsive across mobile, tablet, and desktop"
- [ ] At mobile width, click the hamburger toggle → drawer opens covering the full viewport height (not clipped to the header bar), `aria-expanded` flips to `true`, focus moves to the first link → Done-when: "matches existing functionality (menu navigation)"
- [ ] With the drawer open, press `Tab`/`Shift+Tab` repeatedly → focus cycles only among the drawer's links, never escaping to page content behind it (focus trap)
- [ ] Press `Escape` with the drawer open → drawer closes, focus returns to the hamburger toggle
- [ ] Click a menu link (e.g. "Experience") → page scrolls to the matching `#experience` anchor section
- [ ] Click "Resume" in the menu → `resume.pdf` opens in a new tab
- [ ] Scroll the page slowly from top to bottom → each `Reveal`-wrapped element (headlines, paragraphs, cards, tags) fades/slides in once as it enters the viewport → Done-when: "matches existing functionality (reveal animations)"
- [ ] Enable OS-level "reduce motion" → re-run the scroll check → reveals and the mobile drawer's slide animation are replaced by simple opacity fades (Framer Motion's `useReducedMotion()`), no jarring motion
- [ ] Click each project card's external link icons (github/website/video) → open the correct external URL in a new tab
- [ ] Click an experience entry's "Associated Work" pill → opens the correct external URL in a new tab
- [ ] Click the Contact section's email link → triggers a `mailto:ianctumulak@gmail.com` compose action

## Commands

- [ ] `pnpm check` → 0 errors
- [ ] `pnpm build` → completes, `dist/index.html` generated, project/avatar images optimized to `.webp`

## Coverage

- "every section renders with the same content" → covered by the first UI step (content parity against the legacy site's copy, images, project list, and experience history)
- "fully responsive across mobile, tablet, and desktop" → covered by the resize step
- "matches existing functionality (menu navigation)" → covered by the drawer open/close, focus-trap, `Escape`, and anchor-link steps
- "matches existing functionality (reveal animations)" → covered by the scroll and reduced-motion steps
- Note: the legacy site's "modal" functionality named in the feature description doesn't apply — the ported design system dropped the legacy `Modal` component as orphaned (see spec 0003 Rationale); nothing in the current page uses one.
