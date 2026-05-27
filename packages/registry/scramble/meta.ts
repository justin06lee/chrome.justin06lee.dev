import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "scramble",
  type: "registry:ui",
  description: "wrapper that scrambles every word inside it on hover.",
  files: [{ source: "scramble.tsx", target: "scramble.tsx" }],
  props: [
    { name: "children", type: "ReactNode", required: true },
    { name: "as", type: "ElementType", default: "'span'" },
    { name: "speed", type: "number", default: "30", description: "ms between scramble frames" },
    { name: "step", type: "number", default: "1/3", description: "chars to lock per frame" },
    {
      name: "background",
      type: "string",
      description: "CSS background applied to the root element. transparent by default.",
    },
  ],
});
