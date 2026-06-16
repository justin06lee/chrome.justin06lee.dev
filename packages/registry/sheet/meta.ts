import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "sheet",
  type: "registry:ui",
  description:
    "animated slide-in panel from a screen edge with a dimmed backdrop. closes on backdrop click, escape, or close button, and locks body scroll while open.",
  dependencies: ["motion", "lucide-react"],
  registryDependencies: ["utils"],
  files: [{ source: "sheet.tsx", target: "sheet.tsx" }],
  props: [
    { name: "open", type: "boolean", description: "whether the sheet is visible." },
    { name: "onClose", type: "() => void", description: "called on backdrop click, escape, or close button." },
    { name: "side", type: '"right" | "left" | "top" | "bottom"', default: "'right'", description: "edge the panel slides in from." },
    { name: "title", type: "string", description: "optional heading atop the panel." },
    { name: "children", type: "ReactNode", description: "panel body." },
    { name: "className", type: "string", description: "extra classes for the panel." },
  ],
});
