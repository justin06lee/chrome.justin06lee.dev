import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "availability-grid",
  type: "registry:ui",
  description:
    "the weekly \"when am i free\" editor: a switch per day plus any number of time windows, with copy-to-open-days. inverted and overlapping windows are flagged inline and never silently corrected — rewriting what someone typed is how you ship a schedule they didn't ask for. exports isAvailabilityValid for the save button.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [{ source: "availability-grid.tsx", target: "availability-grid.tsx" }],
  props: [
    {
      name: "value",
      type: "AvailabilityRange[]",
      required: true,
      description: "{ weekday (0=sunday), startMin, endMin } in minutes past midnight.",
    },
    { name: "onChange", type: "(ranges: AvailabilityRange[]) => void", required: true },
    { name: "dayLabels", type: "string[]", default: "['sunday', …, 'saturday']", description: "index-aligned to weekday." },
    { name: "weekOrder", type: "number[]", default: "[1,2,3,4,5,6,0]", description: "row order; defaults to monday-first." },
    {
      name: "defaultRange",
      type: "{ startMin: number; endMin: number }",
      default: "{ 540, 1020 }",
      description: "window added when a closed day is switched on.",
    },
    { name: "stepMin", type: "number", default: "15", description: "granularity of the time inputs." },
    { name: "disabled", type: "boolean", default: "false" },
    { name: "className", type: "string" },
  ],
});
