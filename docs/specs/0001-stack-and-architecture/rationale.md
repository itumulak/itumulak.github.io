# 0001. Astro stack and deployment architecture, rationale

## Context

The engineer is porting an existing React single page app (`~/Projects/personal/iantumulak-website`) into Astro, dropping Sanity in favor of markdown content, and deploying to GitHub Pages behind a Docker plus Traefik local dev setup. A near identical effort already exists in a sibling project, `~/Projects/personal/personal-web-astro`, which reached a working Astro scaffold (Astro 7.1.3, `@astrojs/react`, React 19.2.8, Tailwind v4, MUI plus Emotion, framer motion, pnpm, Node 22, Docker plus Traefik) and is mid build (Phase 1 of 3, portfolio port) under a different planning workflow (GSD Core). The engineer is restarting this effort as `personal-web-astro-v2` because that workflow was costing too many tokens for the value it returned, not because the stack itself was wrong. The engineer explicitly wants every dependency re verified against current, patched versions rather than carried over as is, since security and staying current matter to them.

The forces at play: minimize rework by reusing what is already proven to build and run, while still meeting the stated goal of current and patched packages; the site has no backend, no user accounts, and no database, so most of a typical web app's stack layers (auth, background jobs, primary database) do not apply; the deploy target (GitHub Pages) only serves static files, which rules out anything requiring a persistent server process; and the ported components (MUI, framer motion, a vertical timeline library) all assume real React, which constrains how far the framework choice can move away from React without forcing a rewrite of code that already works.

The consequence of not deciding this now is that `/develop` would have to invent the framework, toolchain, and deploy pattern mid build, with no record of why, and no confirmation that the versions in use are current rather than stale copies of the prototype's `package.json`.

**Astro itself is a fixed constraint set by the engineer, not something this spec (or any later one) evaluates against alternatives.** Option 3 below (Next.js) is recorded for a complete decision history only, kept so the reasoning against it exists on paper; it was never a live candidate and should not be reopened. The only layer genuinely open for later revisit is the interactive component framework running inside Astro (React now, Preact possibly later, see the Decision and Follow up in index.md).

## Options considered

### Option 1: Carry forward the validated Astro plus React islands stack, refreshed to current versions

Reuse the architecture already proven in the sibling prototype (Astro as the site builder, React only for interactive islands via `@astrojs/react`, pnpm, Docker plus Traefik for local dev, GitHub Pages plus GitHub Actions for deploy), but re verify every package against what is current today and bump anything that has moved (Node 22 to 24; everything else was already current as of 2026-07-26).

**Pros**:
- Starts from a stack that is already known to build and run, not a guess.
- Keeps the framework aligned with the code being ported (React, MUI, framer motion), avoiding a rewrite of working components.
- Fully satisfies the "current and patched" requirement, since every version is re checked rather than copied.

**Cons**:
- React is heavier to ship than a framework designed around islands from the start.
- Inherits the prototype's implicit assumptions (for example, that MUI and Tailwind can coexist), which still need confirming, not just copying.

### Option 2: Same architecture, but swap React for Preact (React's compatibility mode)

Keep Astro and the islands pattern, but use Preact plus `preact/compat` instead of full React, for a smaller shipped bundle per interactive island.

**Pros**:
- Meaningfully smaller JavaScript payload per island, which helps the stated performance goal.
- Astro supports Preact as a first class integration, so this is not an exotic choice.

**Cons**:
- The libraries already used by the ported components, MUI, framer motion, and `react-vertical-timeline-component`, are built and tested against real React; `preact/compat` covers common cases but is a compatibility shim, not a guarantee, and any gap would surface as a hard to debug runtime bug partway through porting a component that already worked in the original site.
- Trades a proven path for an unproven one, for a bundle size gain that has not been shown to matter yet (no performance measurement exists), which is premature optimization for a personal site with modest traffic.

### Option 3: Move off Astro entirely, to Next.js with static export

Use Next.js in static export mode instead of Astro, since it is a common, well known choice for React heavy sites and the source SPA is already React.

**Pros**:
- One framework end to end (no islands mental model to learn), and very large community and ecosystem.
- Also a mature, boring, well documented choice.

**Cons**:
- Next.js hydrates full pages by default rather than shipping only the interactive pieces; reaching Astro equivalent partial hydration needs extra manual work (dynamic imports, careful component boundaries) that Astro gives for free, working against the stated performance goal.
- Throws away the sibling prototype's already working scaffold entirely, for a framework switch that does not clearly serve any requirement the engineer stated; this is closer to a rewrite than a restart.

