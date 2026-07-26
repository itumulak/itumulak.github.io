# Shared UI component library

The 13 ported components (plus the icon registry) for the whole site, not owned by one page or feature. Design characteristics (character, type/spacing, kept vs. dropped libraries) live in [`app/design.md`](../../design.md); this file is the engineering contract. Decided in [spec 0003](../../../docs/specs/0003-design-system-ui-foundation/index.md).

## Island vs. static split

`Reveal`, `Menu`, `Socials`, `Timeline` are React islands (`.tsx`, hydrated with `client:visible`). Everything else (`Avatar`, `Card`, `Container`, `Headline`, `LayoutHeader`, `Pill`, `Section`, `SubHeadline`, `Tags`) is static Astro markup (`.astro`), each nesting a `Reveal` island for its own entrance animation rather than hydrating itself.

## Icon pattern

Astro can't pass a component reference as a prop into an island (functions aren't serializable across the server → client hydration boundary). `Menu`, `Socials`, and `Timeline` take an icon **by name** (`IconName`, from `icons.ts`'s `ICONS` registry) and resolve it internally, instead of receiving a `react-icons` component directly. Static (non-island) components — `Card`, `Tags`, `SubHeadline` — have no such boundary and accept a real `IconType` prop directly; their call sites (e.g. `app/src/features/home/data.ts`) import `react-icons` components straight from their real icon sets (`io5`, `si`, `fa`, `fa6`, `bi`, `tb`, `ri`, `bs`, ...), not through the registry.

`icons.ts`'s registry is intentionally small (`github`, `linkedin`, `mail`, `globe`, `code`, `briefcase`, `x`) since it only serves island props; do not add one-off icons here for a component that could just import directly.

## `Reveal` (the one scroll-reveal primitive)

Every scroll-entrance animation reuses `Reveal` (never a second copy); at most one wraps a given subtree. It is driven purely by Framer Motion's `useInView` (`initial="hidden"`, `animate={inView ? 'visible' : 'hidden'}`) — do not reintroduce a "was this already above the fold at mount" pre-check: an earlier version tried that (a `shouldAnimate`/`belowViewport` state flag) and it always resolved to `'visible'` on first render regardless of position, so combined with Astro's own lazy `client:visible` hydration (which doesn't mount the component until it's already near the viewport), content never actually passed through a hidden state. Content below the fold must render `opacity:0` in its initial state; if that regresses, suspect this exact interaction again.

`Timeline` additionally wraps `react-vertical-timeline-component`, which ships its **own** scroll-triggered reveal system (`animate` prop, default `true`, gates content behind `visibility:hidden` via a separate `react-intersection-observer`). This duplicates `Reveal` and is unreliable under Astro's lazy hydration (content can get stuck invisible). `Timeline` passes `animate={false}` deliberately; do not re-enable it.

## `Menu`

Mobile drawer: `fixed top-0 right-0 h-dvh` (not `inset-y-0`), because the sticky header wrapping it (`LayoutHeader.astro`) uses `backdrop-blur`, and `backdrop-filter` establishes a CSS containing block for fixed-position descendants — `inset-y-0` (`top:0; bottom:0`) resolves against the header's own (short) box instead of the viewport, clipping the drawer to header height. `h-dvh` sizes it correctly regardless of that containing block.

`MenuItem.emphasized` renders that item as a bordered brand-color pill instead of a plain link (used for "Resume"), matching the legacy site's CTA treatment.

## `Timeline`

`layout="1-column-left"` (single left-aligned column) — the library's default is a two-column alternating (zigzag) layout, which does not match the legacy site. `ExperienceEntry.position` renders as the brand-green heading (company name in the legacy data), `.title` renders as the plain-white subheading (job role) — the field names don't obviously map to which color/prominence they get; check `Timeline.tsx`'s JSX, not just the type, before feeding it data.

_Drafted by /sync from the introducing change, worth a quick human pass._
