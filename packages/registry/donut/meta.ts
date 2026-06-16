import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "donut",
  type: "registry:ui",
  description: "spinning ascii torus baked off-thread in a shared web worker and replayed as a seamless loop. multiple donuts share one bake.",
  dependencies: [],
  registryDependencies: [],
  files: [
    { source: "donut.tsx", target: "donut.tsx" },
    { source: "donut-frames.ts", target: "donut-frames.ts", type: "registry:lib" },
    { source: "donut-cache.ts", target: "donut-cache.ts", type: "registry:lib" },
    { source: "donut.worker.ts", target: "donut.worker.ts", type: "registry:lib" },
  ],
  props: [
    { name: "width", type: "number", default: "60", description: "char columns" },
    { name: "height", type: "number", default: "30", description: "char rows" },
    { name: "R", type: "number", default: "0.4", description: "torus center radius" },
    { name: "r", type: "number", default: "0.25", description: "torus tube radius" },
    { name: "K", type: "number", description: "projection scale; omit to auto-fit the torus to the grid" },
    { name: "D", type: "number", default: "4", description: "camera distance" },
    {
      name: "du",
      type: "number",
      description: "optional override for the adaptive u-sampling step (radians)",
    },
    {
      name: "dv",
      type: "number",
      description: "optional override for the adaptive v-sampling step (radians)",
    },
    { name: "speed", type: "number", default: "0.75" },
    { name: "luminanceChars", type: "string", default: "' ,-~:;=!*#$@'" },
    { name: "lightDirection", type: "[number, number, number]", default: "[0, 1, -1]" },
    { name: "yScaleOverride", type: "number", description: "override the measured char-cell aspect" },
    {
      name: "background",
      type: "string",
      description: "CSS background applied to the root element. transparent by default.",
    },
    {
      name: "isolate",
      type: "boolean",
      default: "true",
      description: "apply CSS contain to isolate per-frame repaint; set false inside <Chrome> so the foil paints through",
    },
  ],
});
