# chrome.ui — design doc

**date:** 2026-05-06
**owner:** justin06lee
**status:** draft, awaiting user review

## 1. overview

`chrome.ui` is a shadcn-style, copy-into-your-project component library. Components are authored in this monorepo, served as static JSON over `https://chrome.justin06lee.dev/r/`, and installed by a custom CLI published to npm as `chrome.ui`.

```
$ bunx chrome.ui@latest init
$ bunx chrome.ui@latest add button
$ pnpm dlx chrome.ui@latest add dialog select
```

The project has three artifacts:

1. **`apps/site`** — the public-facing site at `https://chrome.justin06lee.dev`. Hosts the docs, the live component showcase, and serves the registry JSON from `public/r/`.
2. **`packages/cli`** — published to npm as `chrome.ui`. Single-file binary that fetches registry items, resolves dependencies, and writes files into the consumer's project.
3. **`packages/registry`** — the canonical source of truth for every component. The site imports from here directly; the registry-builder reads from here to emit JSON.

### goals

- adding a new component is "drop a folder, redeploy" — no edits to the CLI, no edits to the site
- the demos on the docs site render the *exact same code* the CLI ships (single source of truth)
- registry JSON conforms to shadcn's published schema, so users can fall back to `npx shadcn add <url>` if they choose
- dark-only theme matching `justin06lee.dev` aesthetic; brutalist black/white structure with a pearlescent-rainbow "chrome foil" accent on the homepage hero
- v1 ships in roughly 7 days of focused work

### non-goals (for v1)

- light mode / theme variants
- tailwind v3 support (v4 only)
- frameworks other than next.js (the CLI detects framework but only emits next-aware patches in v1)
- `update`, `remove`, `theme` CLI subcommands (deferred to v1.1)
- TUI prompts in `add` — `add` stays scriptable / zero-prompt

## 2. architecture

### repo layout

```
chrome.justin06lee.dev/                  # bun workspaces root
├─ package.json                          # "workspaces": ["apps/*", "packages/*"]
├─ bunfig.toml
├─ tsconfig.base.json
├─ README.md                             # ← repo front door (see §6)
│
├─ apps/
│  └─ site/                              # the existing app/ moved under here
│     ├─ app/                            # docs pages, /components index, /components/[name]
│     ├─ public/r/                       # generated; CLI fetches from here
│     │  ├─ index.json
│     │  └─ <name>.json
│     ├─ registry-manifest.ts            # shim re-exports from packages/registry
│     └─ package.json                    # build = "bun run build:registry && next build"
│
├─ packages/
│  ├─ cli/                               # npm: chrome.ui
│  │  ├─ src/
│  │  │  ├─ index.ts
│  │  │  ├─ commands/{init,add,list,diff}.ts
│  │  │  ├─ registry.ts                  # fetch + parse JSON
│  │  │  ├─ project.ts                   # detect pkg-mgr, framework, tw version
│  │  │  └─ writers/{tsx,css,config,deps}.ts
│  │  └─ package.json                    # "name": "chrome.ui", "bin": { "chrome.ui": "./dist/cli.js" }
│  │
│  ├─ registry/                          # SOURCE OF TRUTH
│  │  ├─ _shared/
│  │  │  ├─ utils/                       # cn() helper
│  │  │  └─ theme/                       # CSS vars + @theme inline block
│  │  ├─ button/
│  │  │  ├─ button.tsx
│  │  │  ├─ demo.tsx                     # auto-rendered on /components/button
│  │  │  └─ meta.ts
│  │  ├─ dialog/...
│  │  ├─ select/...
│  │  ├─ input/...
│  │  └─ socials/...
│  │
│  └─ registry-builder/                  # build-only, never published
│     └─ src/
│        ├─ build.ts                     # walks registry/, emits public/r/*.json
│        ├─ watch.ts                     # chokidar dev watcher
│        ├─ define.ts                    # defineComponent typed helper
│        └─ schema.ts                    # JSON shape (shadcn-compatible)
│
└─ docs/superpowers/specs/               # this file
```

### data flow (install path)

```
1. user types: bunx chrome.ui@latest add button
2. CLI starts → reads ./chrome.ui.json (or runs init wizard if absent)
3. CLI fetches https://chrome.justin06lee.dev/r/button.json
4. CLI walks registryDependencies → fetches each (transitively, deduped)
5. CLI installs union of dependencies via detected pkg-mgr (bun add | pnpm add | npm i)
6. CLI writes each files[].content to resolved alias target
   → components/chrome/button.tsx
   → lib/utils.ts (if not already present)
7. CLI patches globals.css if cssVars / cssBlocks present (idempotent, fenced markers)
8. Print summary. Exit 0.
```

## 3. component authoring contract

