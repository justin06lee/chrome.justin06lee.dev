import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "tooltip",
  type: "registry:ui",
  description:
    "white slide-up pill shown on hover or keyboard focus. pure CSS, wraps any trigger. aria-hidden — label the trigger itself.",
  registryDependencies: ["utils"],
  files: [{ source: "tooltip.tsx", target: "tooltip.tsx" }],
  props: [
    { name: "label", type: "ReactNode", required: true, description: "text shown in the pill." },
    { name: "side", type: "'top' | 'bottom'", default: "'top'" },
    { name: "children", type: "ReactNode", required: true, description: "the trigger element." },
  ],
});
