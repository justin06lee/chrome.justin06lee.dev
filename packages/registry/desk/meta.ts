import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "desk",
  type: "registry:ui",
  description:
    "the full markdown workbench: toolbar, image sidebar, split editor with a two-way synced preview, and floating drawing windows. bring your own markdown renderer; backend ops are callbacks.",
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
    { name: "drawingDarkMapping", type: "boolean", description: "use the drawing window's light-to-dark mapping mode." },
    { name: "actions", type: "ReactNode", description: "extra toolbar actions before Save." },
    {
      name: "size",
      type: "'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'screen' | 'auto'",
      default: "'screen'",
      description:
        "height preset. 'screen' fills the viewport minus a header allowance (like justin06lee.dev/desk); sm–2xl step from 20rem to 52rem; 'auto' opts out so className owns the height.",
    },
    { name: "className", type: "string", description: "extra classes; an h-* class here overrides size." },
  ],
});
