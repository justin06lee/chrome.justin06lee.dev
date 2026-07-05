import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "desk",
  type: "registry:ui",
  description:
    "the full markdown workbench: a toolbar (edit/preview/split + format buttons + actions), an image sidebar, a split text editor with a two-way synced live preview, and floating drawing windows. composes the editor, asset-sidebar, editor-toolbar, and drawing-window components. bring your own markdown renderer (e.g. prose). dark-only; give the root a height. backend ops are callbacks.",
  registryDependencies: [
    "editor",
    "asset-sidebar",
    "editor-toolbar",
    "drawing-window",
    "utils",
  ],
  files: [{ source: "desk.tsx", target: "desk.tsx" }],
  props: [
    { name: "title", type: "ReactNode" },
    { name: "subtitle", type: "ReactNode" },
    { name: "value", type: "string", required: true, description: "markdown source (controlled)." },
    { name: "onChange", type: "(value: string) => void", required: true },
    {
      name: "renderMarkdown",
      type: "(markdown: string, state: { highlightLine: number | null }) => ReactNode",
      required: true,
      description: "renders the preview with line-sync — typically a <Prose lineSync /> call.",
    },
    { name: "assets", type: "Asset[]", default: "[]" },
    { name: "onInsertAsset", type: "(asset: Asset) => void", description: "the markdown ref is also spliced at the caret." },
    { name: "onDeleteAsset", type: "(asset: Asset) => void", description: "parent owns any confirm flow." },
    { name: "onUploadAssets", type: "(files: File[]) => void", description: "omit to hide the sidebar drop zone." },
    { name: "onSave", type: "(value: string) => void | Promise<void>", description: "fired on Save and cmd/ctrl+s." },
    { name: "onSaveDrawing", type: "(result: { dataUrl: string; darkDataUrl?: string }) => void | Promise<void>" },
    { name: "drawingDarkMapping", type: "boolean", description: "use the drawing window's light→dark mapping mode." },
    { name: "actions", type: "ReactNode", description: "extra toolbar actions before Save." },
    { name: "className", type: "string", description: "give the root a height." },
  ],
});
