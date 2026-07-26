## Context

The site is porting from an existing React single page app (`~/Projects/personal/iantumulak-website`) into Astro (decided in spec 0001). That spec fixed the site builder (Astro) and the interactive component framework (React islands), but explicitly deferred styling and the component set itself to this spec (see spec 0001, Proposed stack, the "Styling" row, and its Follow up item on the Tailwind/MUI cascade question).

The legacy site has 14 components (Menu, Avatar, Headline, Timeline, Card, Socials, Pill, Modal, Reveal, Tags, plus Container, Section, LayoutHeader, SubHeadline) built with a genuine mix of styling approaches: Tailwind utility classes (the majority), `styled-components` (Card, Headline, LayoutHeader, Socials, and two page level files), MUI's `sx` prop (Avatar, Modal), and inline styles (Reveal). The new project's `package.json` already dropped `styled-components`, but nothing has formally decided what replaces it, what the shared design tokens are, or how each component's animation and interactivity should map onto Astro's partial hydration model (some components ship zero JavaScript, some need to become hydrated "islands").

Two forces shape this decision. First, the project's stated performance goal (`AGENTS.md`): partial hydration and minimal shipped JavaScript, which the legacy site does not optimize for at all, every animated component ships its full React/Framer Motion runtime regardless of whether it is interactive. Second, the accessibility baseline (`AGENTS.md`): WCAG AA on ported UI. The legacy code has real, documented gaps here (the mobile menu has no `aria-expanded`, no focus trap, and no Escape handling; tag tooltips are hover only, not reachable by keyboard or touch), and porting them unchanged would carry the gaps into a project that specifically committed to fixing them.

Not deciding this now means every later page feature (home page port, blog listing, article page) would invent its own answer to "is this component an island or static, and does it use Tailwind or MUI or both", producing exactly the inconsistency this spec exists to prevent.

## Options considered

### Option 1: Tailwind primary hybrid, surgical islands, reused animation primitive, accessibility fixed now (chosen)

Tailwind utility classes for all layout, spacing, and typography; MUI kept only where it earns its keep (Avatar, at the time this option was weighed; the spec's cross check later found even that one use not worth an island, see `index.md`'s Rationale, so the shipped decision drops MUI entirely); no CSS in JS layer at all. Each component ships as static Astro markup by default, with only the specific animated or interactive fragment hydrated as a small React island (`client:visible`). The legacy `Reveal` primitive is kept as the one shared scroll animation island, and `Avatar` is refactored to compose it instead of duplicating its `useInView` logic. Known accessibility gaps (Menu, Tags) are fixed as part of the port, not deferred.

