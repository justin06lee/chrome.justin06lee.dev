import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "detail-list",
  type: "registry:ui",
  description:
    "label/value metadata as a real <dl>, in row, two-column grid or stacked layouts. for the handful of unrelated facts about one thing — the case stat-tile (one number) and manager-table (many identical rows) both miss. server-renderable.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [{ source: "detail-list.tsx", target: "detail-list.tsx" }],
  props: [
    {
      name: "items",
      type: "DetailItem[]",
      required: true,
      description: "{ label, value, icon?, note?, wide? }. wide spans both columns in the grid layout.",
    },
    {
      name: "layout",
      type: "'rows' | 'grid' | 'stacked'",
      default: "'rows'",
      description:
        "'rows' is label left / value right on one line; 'grid' is a two-column card of label-over-value cells; 'stacked' is a single column of them.",
    },
    { name: "divided", type: "boolean", default: "true", description: "hairlines between rows; only meaningful for 'rows'." },
    { name: "dense", type: "boolean", default: "false", description: "tightens the row padding." },
    { name: "className", type: "string" },
  ],
});
