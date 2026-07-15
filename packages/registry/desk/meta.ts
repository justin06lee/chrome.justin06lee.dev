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
    {
      name: "onUploadAssets",
      type: "(files: File[]) => void | Asset[] | Promise<Asset[] | void>",
      description:
        "fired for files dropped on the sidebar drop zone or directly onto the editor textarea. return the created assets and a textarea drop also splices their markdown refs at the caret. omit to hide the drop zone and disable textarea drops.",
    },
    { name: "onSave", type: "(value: string) => void | Promise<void>", description: "fired by the built-in save button and cmd/ctrl+s; the button renders disabled without it." },
    { name: "onSaveDrawing", type: "(result: { dataUrl: string; darkDataUrl?: string }) => void | Promise<void>" },
    { name: "drawingDarkMapping", type: "boolean", description: "use the drawing window's light-to-dark mapping mode." },
    { name: "actions", type: "ReactNode", description: "extra toolbar actions before Save." },
    {
      name: "textareaProps",
      type: "Omit<ComponentProps<'textarea'>, 'value' | 'defaultValue'>",
      description:
        "escape hatch onto the underlying textarea — e.g. onKeyDown for a vim keymap. handlers compose: the desk's internal splice/save/drop glue runs first, then yours with the same event; className is merged.",
    },
    {
      name: "transformSource",
      type: "(source: string) => { body: string; lineOffset: number }",
      description:
        "strip a leading front-matter region from the preview: the preview renders body while line-sync shifts by lineOffset (editor line N ↔ preview block N − lineOffset; selections in the stripped region clamp to the first block). keep the reference stable.",
    },
    {
      name: "size",
      type: "'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'screen' | 'auto'",
      default: "'screen'",
      description:
        "size preset setting height and width (width clamped to the container). 'screen' fills the container at viewport height (like justin06lee.dev/desk); sm–2xl step from 20×32rem up to 52×88rem; 'auto' opts out so className owns the sizing.",
    },
    { name: "className", type: "string", description: "extra classes; h-*/w-* classes here override size." },
  ],
});
