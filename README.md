# chrome.ui

components for [justin06lee.dev](https://justin06lee.dev). install via cli, own the code.

```bash
bunx chrome.ui@latest init
bunx chrome.ui@latest add button
```

dark-only · tailwind v4 · next.js 16 + react 19.

---

## what's where

| path                          | purpose                                                          |
|-------------------------------|------------------------------------------------------------------|
| `apps/site/`                  | the docs site at https://chrome.justin06lee.dev                  |
| `packages/cli/`               | the `chrome.ui` cli published to npm                             |
| `packages/registry/`          | every component lives here, one folder each                      |
| `packages/registry-builder/`  | walks `packages/registry/` and emits json + manifest             |

## adding a component

```bash
mkdir -p packages/registry/my-thing
# write my-thing.tsx, demo.tsx, meta.ts
bun run build:registry
```

see [`docs/superpowers/specs/2026-05-06-chrome-ui-design.md`](docs/superpowers/specs/2026-05-06-chrome-ui-design.md) for the full design.

## scripts

```bash
bun install
bun run dev               # apps/site dev server
bun run build             # apps/site production build (regenerates /r before)
bun run build:registry    # regenerate /r and registry-manifest.ts only
bun run typecheck         # all packages
bun test                  # all packages
```
