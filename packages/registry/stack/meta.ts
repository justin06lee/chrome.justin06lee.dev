import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "stack",
  type: "registry:ui",
  description: "stacked paper card with hovered fan-out spring animation.",
  registryDependencies: ["utils"],
  files: [{ source: "stack.tsx", target: "stack.tsx" }],
  props: [
    { name: "layers", type: "number", default: "1", description: "paper layers behind the front card" },
    { name: "children", type: "ReactNode", required: true },
    {
      name: "background",
      type: "string",
      description: "CSS background applied to the root element. transparent by default.",
    },
  ],
});
