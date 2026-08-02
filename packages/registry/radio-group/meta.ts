import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "radio-group",
  type: "registry:ui",
  description:
    "single-choice group with a proper roving tabindex — arrows move focus and selection, wrap at the ends and skip disabled options, and the group is one tab stop. \"cards\" variant adds a description line and a trailing meta slot for choosing between things rather than values.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [{ source: "radio-group.tsx", target: "radio-group.tsx" }],
  props: [
    { name: "value", type: "T | null", required: true, description: "selected value; null for nothing chosen." },
    { name: "onChange", type: "(value: T) => void", required: true },
    {
      name: "options",
      type: "RadioOption<T>[]",
      required: true,
      description:
        "{ value, label, description?, meta?, disabled? }. description and meta render in the \"cards\" variant only.",
    },
    { name: "label", type: "ReactNode", description: "mono uppercase caption above the group." },
    { name: "variant", type: "'list' | 'cards'", default: "'list'", description: "'cards' pads the rows out and shows description/meta." },
    { name: "orientation", type: "'vertical' | 'horizontal'", default: "'vertical'" },
    { name: "ariaLabel", type: "string", description: "accessible name when there is no visible label." },
    { name: "disabled", type: "boolean", default: "false", description: "disables every option." },
    { name: "className", type: "string" },
  ],
});
