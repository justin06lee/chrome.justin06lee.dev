import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "range",
  type: "registry:ui",
  description:
    "thin minimal slider. native input with a custom 12px thumb on a 2px track; thumb scales on hover.",
  registryDependencies: ["utils"],
  files: [{ source: "range.tsx", target: "range.tsx" }],
  cssFile: "range.css",
  props: [
    { name: "value", type: "number", required: true },
    { name: "onChange", type: "(value: number) => void", required: true },
    { name: "min", type: "number", default: "0" },
    { name: "max", type: "number", default: "100" },
    { name: "step", type: "number", default: "1" },
    { name: "disabled", type: "boolean", default: "false" },
  ],
});