**Pros**:
- Directly serves the stated performance goal: most of each page's DOM ships with no React at runtime, only the fragments that truly animate or handle input become islands (Framer Motion itself still loads on most real pages, since `Reveal` is used by 8 of 13 components; see Option 3 below and `index.md`'s Follow up).
- One canonical scroll animation implementation instead of two (Avatar's bespoke copy retired).
- Every later page feature starts WCAG AA compliant instead of inheriting known gaps that would need a second pass.

**Cons**:
- More design and engineering judgment up front (deciding, per component, exactly which fragment needs to be an island) than a blanket "port as is" pass.
- The accessibility fixes (focus trap, Escape handling, an accessible tag label pattern) are new code, not a straight port, so they carry their own small risk of a subtly different interaction than the original.

### Option 2: Whole component islands, straight port

Port each of the 14 components close to as is: any component touched by Framer Motion becomes one hydrated React island top to bottom, styling approaches (Tailwind, MUI, and a CSS in JS replacement for the dropped `styled-components`) coexist per component as they did originally, and known accessibility gaps are ported unchanged and tracked as later work.

**Pros**:
- Fastest path to a working port, closest to a literal migration with the least new design work.
- Lower short term risk of an animation or interaction subtly diverging from the original, since less is rewritten.

**Cons**:
- Ships materially more JavaScript than necessary (every component with any animation hydrates in full, including its static surrounding markup), directly against the project's stated performance goal.
- Carries forward real, already documented accessibility gaps into a project that specifically committed to WCAG AA, deferring a fix that only gets more expensive once pages are built on top of the gap.
- Leaves the Tailwind/MUI/CSS in JS mix unresolved, the exact inconsistency spec 0001 flagged as needing a decision.

### Option 3: Rebuild the animation system natively, no Framer Motion islands

Replace `Reveal` (the primitive 8 of the other 13 components depend on) with a from scratch `IntersectionObserver` plus CSS transitions implementation, requiring no React or Framer Motion at runtime for scroll reveals; keep Framer Motion, if at all, only for Menu's more complex slide/stagger interaction.

**Pros**:
- The strongest possible reduction in shipped JavaScript; scroll reveals would cost near zero runtime weight.
- Removes Framer Motion as a dependency for the majority of animated components.

**Cons**:
- Not a port, new code that has to independently reproduce the exact easing and feel of the original `Reveal` animation, with its own tuning risk.
- Framer Motion is already a proven, installed dependency (spec 0001); building a parallel animation system duplicates capability the stack already pays for.
- Higher engineering cost for a personal site with one engineer, to build and tune a new animation system from scratch, even though the JavaScript reduction it would buy (cutting Framer Motion from the 8 of 13 components that only use it via `Reveal`, leaving it only for `Menu`) is real, not marginal; this spec accepts that tradeoff rather than downplaying it, see `index.md`'s Follow up.

## Rationale

Option 1 was chosen because it is the only option that satisfies both forces from Context without a major new engineering investment, not because it matches Option 3's JavaScript reduction. Reusing the proven, already installed Framer Motion primitive (`Reveal`) inside a narrowly scoped island still means most real pages load the Framer Motion chunk once, since `Reveal` is used by 8 of the 13 components; surgical islands reduce how much of each page's DOM needs React, they do not remove Framer Motion from the page. A native rebuild (Option 3) would cut that further, at a real engineering and tuning cost this spec is not choosing to pay right now, for one engineer building a personal site; that tradeoff is recorded as a Follow up to revisit if bundle size becomes a measured concern, not dismissed as insignificant. Against Option 2, the performance and accessibility goals in `AGENTS.md` are not aspirational, they are the stated bar for ported UI, so a straight port that knowingly ships more JavaScript than necessary (whole component islands where a fragment would do) and carries forward documented accessibility gaps does not meet the brief, even though it is faster to build.

Refactoring `Avatar` to compose `Reveal` rather than keep its bespoke copy follows directly from "one decision per spec, keep it focused": two implementations of the same scroll reveal behavior is exactly the kind of inconsistency a design system foundation exists to remove, and the fix costs nothing beyond the port itself already touching `Avatar`.

Dropping `styled-components` and the orphaned `Modal` component are both low risk: the former is already absent from the new project's `package.json` (this spec simply makes that already made call explicit and permanent), and the latter is dead code in the legacy site with no referencing component and no planned feature that needs it.

## Legacy component inventory (evidence)

Read directly from `~/Projects/personal/iantumulak-website/client/src/components/` (14 files) and `client/src/pages/Home/` (composition), to ground the port decisions above in what actually exists today, not assumption.

| Component | Styling today | Framer Motion | Interactive/stateful | Notes |
|---|---|---|---|---|
| Avatar | Tailwind + MUI `sx` | Yes, bespoke `useInView`/`useAnimation` pop in | No (animation only) | Duplicates `Reveal`'s pattern; refactor to compose it. MUI dropped too (shipped decision, see `index.md`'s Rationale), plain Tailwind covers the same sizing/border |
| Card | Tailwind + one `styled-components` element | Yes, hover scale on links; nests `Reveal` | No (animation/hover only) | Mostly static shell, small animated fragments |
| Container | Tailwind | No | No | Purely static |
| Headline | `styled-components` (hand rolled breakpoint helper) + Tailwind | Indirect, via nested `Reveal` | No | Retire the hand rolled breakpoint helper, matches Tailwind defaults already |
| LayoutHeader | `styled-components` (blur) + Tailwind | No (delegates to children) | No itself; contains Menu | Static wrapper around two islands |
| Menu | Tailwind only | Yes, slide/stagger | Yes, full state (open/close, scroll) | Must be a full island; real a11y gaps to fix |
| Modal | MUI `sx` only | No | Yes (controlled open/close) | Orphaned, no referencing component; dropped |
| Pill | Tailwind | Indirect, via `Reveal` | No | Static + Reveal wrapper |
| Reveal | Inline styles | Yes, this is the primitive | No (viewport observation only) | Widest blast radius of any single component |
| Section | Tailwind | No | No | Purely static |
| Socials | `styled-components` (hover fill) + Tailwind | Yes, mount stagger + hover | No | Small, fully animated; simplest as one small island |
| SubHeadline | Tailwind | Indirect, via `Reveal` | No | Static + Reveal wrapper |
| Tags | Tailwind | Indirect, via `Reveal` x2 | No | Hover only `title` tooltip, not keyboard/touch reachable; shipped decision drops it for a visible label plus an `sr-only` span, and one `Reveal` per subtree (not two), see `index.md` |
| Timeline | Third party lib CSS + Tailwind | Indirect, via nested `Reveal` | No (renders static data) | Third party React component tree, one whole island regardless of granularity |

**Cross cutting findings**: `prefers-reduced-motion` is not handled anywhere in the legacy code (zero matches on a repo wide grep); every Framer Motion animation runs unconditionally today. Responsive breakpoints already match Tailwind's own default scale (640/768/1024/1280/1536px) everywhere, including `Headline`'s hand rolled duplicate. Brand tokens read from the legacy `index.css`: brand color `#0aff9d`, background `#282c34`, text `#ebecf3`, font Poppins (loaded from Google Fonts CDN today).
