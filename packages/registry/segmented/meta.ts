import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "segmented",
  type: "registry:ui",
  description: "controlled segmented control — a row of mutually exclusive options, active one bordered. compact uppercase variant for mode toggles.",
  registryDependencies: ["utils"],
  files: [{ source: "segmented.tsx", target: "segmented.tsx" }],
  props: [
    { name: "value", type: "T", required: true },
    { name: "onChange", type: "(value: T) => void", required: true },
    { name: "options", type: "SegmentedOption<T>[]", required: true, description: "{ value, label }[]" },
    { name: "size", type: "'default' | 'compact'", default: "'default'" },
  ],
});
