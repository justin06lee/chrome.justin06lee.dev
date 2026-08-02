import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "skeleton",
  type: "registry:ui",
  description:
    "loading placeholder in block, text and circle shapes. shimmer keyframes ship inline via a hoisted style tag, so there is nothing to wire into globals.css. under reduced motion the sweep stops but the block stays — removing it would collapse the layout it exists to reserve.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [{ source: "skeleton.tsx", target: "skeleton.tsx" }],
  props: [
    { name: "variant", type: "'block' | 'text' | 'circle'", default: "'block'" },
    { name: "lines", type: "number", default: "3", description: "number of bars for variant=\"text\"; the last is shortened." },
    { name: "width", type: "string | number", description: "css width. defaults to full width, or a square side for circle." },
    { name: "height", type: "string | number", description: "css height. defaults per variant." },
    { name: "animate", type: "boolean", default: "true", description: "turn off the shimmer for large grids where the sweep gets noisy." },
    {
      name: "label",
      type: "string | null",
      default: "'loading'",
      description: "announced while loading. pass null when a parent already owns the live region.",
    },
    { name: "className", type: "string" },
  ],
});
