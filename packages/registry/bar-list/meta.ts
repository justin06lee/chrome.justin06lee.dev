import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "bar-list",
  type: "registry:ui",
  description:
    "ranked horizontal bar list — each row's proportional bar is the row's own background, with the label on the left and the value right-aligned. rows can link out or fire a click handler; per-item colors are opt-in and tinted back so labels stay legible.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [{ source: "bar-list.tsx", target: "bar-list.tsx" }],
  props: [
    { name: "items", type: "BarListItem[]", required: true, description: "rows in render order. BarListItem is { id?, label, value, color?, href? }. sort before passing — limit keeps the first N, not the largest N." },
    { name: "max", type: "number", description: "bar scale ceiling; defaults to the largest value present." },
    { name: "formatValue", type: "(value: number) => string", default: "String", description: "value formatter for the right column." },
    { name: "showValue", type: "boolean", default: "true", description: "show the value column; when false it stays available to screen readers." },
    { name: "limit", type: "number", description: "render at most this many rows." },
    { name: "onItemClick", type: "(item: BarListItem) => void", description: "makes rows buttons; ignored on rows that carry an href." },
    { name: "linkComponent", type: "React.ElementType", default: "'a'", description: "anchor element/component for rows with an href — pass your router's Link." },
    { name: "className", type: "string" },
  ],
});
