import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "rainbow",
  type: "registry:ui",
  description:
    "wrapper that cycles every text character inside it through a staggered rainbow.",
  files: [{ source: "rainbow.tsx", target: "rainbow.tsx" }],
  props: [
    { name: "children", type: "ReactNode", required: true },
    { name: "as", type: "ElementType", default: "'span'" },
    { name: "duration", type: "number", default: "3", description: "seconds per cycle" },
    { name: "stagger", type: "number", default: "0.25", description: "delay step per char (s)" },
    {
      name: "background",
      type: "string",
      description: "CSS background applied to the root element. transparent by default.",
    },
  ],
});
