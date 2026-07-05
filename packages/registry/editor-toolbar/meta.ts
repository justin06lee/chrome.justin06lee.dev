import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "editor-toolbar",
  type: "registry:ui",
  description:
    "the bar above a markdown editor: an optional edit/preview/split toggle, a right-hand action cluster, and a row of markdown format buttons (h2/bold/list/code/link/math). with enableDrawing it also owns the floating drawing windows — a 'new drawing' button opens numbered windows (drawing #1, #2, …) you can stack, drag, and bring to front, with a one-at-a-time save lock. dark-only.",
  registryDependencies: ["drawing-window", "utils"],
  files: [{ source: "editor-toolbar.tsx", target: "editor-toolbar.tsx" }],
  props: [
    { name: "title", type: "ReactNode" },
    { name: "subtitle", type: "ReactNode" },
    { name: "mode", type: "string", description: "current view mode; pass onModeChange to render the toggle." },
    { name: "onModeChange", type: "(mode: string) => void" },
    { name: "modes", type: "string[]", default: "['edit','preview','split']" },
    { name: "actions", type: "ReactNode", description: "right-hand button cluster." },
    { name: "formatActions", type: "EditorFormatAction[]", default: "MARKDOWN_FORMAT_ACTIONS" },
    { name: "onFormat", type: "(action: EditorFormatAction) => void", description: "fired on a format button; omit to hide them." },
    { name: "status", type: "ReactNode", description: "right-aligned hint in the format row." },
    { name: "enableDrawing", type: "boolean", default: "false", description: "show 'new drawing' and own the numbered drawing windows." },
    { name: "onSaveDrawing", type: "(result: { dataUrl: string; darkDataUrl?: string }) => void | Promise<void>", description: "fired when a drawing window saves; it then closes." },
    { name: "drawingSubtitle", type: "string", description: "subtitle under each window's 'drawing #N' title." },
    { name: "drawingDarkMapping", type: "boolean", description: "use the drawing window's light→dark mapping mode." },
    { name: "className", type: "string" },
  ],
});
