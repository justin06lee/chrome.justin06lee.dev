import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "sprite-scrubber",
  type: "registry:ui",
  description:
    "scrub through a sprite-sheet grid by dragging across it — pointer x maps to a frame index.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [
    { source: "sprite-scrubber.tsx", target: "sprite-scrubber.tsx" },
    { source: "scrub.ts", target: "scrub.ts" },
  ],
  props: [
    { name: "src", type: "string", required: true, description: "url or data uri of the sprite sheet grid." },
    { name: "frames", type: "number", required: true, description: "total number of frames in the sheet." },
    { name: "cols", type: "number", required: true, description: "number of columns in the grid." },
    { name: "rows", type: "number", required: true, description: "number of rows in the grid." },
    { name: "edgeLeft", type: "number", default: "0.22", description: "left edge zone as a fraction in [0,1]. bounds onEdge sweep detection only — frames always map across the full width." },
    { name: "edgeRight", type: "number", default: "0.78", description: "right edge zone as a fraction in [0,1]. bounds onEdge sweep detection only — frames always map across the full width." },
    { name: "reverse", type: "boolean", default: "true", description: "moving left plays forward." },
    { name: "aspectRatio", type: "string", description: "css aspect-ratio for the root (e.g. \"1 / 1\")." },
    { name: "mode", type: '"pointer"', default: '"pointer"', description: "interaction mode." },
    { name: "onFrameChange", type: "(frame: number) => void", description: "fired when the displayed frame changes." },
    { name: "onEdge", type: '(edge: "left" | "right") => void', description: "fired when the pointer reaches one edge zone after last visiting the opposite one — once per full sweep." },
    { name: "onLoad", type: "() => void", description: "fired once the sprite sheet image has loaded." },
    { name: "renderLoading", type: "() => ReactNode", description: 'custom node rendered while the sheet loads. defaults to a minimal "loading..." overlay; return null to disable.' },
    { name: "className", type: "string" },
  ],
});
