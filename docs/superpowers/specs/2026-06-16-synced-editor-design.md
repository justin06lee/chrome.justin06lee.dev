# synced-editor — design

**date:** 2026-06-16
**owner:** justin06lee
**status:** approved

## goal

Ship the full editor↔preview sync experience from `justin06lee.dev/desk` as a
registry component: a split-pane markdown editor whose preview scrolls and
highlights in sync with the editor, in both directions. Today the registry only
has `synced-preview` (the preview pane); the editor side and the coordination
glue live in the source's 1431-line `OperatorArticleEditor.tsx` and were never
ported. This packages "that whole part" as a reusable unit.

Hybrid packaging (chosen): a headless engine hook plus a turnkey component.

## what we build

```
packages/registry/synced-editor/
  use-line-sync.ts   (registry:hook)  — the engine (DOM-coupled, no styling)
  synced-editor.tsx  (registry:ui)    — turnkey split pane, exports SyncedEditor
  use-line-sync.test.ts               — unit tests for the pure line math (not shipped)
  demo.tsx · meta.ts
```

registryDependencies: `synced-preview`, `utils`. The preview pane is the existing
`synced-preview`; the markdown renderer is the caller's (typically `prose` with
`lineSync`), passed via `renderMarkdown`.

## the sync mechanic (ported faithfully)

Four parts, lifted from `OperatorArticleEditor.tsx`:

1. **caret↔line math** (pure, tested):
   - `offsetToLine(text, offset)` → 1-based line of a char offset.
   - `lineStartOffset(text, line)` → char offset where a 1-based line begins.
   - `trimStreakRange(text, startLine, endLine)` → `{start, end}` char offsets for a
     clicked preview block, trimming trailing blank lines so the streak covers only
     the block's text (source lines 603–616). This is the off-by-one-prone logic.
2. **mirror-div measurement** (DOM): `measureSelectionRect(textarea, start, end)` —
   a hidden div copies the textarea's font/padding/wrap styles to get the pixel
   `top`/`height` of a selection, since a textarea can't report caret coords and
   soft-wraps. Ported verbatim (`MIRROR_STYLE_PROPS`, `measureCaretTop`).
3. **overlay layer** — an absolutely-positioned layer over the textarea holding the
   gray streak (`bg-white/10`, padded by `STREAK_PAD=3`) and the `→ preview` button;
   `translateY(-scrollTop)` imperatively so it tracks the textarea's scroll 1:1 with
   no React lag.
4. **two-way coordination**:
   - **editor → preview** (`syncToPreview`): on the floating button, compute the
     selection's `screenY` and source line, call `preview.alignLineToScreenY(line,
     screenY)`, lay the streak over the selection, collapse the native selection.
   - **preview → editor** (`onPreviewSelectBlock`): map the clicked block's line
     range to char offsets, lay the streak, and scroll the textarea so the block's
     center lines up with the clicked preview block (clamped so the last line stays
     visible).

## generalizations vs the source

- **No `bodyOffset`.** The source editor has a title/metadata header above the body,
  so preview lines (body-relative) and editor lines (draft-relative) differ. Our
  editor *is* the markdown, so `contentLine === rawLine`; the offset is dropped.
- **No modes/vim/server-actions/drawing/theme/image-upload.** Just editing + sync.
- **Renderer injected** via `renderMarkdown` (not hardcoded `MarkdownRenderer`).
- Plain controlled `<textarea>`, framework-agnostic, dark-only, `cn` from `@/lib/utils`.

## APIs

```ts
// headless engine
const sync = useLineSync({ value, onChange });
// returns: { textareaRef, previewRef, previewProps: { content, onSelectBlock },
//   overlayLayerRef, streakRect, button: { rect, visible, onSync } | null,
//   onTextareaScroll, onSelect }

// turnkey component
<SyncedEditor
  value={md}
  onChange={setMd}
  renderMarkdown={(md, { highlightLine }) =>
    <Prose lineSync highlightLine={highlightLine}>{md}</Prose>}
  label?  className?
/>
```

`SyncedEditor` renders the textarea pane (with the overlay streak/button) beside
`<SyncedPreview>`, wired through `useLineSync`. Split on wide screens, stacked on
narrow.

## testing

- **Unit (`bun test`, pure):** `offsetToLine`, `lineStartOffset`, `trimStreakRange`
  round-trips and trailing-blank-trimming edge cases. TDD these first.
- **Build/types:** `bun run typecheck`, `bun run build:registry`, full `bun test`.
- **Manual:** demo page renders; select→button→preview scroll+highlight; preview
  click→editor scroll+streak (the dev server / live site).

## integration

- Site shim `apps/site/hooks/use-line-sync.ts` (bridges `@/hooks/use-line-sync`).
- DEMOS-map entry; rebuild `/r` + manifest.