Every registry item lives in its own folder under `packages/registry/<name>/`. Folder layout:

```
packages/registry/scramble-text/
├─ scramble-text.tsx          # the component source
├─ meta.ts                    # registry metadata (typed)
└─ demo.tsx                   # site auto-imports for live preview
```

### `meta.ts`

A typed module the builder consumes. No JSON-by-hand.

```ts
import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "scramble-text",
  type: "registry:ui",                   // shadcn-compatible types
  description: "hover-to-scramble text effect.",

  // npm packages the CLI must install
  dependencies: ["motion"],
  devDependencies: [],

  // other registry items pulled in transitively (resolved DFS, deduped)
  registryDependencies: ["utils"],       // → packages/registry/_shared/utils

  // files emitted into the consumer's project
  // `target` is relative to the configured alias (e.g. `components/chrome/`)
  files: [
    { source: "scramble-text.tsx", target: "scramble-text.tsx" },
  ],

  // OPTIONAL: CSS variable patches injected into globals.css (additive, idempotent,
  // fenced by /* @chrome.ui:theme */ … /* @chrome.ui:end */ markers)
  cssVars: {},

  // hand-authored prop docs for the docs site only — never serialized into the
  // JSON wire format. (Auto-extraction via react-docgen-typescript is a future swap.)
  props: [
    { name: "text", type: "string", required: true, description: "the string to scramble" },
  ],
});
```