### Option 4: Astro with no component framework, hand written JavaScript and CSS for the interactive pieces

Drop React (and therefore MUI, framer motion, and the timeline library) entirely; rebuild the menu, modals, and timeline as small hand written Astro components with plain JavaScript and CSS or CSS animations.

**Pros**:
- The smallest possible shipped JavaScript, more than either React or Preact, which best serves the stated performance goal in isolation.
- No framework compatibility question at all, since there is no framework to be compatible with.

**Cons**:
- This is not a port, it is a rewrite of every interactive piece from scratch, working directly against the product goal to "maintain functionality" and preserve the original site's behavior faithfully; a hand rebuilt timeline or modal is very likely to diverge subtly from the original, and the ported code (already correct, already tested by having shipped) is thrown away for no functional gain.
- `react-vertical-timeline-component` specifically encodes real, nontrivial layout and scroll behavior; reimplementing it by hand is a meaningfully sized side project on its own, not a small task.

## Rationale

Option 1 (full React) is the chosen option for this spec. It is the only option with zero compatibility risk against the ported components (MUI, framer motion, the timeline library all need real React), and it satisfies the "current and patched" requirement directly, since every version in the Proposed stack table above was checked against what is current today, not copied from the prototype's lockfile.

Option 2 (Preact via `preact/compat`) was seriously considered, and briefly chosen mid conversation, before the engineer reverted to Option 1 for sequencing reasons: build and verify the site on the zero risk option first, then run a dedicated follow up spec to weigh the Preact swap against a working site rather than an unbuilt one. This is a reasonable de risking sequence for a solo project with no deadline pressure; Option 2 remains a live, considered option for that follow up, not a rejected one, and its tradeoff (a materially smaller shipped bundle, versus `preact/compat` being a shim rather than a guarantee over MUI, framer motion, and the timeline library) is already recorded above for that later spec to reuse.

Option 3 (Next.js) is rejected because it would discard working code for a framework that, by default, works against the partial hydration and minimal shipped JavaScript goals already stated in the product scope; achieving Astro equivalent hydration control in Next.js requires deliberate extra effort, not the framework's default behavior. Option 4 (no framework) is rejected because "port the existing site" and "rewrite every interactive component from scratch" are different projects; the engineer asked for the former.

The Node 22 to 24 bump follows the same "current and patched" force, but for a more modest reason than first drafted: Node 22 exited Active LTS in October 2025 and is now Maintenance LTS only (patches, no new features), while Node 24 is the current Active LTS line. pnpm 11 itself only requires Node 22 or newer, so it does not force this choice; picking 24 is simply "use the actively maintained line while it is free to do so," not a compatibility requirement.

## References

**Project sources** (verifiable, in this repo):
- `docs/scope/scope.md`, feature 1 ("Stack & architecture") and its build approach header (Tracer Bullet)
- `SCOPE.md`, the original product brief (blog via markdown, Disqus, GitHub Pages, Docker plus Traefik at `iantumulak.localhost`)
- The sibling prototype `~/Projects/personal/personal-web-astro/app/package.json` and `docker-compose.yml` (basis for the carried forward version baseline, before re verification)

**Practices & standards**:
- Partial hydration / islands architecture, for minimizing shipped JavaScript on a mostly static site
- Monolith first, boring technology over new and exciting, applied here as "reuse a proven scaffold over an unproven framework swap"

**Links** (web verified 2026-07-26):
- Astro 7 release notes: https://astro.build/blog/astro-7/
- React current versions: https://react.dev/versions
- Tailwind CSS v4.3 release notes: https://tailwindcss.com/blog/tailwindcss-v4-3
- pnpm 11 release notes: https://pnpm.io/blog/releases/11.0
- Node.js release schedule (LTS status): https://nodejs.org/en/about/previous-releases
- Astro's React integration guide: https://docs.astro.build/en/guides/integrations-guide/react/
- Astro's GitHub Pages deploy guide: https://docs.astro.build/en/guides/deploy/github/
- MUI React 19 support tracking issue: https://github.com/mui/material-ui/issues/42032
- MUI plus Tailwind/Emotion interoperability guide: https://mui.com/material-ui/integrations/interoperability/
