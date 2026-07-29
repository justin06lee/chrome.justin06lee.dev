import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "interval-picker",
  type: "registry:ui",
  description:
    "duration picker for \"every n minutes\" settings — quick presets in a roving-tabindex radiogroup plus a stepper for anything in between. always emits a plain minute count.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [{ source: "interval-picker.tsx", target: "interval-picker.tsx" }],
  props: [
    { name: "value", type: "number", required: true, description: "current interval, in minutes." },
    {
      name: "onChange",
      type: "(minutes: number) => void",
      required: true,
      description: "fired with the new interval in minutes, already clamped to min/max.",
    },
    { name: "presets", type: "number[]", default: "[15, 25, 50, 90]", description: "quick-pick values in minutes." },
    { name: "min", type: "number", default: "1", description: "lower bound in minutes." },
    { name: "max", type: "number", default: "240", description: "upper bound in minutes." },
    { name: "step", type: "number", default: "5", description: "amount the steppers and arrow keys move by." },
    { name: "unit", type: "string", default: "'min'", description: "unit shown after the custom value." },
    { name: "label", type: "ReactNode", default: "'interval'", description: "group caption; pass null to drop it." },
    { name: "disabled", type: "boolean", default: "false" },
    { name: "ariaLabel", type: "string", description: "accessible name for the preset group." },
    { name: "className", type: "string" },
  ],
});
