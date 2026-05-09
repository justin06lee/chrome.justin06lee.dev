import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "stack",
  type: "registry:ui",
  description: "stacked paper card with hovered fan-out spring animation.",
  files: [{ source: "stack.tsx", target: "stack.tsx" }],
  props: [
    { name: "layers", type: "number", default: "2", description: "background paper layers" },
    { name: "children", type: "ReactNode", required: true },
  ],
});
