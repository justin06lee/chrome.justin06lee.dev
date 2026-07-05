import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "drawing-window",
  type: "registry:ui",
  description:
    "floating, draggable, resizable paint window: brush/eraser, colors, undo/redo, zoom + pan, and canvas-size presets. save emits png(s) via onSave, or downloads.",
  registryDependencies: ["utils"],
  files: [{ source: "drawing-window.tsx", target: "drawing-window.tsx" }],
  props: [
    { name: "title", type: "string", default: "'drawing'" },
    { name: "subtitle", type: "string" },
    { name: "initialPosition", type: "{ x: number; y: number }", default: "{ x: 72, y: 120 }" },
    { name: "initialSize", type: "{ width: number; height: number }", default: "{ width: 780, height: 720 }" },
    { name: "active", type: "boolean", default: "true", description: "highlights the border and enables wheel-zoom." },
    { name: "zIndex", type: "number", default: "80" },
    { name: "onClose", type: "() => void" },
    { name: "onFocus", type: "() => void" },
    { name: "saving", type: "boolean", description: "controlled saving flag." },
    { name: "disableSave", type: "boolean", default: "false" },
    { name: "darkMapping", type: "boolean", default: "false", description: "draw in light colors remapped to a dark variant." },
    { name: "presets", type: "DrawingPreset[]" },
    { name: "colors", type: "string[]", description: "hex swatches; defaults depend on darkMapping." },
    { name: "brushSizes", type: "number[]", default: "[4, 10, 18]" },
    { name: "onSave", type: "(result: { dataUrl: string; darkDataUrl?: string }) => void | Promise<void>", description: "omit to download the png instead." },
    { name: "className", type: "string" },
  ],
});
