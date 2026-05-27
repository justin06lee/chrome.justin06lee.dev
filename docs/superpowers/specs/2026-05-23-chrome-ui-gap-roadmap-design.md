# chrome.justin06lee.dev — gap roadmap & batch 1 design

Date: 2026-05-23

## Goal

`chrome.justin06lee.dev` is a shadcn-style, own-the-code component registry that ports
the design language of `justin06lee.dev` into installable components. This spec documents
the full prioritized gap roadmap and specifies **batch 1** (the first slice to implement).

## Decisions (locked)

- **Spec covers the full roadmap; the implementation plan targets batch 1 only.**
- **Fidelity: headless + styled layer.** Interactive components split into a behavior hook
  (no styles) plus a styled component that applies the justin06lee.dev skin. Pure-visual
  components stay single-file.
- **Registry encoding B:** one registry item ships multiple files — `use-<name>.ts`
  (`registry:hook`) + `<name>.tsx` (`registry:ui`). One clean row per component in the index.
- **`socials`, `cyberware`, `foil` are gone for good.** `foil`'s effect lives in `chrome`.
- **Batch 1 = infra fixes + `navbar`, `tabs`, `card`.**

## Conventions

- Hook files: `registry:hook`, install to a new `hooks` alias (`@/hooks` → `hooks/`),
  zero Tailwind classes, own state / outside-click / Escape / keyboard nav / ARIA.
- Styled files: `registry:ui`, install to the components alias, import the hook, apply skin.
- Pure-visual components (`card`, `badge`) remain single-file `registry:ui`.
- Design against existing CSS vars only: `--background`, `--foreground`, `--surface`,
  `--surface-alt`, `--border`, `--muted`, `--accent` (+ existing `--paper-border`). No raw hex.
  No new tokens unless genuinely required.
- Voice/style: lowercase copy, no emojis, 1px borders, square corners,
  `underline-offset-4 hover:underline` links, `hover:bg-white/10` ghost buttons,
  motion via `motion/react-client`, staggered fade/slide (`opacity:0,y:-10` → `0,0`).
- Registry components stay framework-agnostic: plain `<a href>`, not `next/link`.

## Batch 1 — infra fixes

1. **`hooks` alias.** Add `aliases.hooks` (default `@/hooks`) to `ChromeUiConfig` type +
   `defaultConfig`; `init` writes it. `add.ts` routes `registry:hook` files to the hooks alias
   (mirrors the `registry:lib` → utils branch). Missing-field fallback: `@/hooks`.
2. **Install `devDependencies`.** `add.ts` currently installs only `i.dependencies`. Add
   `i.devDependencies` to the install set (schema + `compile.ts` already carry them).
3. **Apply `cssVars`.** Translate `RegistryItem.cssVars` into a fenced `@chrome:css:<name>`
   block via `patchGlobalsCss(blockId=name)`. `cssVars` is `Record<selector, Record<prop,val>>`,
   so honor the provided selectors (e.g. `:root`, `.dark`), serializing each as
   `selector { --prop: val; }`. A new `serializeCssVars` helper in `css.ts` does this.
4. **Serve `schema.json`.** Add `apps/site/public/schema.json` (JSON Schema for
   `ChromeUiConfig`, including the new `hooks` alias). Resolves the `$schema` 404.
5. **Drop dead `motion` peer.** Remove `motion` from `init` `PEER_DEPS`. Components that need
   motion declare it in their own `dependencies` (batch 1 `navbar` proves the per-component path).

Tests (TDD): extend `packages/cli/test/add.test.ts` (hook routing, devDeps, cssVars) and
`packages/cli/test/css.test.ts` (named css block).

Deferred to a later infra batch: `update` / `--all` command; top-level registry index beyond
`/r/index.json`.

## Batch 1 — components

### `navbar` (headless+styled; deps: lucide-react, motion)
- `use-navbar.ts`: `open` state, outside-click close, Escape close, body scroll-lock; returns
  `{ open, setOpen, panelRef }`.
- `navbar.tsx`: `<Navbar brand links={{label,href}[]} actions? breakpoint? />`. Fixed top bar,
  desktop inline links, mobile hamburger → `AnimatePresence` slide-in panel (right, `w-72`,
  `border-l border-white/10`) + dim overlay. Dropped: pfp, intro, hardcoded routes.

### `tabs` (headless+styled)
- `use-tabs.ts`: controlled `value` + `onValueChange`, roving-tabindex arrow-key nav, ARIA roles.
- `tabs.tsx`: `<Tabs value onValueChange items={{value,label}[]} />`. Bordered pills:
  active `border-white text-white`, idle `border-white/20 text-white/60 hover:border-white/50`.
  Panels left to consumer (tab-strip primitive only).

### `card` (pure visual, single-file `registry:ui`)
- `card.tsx`: `<Card>` (`border border-white/10 p-5 flex flex-col gap-3`), `<CardTitle>`
  (`text-lg font-semibold`, optional `href` → hover underline), `<CardMeta>`
  (`text-xs text-white/60`), `<CardActions>` (footer link row). Dropped: pinned/tech/repo/sort.

Each component also ships `demo.tsx` + `meta.ts`; run `bun run build:registry` to regenerate
`/r` + `registry-manifest.ts`.

## Full roadmap (post–batch 1)

Priority order, grouped:

- **Batch 2 — layout finish:** `badge` (chip: tech `border-white/15`, filter `bg-white text-black`),
  `tooltip` (standalone, extracted from `button`'s `social-tooltip`), `accordion`
  (`details/summary` chevron rotate).
- **Batch 3 — content:** `prose` / `markdown-renderer` (react-markdown component map, katex/gfm,
  code block + copy), `table-of-contents` (sticky IntersectionObserver scroll-spy).
- **Batch 4 — inputs/misc:** `range` slider (`.range-custom`), `menu` (sort-style dropdown,
  distinct from `select`).
- **Batch 5 — infra v2:** `update` / `--all` command; richer registry index.

Niche / likely-skip: intro sequence, 404 ASCII block, gallery-with-filter composite.

## Testing

- CLI infra: Vitest/bun-test units in `packages/cli/test` (TDD, red→green).
- Components: framework-agnostic; validated via `bun run build:registry` (walker/validate/compile
  must succeed) + `bun run typecheck`. `scripts/smoke.sh` covers the end-to-end install path.
