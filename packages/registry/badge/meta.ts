import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "badge",
  type: "registry:ui",
  description:
    "small chip. static label by default; pass onClick to make it a toggle/filter chip, with active swapping to the solid look.",
  registryDependencies: ["utils"],
  files: [{ source: "badge.tsx", target: "badge.tsx" }],
  props: [
    { name: "variant", type: "'outline' | 'solid' | 'ghost'", default: "'outline'" },
    { name: "onClick", type: "() => void", description: "renders as a toggle button." },
    { name: "active", type: "boolean", default: "false", description: "toggle state; swaps to the solid look." },
  ],
});
