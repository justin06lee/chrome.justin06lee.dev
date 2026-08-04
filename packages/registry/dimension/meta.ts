import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "dimension",
  type: "registry:ui",
  description:
    "architect's dimension line — witness lines, arrow / tick / dot caps, and the measurement sitting in a break in the rule. every part inherits currentColor, so recolouring the whole annotation is one prop. horizontal or vertical.",
  registryDependencies: ["utils"],
  files: [{ source: "dimension.tsx", target: "dimension.tsx" }],
  props: [
    { name: "label", type: "ReactNode", description: "the measurement, rendered in the break in the line." },
    { name: "orientation", type: "'horizontal' | 'vertical'", default: "'horizontal'" },
    { name: "cap", type: "'arrow' | 'tick' | 'dot' | 'none'", default: "'arrow'" },
    { name: "extension", type: "number", default: "8", description: "half-length in px of the witness lines at each end; 0 removes them." },
    { name: "color", type: "string", default: "'rgba(255,255,255,0.35)'", description: "line, cap and label colour." },
    {
      name: "ariaLabel",
      type: "string",
      description:
        "accessible name. with it the annotation is exposed as an image; without it it is decorative and hidden.",
    },
    { name: "labelClassName", type: "string" },
    { name: "className", type: "string" },
  ],
});
