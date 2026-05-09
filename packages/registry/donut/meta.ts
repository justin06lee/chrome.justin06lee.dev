import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "donut",
  type: "registry:ui",
  description: "spinning ascii torus rendered with luminance shading.",
  files: [{ source: "donut.tsx", target: "donut.tsx" }],
  props: [
    { name: "width", type: "number", default: "60", description: "char columns" },
    { name: "height", type: "number", default: "30", description: "char rows" },
    { name: "speed", type: "number", default: "0.75" },
    { name: "luminanceChars", type: "string", default: "' ,-~:;=!*#$@'" },
    { name: "lightDirection", type: "[number, number, number]", default: "[0, 1, -1]" },
  ],
});
