import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "stepper",
  type: "registry:ui",
  description:
    "numbered progress rail for a multi-step flow. unlike tabs — peers you can visit in any order — a stepper asserts sequence: it renders as an ordered list, marks the active step with aria-current, and only makes already-completed steps clickable.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [{ source: "stepper.tsx", target: "stepper.tsx" }],
  props: [
    { name: "steps", type: "Step[]", required: true, description: "{ label, description? }." },
    { name: "current", type: "number", required: true, description: "zero-based index of the step in progress." },
    { name: "orientation", type: "'horizontal' | 'vertical'", default: "'horizontal'" },
    {
      name: "onStepClick",
      type: "(index: number) => void",
      description:
        "makes completed steps clickable so an earlier answer can be changed. steps ahead of current stay inert.",
    },
    { name: "compact", type: "boolean", default: "false", description: "drop labels and descriptions for a bare progress rail." },
    { name: "ariaLabel", type: "string", default: "'progress'" },
    { name: "className", type: "string" },
  ],
});
