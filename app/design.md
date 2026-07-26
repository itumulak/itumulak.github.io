---
name: iantumulak-personal-site-design-system
source: extracted-from-code # ported from the legacy React SPA (~/Projects/personal/iantumulak-website), see spec 0003
character: 'A dark, developer-portfolio aesthetic: near-black canvas (#282c34), a single high-contrast mint/spring-green accent (#0aff9d) used sparingly for emphasis, and Poppins across every weight from extralight body copy to black display headlines. Confident and technical, not playful; the accent reads as a terminal-cursor or status-light color, not decoration.'
tokens: 'real values live in app/src/styles/global.css (@theme block); read them there, never duplicated here'
contrast: 'verified against the @theme tokens: body text #ebecf3 on bg #282c34 = 11.9:1; brand #0aff9d on bg = 10.5:1; text on brand-dark pill background = 5.6:1 (brand-dark tuned from the legacy #15895a to #0f6b45 during this port specifically to clear AA 4.5:1 for small pill text — see Follow-up)'
---

## Build mandate

This is a port, not a redesign: every component matches the shipped legacy site's visual language exactly (same brand color, background, text color, font, breakpoints). What changes is _how_ it's built — Tailwind replaces the legacy mix of MUI, styled-components, and hand-rolled breakpoint math; every component ships as static Astro markup by default, with only the fragment that actually animates or handles input hydrated as a small React island; and real accessibility gaps the legacy site never fixed (keyboard/focus handling on the menu, a screen-reader-reachable alternative to hover-only tag tooltips) are fixed as part of the port, not deferred. See spec [0003](../docs/specs/0003-design-system-ui-foundation/index.md) for the full decision record.

## Character & direction

Single-page developer portfolio energy: a dark canvas that gets out of the way, one accent color doing all the emphasis work (headline underline bars, active/hover states, pill backgrounds, icon accents), and Poppins carrying both the extralight body copy and the black display headlines so the type scale itself creates hierarchy without needing a second typeface. Motion is a supporting cast member — a shared scroll-reveal primitive (fade + slide up, `Reveal`) is reused by 8 of the 13 ported components rather than each one inventing its own entrance animation.

## Composition patterns

Single scrolling page, sections addressed by anchor id (`#about`, `#projects`, `#experience`, `#contact`) and navigated via a sticky header (`LayoutHeader`) combining social links and the primary menu. Each page section follows the same shape: a `Section` (id + spacing) wrapping a `Container` (vertical stack) that opens with a `Headline` (accent bar + large text), then its content (a paragraph block, a card grid, or a `Timeline`). Cards (`Card`) compose a fixed shape: image, title + external link icons, then a `Reveal`-wrapped summary and stack-icon row. There is no separate settings/detail/list page family yet — this foundation covers the single-page shape; future features (blog listing, article page) will extend these composition patterns, not replace them.

## Component & usage rules (do's and don'ts)

**Ported component set** (13 components, `app/src/components/`; the legacy `Modal` is dropped as orphaned, see spec 0003 Rationale):

| Component                              | Kind                                                  | Animated fragment                                                                                            |
| -------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `Reveal`                               | full island (`client:visible={{rootMargin:"200px"}}`) | The primitive itself — every other reveal-using component composes this, never its own copy                  |
| `Menu`                                 | full island (`client:visible`)                        | Fully stateful nav: desktop links + mobile drawer with focus trap, `Escape`, `aria-expanded`/`aria-controls` |
| `Socials`                              | full island (`client:visible`)                        | Icon row: mount stagger + hover scale                                                                        |
| `Timeline`                             | full island (`client:visible`)                        | Wraps `react-vertical-timeline-component` (a stateful third-party tree, not splittable)                      |
| `Avatar`                               | static shell + nested `Reveal`                        | Plain `<Image>`, no MUI                                                                                      |
| `Card`                                 | static shell + nested `Reveal`                        | Only the summary/stack-icon block reveals; link-icon hover is plain CSS                                      |
| `Headline`, `SubHeadline`, `Pill`      | static shell + nested `Reveal`                        | Whole component is small; one `Reveal` wraps it                                                              |
| `Tags`                                 | static shell + nested `Reveal`                        | One `Reveal` wraps the whole tag list, not per-tag                                                           |
| `Container`, `Section`, `LayoutHeader` | static, no island                                     | Pure layout; `LayoutHeader` composes `Menu` + `Socials` as children                                          |