`defineComponent` is just `<T extends ComponentMeta>(x: T): T => x` — exists for type inference. The internal workspace package is named `chrome-ui-registry-builder` (no scope, since npm scopes can't contain dots and we want the published `chrome.ui` name to remain unambiguous).

### `_shared` items

Things that aren't visible components but are needed by them. Treated as registry items too — same shape, different `type`:

- `_shared/utils` — `type: "registry:lib"`. Lands at `lib/utils.ts` in the consumer. Most components depend on it.
- `_shared/theme` — `type: "registry:theme"`. The CSS-vars block + `@theme inline`. The `init` command "installs" this. Components can also depend on it transitively.

Treating the theme as a registry item (not a hard-coded `init` blob) means we can version it cleanly and `init` becomes "install theme + utils" — same code path as `add`.

### tracer-bullet rule

Every component ships its full vertical at once: source, demo, meta. The site auto-discovers it via `apps/site/registry-manifest.ts`. The builder validates that demo + meta both exist and that all `registryDependencies` resolve. Build fails loudly on partial work.

## 4. registry build pipeline

### `bun run build:registry`

For each `packages/registry/**/meta.ts`:

1. Import the meta module.
2. Read each `files[].source` from disk → embed as a string into JSON `files[].content`.
3. Resolve `target` against the configured alias (`components/chrome/<name>.tsx` by default, or `lib/utils.ts` for `registry:lib`).
4. Verify every `registryDependencies` entry corresponds to an existing folder.
5. Emit `apps/site/public/r/<name>.json`.
6. Append summary entry to `apps/site/public/r/index.json`.

Wire format (shadcn-compatible):

```json
{
  "name": "button",
  "type": "registry:ui",
  "description": "a button. clicks like a button.",
  "dependencies": ["motion"],
  "registryDependencies": ["utils"],
  "files": [
    {
      "path": "button.tsx",
      "content": "...",
      "type": "registry:ui",
      "target": ""
    }
  ],
  "cssVars": {},
  "tailwind": {}
}
```

Validation errors are fatal at build time. Examples: missing `meta.ts`, file referenced in `files[]` not on disk, dangling `registryDependencies`.

### dev iteration

```
bun run registry:watch   # chokidar watcher, regenerates JSON on file change
```

The site reads from `packages/registry` directly (not from JSON) for demos, so the watcher is only needed when testing the CLI against `--registry http://localhost:3000/r`.

### production deploy

`apps/site/package.json` has a `prebuild` hook that always runs `build:registry` before `next build`. JSON files end up as static assets, served from CDN with long-lived cache. The CLI hits a CDN endpoint, never the Next runtime.

## 5. CLI commands

### surface area (v1)

```
chrome.ui init                     # bootstrap a project
chrome.ui add <name...>            # install one or more components
chrome.ui list                     # list available components
chrome.ui diff <name>              # show local-vs-registry diff for a component
```

Flags: `--cwd <path>`, `--yes` (skip prompts), `--overwrite`, `--registry <url>`, `--debug`.

### `init`

Prompts only when config values can't be inferred. Plain stdout otherwise.

```
$ bunx chrome.ui@latest init
✓ detected: bun · next 16.2.4 · tailwind 4 · typescript 5
? components alias?  components/chrome
? utils alias?       lib/utils
? globals.css path?  app/globals.css
? install peer deps now? (Y/n)

✓ installed motion lucide-react clsx tailwind-merge
✓ wrote lib/utils.ts                    (cn helper)
✓ patched app/globals.css                (CSS vars + @theme inline block)
✓ wrote chrome.ui.json
```

**Detection** (`project.ts`):
- pkg manager: `bun.lock` → bun, `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, else npm
- framework: read `package.json` deps; next is the only first-class target in v1
- tailwind: `^4` → use `@theme inline`; `^3` errors with a clear message ("v3 not yet supported")

**Config file (`chrome.ui.json`)** at project root:

```jsonc
{
  "$schema": "https://chrome.justin06lee.dev/schema.json",
  "registry": "https://chrome.justin06lee.dev/r",
  "style": "default",
  "tsx": true,
  "tailwind": {
    "css": "app/globals.css",
    "baseColor": "black"
  },
  "aliases": {
    "components": "@/components/chrome",
    "utils": "@/lib/utils"
  }
}
```

### `add <name...>`

Zero-prompt unless a file collision is detected.

```
$ bunx chrome.ui@latest add button
✓ resolved: button (depends on: utils)
✓ installed motion
✓ wrote components/chrome/button.tsx
✓ skipped lib/utils.ts (already exists)

  import { Button } from "@/components/chrome/button"
```

**Algorithm:**
1. Read `chrome.ui.json` (error: "no chrome.ui.json — run `bunx chrome.ui@latest init` first").
2. For each requested name: fetch `<registry>/<name>.json`. Topological resolution of `registryDependencies` (DFS, deduped).
3. Union all `dependencies` → single `<pkg-mgr> add <pkg list>` call.
4. For each item's `files[]`: resolve target via aliases, write to disk. If file exists with different content, prompt unless `--overwrite` or `--yes`.
5. For each item's `cssVars` / `cssBlocks`: read globals.css, look for fenced markers (`/* @chrome.ui:theme */ … /* @chrome.ui:end */`), replace block (or append if absent). Idempotent.

### `list`

Hits `<registry>/index.json`. Tabular output grouped by type. Works without `chrome.ui.json`.

### `diff <name>`

Reads local file at `aliases.components/<name>.tsx`, fetches the same path from registry, prints a unified diff. No auto-merge.

### implementation notes

- CLI library: **citty** (Nuxt's CLI framework — small, ESM-native, ergonomic).
- Bundled with `bun build --target=node --minify` to a single file. Faster `bunx` cold start.
- Network errors print: "registry unreachable, check internet or `--registry` flag" — never a stack trace at users (unless `--debug`).
- Errors always name the next action:
  ```
  ✗ no chrome.ui.json found in /Users/x/my-app
    → run: bunx chrome.ui@latest init
  ```

## 6. site (apps/site)

### page map

```
/                          homepage — hero (chrome foil wordmark) + install + CTAs
/docs                      getting started, install, init, first add
/docs/cli                  CLI reference (init, add, list, diff)
/docs/theming              CSS vars, @theme, customizing
/components                index of all components (auto-discovered)
/components/[name]         per-component live demo + source + props + view-source link
/r/index.json              ← static, generated
/r/[name].json             ← static, generated
```

### homepage hero (locked design)

- Top nav: brand on left, links right-aligned.
  - Left: `chrome.justin06lee.dev` — `chrome` rendered with the foil treatment, `.justin06lee.dev` in dim mono `rgba(255,255,255,0.35)`.
  - Right: `docs` · `components` · `themes` · `github`.
- Hero center:
  - small `justin06lee's` (lowercase, white/70)
  - giant `chrome.` (italic serif, ~clamp(80px, 14vw, 180px), foil treatment)
  - install snippet box: `bunx chrome.ui@latest init` with click-to-copy
  - CTAs: primary `browse components →` (white bg, black text) + ghost `view on github`
- No tagline, no preview cards beneath. Hero is the page.

### the chrome foil recipe

Three stacked backgrounds, all clipped to glyph via `-webkit-background-clip: text`:

1. **top layer** — moving specular highlight band: `linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.85) 48%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.85) 52%, transparent 70%)` with `background-size: 220% 100%` and `background-position` animated from `-50%` to `250%` over 5s.
2. **middle layer** — diagonal foil grain: `repeating-linear-gradient(48deg, rgba(255,255,255,0) 0 1px, rgba(255,255,255,0.12) 1px 2px, rgba(0,0,0,0.05) 2px 4px)`.
3. **base layer** — pearlescent vertical rainbow: 9-stop gradient cycling cyan → mint → lime → yellow → peach → pink → magenta → lavender → cyan.

Plus `filter: drop-shadow(...)` for the soft halo. Wrapped in a single `.chrome-foil` class so the nav brand and hero wordmark animate in lockstep.

### per-component page anatomy

1. **header** — name, one-line description, install command (click-to-copy), per-component "view source on github" link deep-linking to `tree/main/packages/registry/<name>`.
2. **live demo** — imports `demo.tsx` from `packages/registry/<name>/demo.tsx`. Real component, not iframe.
3. **source** — raw `<name>.tsx` content, syntax highlighted.
4. **props** — table generated from `meta.ts > props`. Hand-authored in v1; auto-extracted via `react-docgen-typescript` is a future swap.

Cross-links: each page lists its `registryDependencies` and npm `dependencies` with links.

### auto-discovery

The `/components` index never hardcodes a list. At build, it imports `apps/site/registry-manifest.ts` — a generated TypeScript module that imports every `packages/registry/**/meta.ts` and exports them as an array. The same `bun run build:registry` step that emits `public/r/*.json` also rewrites `registry-manifest.ts`. New folder under `packages/registry/` = next build picks it up. End-to-end "easy to add components" guarantee.

### root README

The repo's `README.md` is the GitHub front door — one-screen, opinionated, links straight to:
- `packages/registry/` — "all components live here, one folder each"
- `packages/cli/` — "the CLI source"
- `apps/site/` — "the docs site you're reading"
- contribution doc (`docs/contributing.md`) — how to add a new component

This is what the nav's "github" link lands on. Per-component "view source" links bypass it and deep-link directly.

### deployment

Vercel (or any Next host). `prebuild` hook ensures `public/r/*.json` is current. CLI hits CDN-cached static endpoints, never Next runtime.

## 7. v1 scope, milestones, testing

### v1 component scope

| Component | Type | Notes |
|---|---|---|
| `_shared/utils` | `registry:lib` | `cn()` helper |
| `_shared/theme` | `registry:theme` | CSS vars + `@theme inline` |
| `button` | `registry:ui` | smoke test for the pipeline |
| `dialog` | `registry:ui` | port from `justin06lee.dev/src/components/Dialog.tsx` |
| `select` | `registry:ui` | port from `justin06lee.dev/src/components/Select.tsx` |
| `input` | `registry:ui` | net-new, generic primitive |
| `socials` | `registry:ui` | port; proves multi-file (icons + tooltip CSS) |

v1.1 (post-launch): `scramble-text`, `rainbow-text`, `pfp-tile`, `ascii-donut`, `navbar`. One folder at a time.

### milestones (~7 days)

```
M1 — monorepo bootstrap            (~½ day)
M2 — registry-builder               (~1 day)
M3 — first component end-to-end     (~1 day)
M4 — CLI                            (~1.5 days)
M5 — port remaining v1 components   (~1 day)
M6 — site polish                    (~1.5 days)
M7 — publish + smoke test           (~½ day)
```

Adding a new component after M7 is closer to ~1 hour: drop folder, write demo + meta, push.

### testing

- **`packages/registry-builder`** — golden-file unit tests. Given a fixture registry, assert emitted JSON matches a checked-in snapshot. Catches schema drift instantly. Bun test runner.
- **`packages/cli`** — integration tests. Runs CLI against a temp directory mocked as a Next.js project. Cover: `init` from clean, `init` re-run is idempotent, `add button` writes correctly, `add` of a component with `registryDependencies` pulls transitively, `add` errors on missing config.
- **`apps/site`** — no automated tests in v1. Visual surface; manually verified on each PR.
- **end-to-end smoke** — `scripts/smoke.sh`: creates a fresh `bun create next-app`, runs the CLI, runs `next build`, asserts no type errors. Runs in CI on PRs touching `packages/cli` or `packages/registry`. This is the test that catches "did we break the install?"

### error-handling philosophy

Short, actionable, names the next step. Stack traces only with `--debug`.

```
✗ no chrome.ui.json found in /Users/x/my-app
  → run: bunx chrome.ui@latest init
```

## 8. open questions / deferred decisions

- **tailwind v3 support** — deferred. v1 errors with a clear message; v1.1 can add a config-file mutation path if there's demand.
- **other frameworks** — `init` detects framework but only writes Next.js-aware patches. Adding Vite is a v1.2 task.
- **theme variants** — dark-only by design. Light theme is not on the roadmap.
- **auto prop extraction** — hand-authored props in v1. Swap to `react-docgen-typescript` later without changing the meta.ts shape.
- **registry versioning** — v1 serves the latest source, no version pinning. If we need pinning later, the registry URL convention becomes `/r/v1/<name>.json` and the config gains a `registry.version` field.
- **CLI update / remove subcommands** — `update` requires the diff logic from v1, so it's a natural v1.1 extension. `remove` is straightforward (delete file, run `pkg-mgr remove` on un-needed deps).
