# iantumulak personal site (Astro port)

## Stack

- **Language / Runtime**: TypeScript throughout (`.tsx` for React islands, `.ts` for shared logic, `.astro` for Astro components; no `.jsx`/`.js`), Node 24
- **Framework**: Astro 7.1.3, static output, with React 19.2.8 islands via `@astrojs/react`
- **Key dependencies**: MUI 9 + Emotion, Tailwind CSS 4 (`@tailwindcss/vite`), Framer Motion, `react-vertical-timeline-component`
- **Package manager**: pnpm, pinned to an exact version via the `packageManager` field (`corepack enable`)

Full decision and rationale: [docs/specs/0001-stack-and-architecture](docs/specs/0001-stack-and-architecture/index.md).

## Build approach

**Tracer Bullet**: prove the whole pipe (local dev through build through deploy) end to end before any single page is built out in full.

## Commands

```bash
# All commands run inside app/

# Install
pnpm install

# Dev server (or: docker compose up from repo root, serves at iantumulak.localhost via Traefik)
pnpm dev

# Build
pnpm build

# Typecheck
pnpm check

# Test
pnpm test
```

## Specs

Stored in `docs/specs/`. Format: `docs/specs/NNNN-title.md`.

## Rules

- Architecture style: functional (pure functions, composition over inheritance, minimal shared mutable state)
- Folder structure: folder by feature under `app/src` (colocate a feature's Astro page, React islands, and styles)
- Named exports only, no default exports
- Accessibility baseline: WCAG AA on ported UI (keyboard nav, focus trap, aria labels, honors `prefers-reduced-motion`)
- Conventional commit messages (`feat:`, `fix:`, `chore:`, ...)
- One consistent error handling pattern across islands and content collection loading
- Lint/format: ESLint + Prettier (astro-eslint-parser, eslint-plugin-astro, typescript-eslint, prettier-plugin-astro). Chosen here, not yet installed: installed by the `/develop` tooling sub task (scope feature 2)
- Pre commit gate: lint + format + typecheck must pass. Not yet installed
- Testing gate: unit + integration with Vitest + `@testing-library/react` (runner already set up, spec 0001)
- CI: a basic check workflow (lint, typecheck, test) on push/PR, separate from the existing `.github/workflows/deploy.yml` (build + deploy only). Not yet installed

## Agent skills

Workflow skills (`.claude/skills/`, source `jsmastery-pro/skills`):
- [architect](.claude/skills/architect/): `jsmastery-pro/skills`, deliberates and records load bearing decisions as specs
- [audit](.claude/skills/audit/): `jsmastery-pro/skills`, writes and maintains this file
- [check](.claude/skills/check/): `jsmastery-pro/skills`, verifies behavior and reviews code before merge
- [debug](.claude/skills/debug/): `jsmastery-pro/skills`, root causes and fixes bugs
- [develop](.claude/skills/develop/): `jsmastery-pro/skills`, builds features from a spec
- [document](.claude/skills/document/): `jsmastery-pro/skills`, writes PRs, changelogs, release notes
- [scope](.claude/skills/scope/): `jsmastery-pro/skills`, tracks the feature plan in `docs/scope/`
- [sync](.claude/skills/sync/): `jsmastery-pro/skills`, keeps this file and the scope current after a change
- [test](.claude/skills/test/): `jsmastery-pro/skills`, writes test suites for built code

Stack skills (`.agents/skills/`, installed via `/audit`'s tool sweep):
- [astro](.agents/skills/astro/): `astrolicious/agent-skills`, Astro framework conventions (routing, content collections, islands)
- [vercel-react-best-practices](.agents/skills/vercel-react-best-practices/): `vercel-labs/agent-skills`, React performance and component patterns
- [tailwind-4-docs](.agents/skills/tailwind-4-docs/): `lombiq/tailwind-agent-skills`, Tailwind CSS v4 specific docs and gotchas
- [mui](.agents/skills/mui/): `softaworks/agent-toolkit`, MUI v7 component and `sx` prop patterns
- [vitest](.agents/skills/vitest/): `antfu/skills`, Vitest testing conventions (mocking, coverage, fixtures)
- [multi-stage-dockerfile](.agents/skills/multi-stage-dockerfile/): `github/awesome-copilot`, multi stage Dockerfile patterns
- [github-actions-templates](.agents/skills/github-actions-templates/): `wshobson/agents`, GitHub Actions workflow templates

MCP servers: claude-in-chrome (connected)

## Context files

- [app/AGENTS.md](app/AGENTS.md): Astro project specific dev server and documentation notes (create astro default)

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._

---

## RTK reference

The section below was migrated verbatim from the project's prior `CLAUDE.md` (RTK, a Claude Code specific token optimized command proxy). Kept as is per the engineer's choice; not part of the project's own stack or conventions above.

<!-- rtk-instructions v2 -->
# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. If RTK has a dedicated filter, it uses it. If not, it passes through unchanged. This means RTK is always safe to use.

**Important**: Even in command chains with `&&`, use `rtk`:
```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

## RTK Commands by Workflow

### Build & Compile (80-90% savings)
```bash
rtk cargo build         # Cargo build output
rtk cargo check         # Cargo check output
rtk cargo clippy        # Clippy warnings grouped by file (80%)
rtk tsc                 # TypeScript errors grouped by file/code (83%)
rtk lint                # ESLint/Biome violations grouped (84%)
rtk prettier --check    # Files needing format only (70%)
rtk next build          # Next.js build with route metrics (87%)
```

### Test (60-99% savings)
```bash
rtk cargo test          # Cargo test failures only (90%)
rtk go test             # Go test failures only (90%)
rtk jest                # Jest failures only (99.5%)
rtk vitest              # Vitest failures only (99.5%)
rtk playwright test     # Playwright failures only (94%)
rtk pytest              # Python test failures only (90%)
rtk rake test           # Ruby test failures only (90%)
rtk rspec               # RSpec test failures only (60%)
rtk test <cmd>          # Generic test wrapper - failures only
```

### Git (59-80% savings)
```bash
rtk git status          # Compact status
rtk git log             # Compact log (works with all git flags)
rtk git diff            # Compact diff (80%)
rtk git show            # Compact show (80%)
rtk git add             # Ultra-compact confirmations (59%)
rtk git commit          # Ultra-compact confirmations (59%)
rtk git push            # Ultra-compact confirmations
rtk git pull            # Ultra-compact confirmations
rtk git branch          # Compact branch list
rtk git fetch           # Compact fetch
rtk git stash           # Compact stash
rtk git worktree        # Compact worktree
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### GitHub (26-87% savings)
```bash
rtk gh pr view <num>    # Compact PR view (87%)
rtk gh pr checks        # Compact PR checks (79%)
rtk gh run list         # Compact workflow runs (82%)
rtk gh issue list       # Compact issue list (80%)
rtk gh api              # Compact API responses (26%)
```

### JavaScript/TypeScript Tooling (70-90% savings)
```bash
rtk pnpm list           # Compact dependency tree (70%)
rtk pnpm outdated       # Compact outdated packages (80%)
rtk pnpm install        # Compact install output (90%)
rtk npm run <script>    # Compact npm script output
rtk npx <cmd>           # Compact npx command output
rtk prisma              # Prisma without ASCII art (88%)
```

### Files & Search (60-75% savings)
```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%)
rtk grep <pattern>      # Search grouped by file (75%). Format flags (-c, -l, -L, -o, -Z) run raw.
rtk find <pattern>      # Find grouped by directory (70%)
```

### Analysis & Debug (70-90% savings)
```bash
rtk err <cmd>           # Filter errors only from any command
rtk log <file>          # Deduplicated logs with counts
rtk json <file>         # JSON structure without values
rtk deps                # Dependency overview
rtk env                 # Environment variables compact
rtk summary <cmd>       # Smart summary of command output
rtk diff                # Ultra-compact diffs
```

### Infrastructure (85% savings)
```bash
rtk docker ps           # Compact container list
rtk docker images       # Compact image list
rtk docker logs <c>     # Deduplicated logs
rtk kubectl get         # Compact resource list
rtk kubectl logs        # Deduplicated pod logs
```

### Network (65-70% savings)
```bash
rtk curl <url>          # Compact HTTP responses (70%)
rtk wget <url>          # Compact download output (65%)
```

### Meta Commands
```bash
rtk gain                # View token savings statistics
rtk gain --history      # View command history with savings
rtk discover            # Analyze Claude Code sessions for missed RTK usage
rtk proxy <cmd>         # Run command without filtering (for debugging)
rtk init                # Add RTK instructions to CLAUDE.md
rtk init --global       # Add RTK to ~/.claude/CLAUDE.md
```

## Token Savings Overview

| Category | Commands | Typical Savings |
|----------|----------|-----------------|
| Tests | vitest, playwright, cargo test | 90-99% |
| Build | next, tsc, lint, prettier | 70-87% |
| Git | status, log, diff, add, commit | 59-80% |
| GitHub | gh pr, gh run, gh issue | 26-87% |
| Package Managers | pnpm, npm, npx | 70-90% |
| Files | ls, read, grep, find | 60-75% |
| Infrastructure | docker, kubectl | 85% |
| Network | curl, wget | 65-70% |

Overall average: **60-90% token reduction** on common development operations.
<!-- /rtk-instructions -->
