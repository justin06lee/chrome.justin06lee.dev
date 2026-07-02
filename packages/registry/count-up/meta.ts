import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "count-up",
  type: "registry:ui",
  description:
    "animated number that tweens to its target with an easeout curve. dependency-free requestanimationframe, respects prefers-reduced-motion.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [{ source: "count-up.tsx", target: "count-up.tsx" }],
  props: [
    { name: "value", type: "number", required: true, description: "target number to animate toward." },
    { name: "duration", type: "number", default: "1", description: "tween length in seconds." },
    { name: "decimals", type: "number", default: "0", description: "fixed decimal places; ignored when format is set." },
    { name: "format", type: "(n: number) => string", description: "custom formatter; overrides decimals." },
    { name: "prefix", type: "string", description: "text rendered before the number." },
    { name: "suffix", type: "string", description: "text rendered after the number." },
    { name: "as", type: "ElementType", default: "'span'" },
    { name: "className", type: "string" },
  ],
});
