import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "rainbow",
  type: "registry:ui",
  description: "per-character cycling rainbow text with staggered animation.",
  files: [{ source: "rainbow.tsx", target: "rainbow.tsx" }],
  props: [
    { name: "text", type: "string", required: true },
    { name: "as", type: "ElementType", default: "'span'" },
    { name: "duration", type: "number", default: "3", description: "seconds per cycle" },
    { name: "stagger", type: "number", default: "0.25", description: "delay step per char (s)" },
  ],
});