**Do**: give every component a typed `Props`/`interface`, reuse `Reveal` for any scroll-entrance animation (never a second copy), keep icon-only links/buttons paired with an `aria-label`.
**Don't**: pass a React component reference (an icon component, a render function) as a prop into an island (`Menu`/`Socials`/`Timeline`/`Reveal`) — Astro can't serialize a function across the server→client hydration boundary, so it silently arrives as `null` client-side. Islands that take an icon per data item resolve one by name through `app/src/components/icons.ts` instead. Static (non-island) components are unaffected and may import `react-icons` directly.
**Don't**: build dynamic Tailwind class strings from a prop value (e.g. a template literal like `` `gap-${gap}` ``) — Tailwind's scanner reads source files as plain text and won't detect the generated class name, so the utility silently never ships. Use inline `style` for a numeric/arbitrary value, or a static lookup object mapping known values to literal class strings (see `Headline`'s `weightClass` map).
**Don't** nest one `Reveal` inside another — at most one wraps a given subtree; a component needing staggered children sequences them with `delay` on siblings instead.

## Type & spacing

Font: Poppins, self-hosted via `@fontsource/poppins` (weights 200–900 imported in `global.css`; the spec named `@fontsource-variable/poppins`, which doesn't exist — Poppins isn't published as a variable font — corrected to the static per-weight package during the build, same self-hosting intent). Breakpoints and spacing use Tailwind v4's defaults with no custom scale (`sm` 640 / `md` 768 / `lg` 1024 / `xl` 1280 / `2xl` 1536px) — this matches what the legacy site already used everywhere, including retiring `Headline`'s hand-rolled duplicate of the same breakpoint values.

## Libraries kept vs. dropped

**Kept**: Tailwind CSS v4 (`@theme` tokens, all component styling), Framer Motion (scoped to `Reveal`, `Menu`, `Socials`, `Timeline` — the components with genuinely orchestrated animation; simple hover/focus micro-interactions use plain Tailwind `hover:`/`transition` utilities instead), `react-vertical-timeline-component` (already installed, itself a React tree, not worth splitting), `react-icons` (uniform icon source).

**Dropped**: MUI (`@mui/material`, `@mui/icons-material`) and `@emotion/*` — the only ported component that used MUI was `Avatar` (a circular image crop), and giving it its own React island just to carry one `sx` prop's worth of styling wasn't worth the extra JavaScript; plain Tailwind classes on an `<Image>` cover the same sizing/border treatment with zero islands. MUI now has no consumer anywhere in this component set (still an installed dependency — see Follow-up). `styled-components` — already absent from this project's `package.json`; this port makes that call explicit and permanent, no component reintroduces a CSS-in-JS layer.

## Responsive & accessibility direction

WCAG AA baseline (per root `AGENTS.md`), fixed as part of this port rather than inherited as a gap:

- **Menu**: hamburger toggle has `aria-expanded` + `aria-controls`; the open mobile panel is `role="dialog"`, traps focus (`Tab`/`Shift+Tab` cycle among its focusable children), moves focus to its first link on open, restores focus to the toggle on close, closes on `Escape`, and locks `body` scroll (`overflow: hidden`) while open.
- **Tags**: no hover-only native `title` tooltip; each tag icon pairs a visible icon with a `<span class="sr-only">` accessible name. The same pattern is applied to `Card`'s per-project stack-icon row and its external link icons (`aria-label`), which have the identical icon-only-content problem even though the spec's accessibility section only named `Tags`/`Menu` explicitly.
- All icon-only interactive elements (`Socials` links, `Card` link icons) carry `aria-label`.
- Every animated island honors `prefers-reduced-motion` via Framer Motion's `useReducedMotion()`, called per-island (Astro islands hydrate independently; there's no single shared React tree to wrap in one `MotionConfig`).

## Follow-up

- MUI and `@emotion/*` have zero consumers in this component set now. Still installed (spec 0001 chose MUI as a project dependency; spec 0003 narrows it to zero usage). Whether it stays installed is an open question spec 0003 defers, not resolved by this build.
- `app/src/components/` is a shared UI folder used across every future page/feature, not owned by one — this narrows root `AGENTS.md`'s "folder by feature" rule for shared UI specifically. `AGENTS.md` should record this carve-out explicitly (`/sync`'s job).
- `brand-dark` (`#0f6b45`) is a value this build introduced (not in spec 0003's literal token list) specifically to clear AA contrast for pill text; if a future design pass revisits the accent palette, re-verify this pairing.
