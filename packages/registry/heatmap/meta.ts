import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "heatmap",
  type: "registry:ui",
  description:
    "year activity grid — 12 mini month grids of day cells tinted by value (contribution-graph style), with a less-to-more legend. generalized from the justin06lee.dev year view.",
  registryDependencies: ["utils"],
  files: [{ source: "heatmap.tsx", target: "heatmap.tsx" }],
  props: [
    { name: "values", type: "Record<string, number>", required: true, description: 'value per "YYYY-MM-DD".' },
    { name: "year", type: "number", required: true },
    { name: "levels", type: "number", default: "5", description: "intensity steps incl. empty." },
    { name: "max", type: "number", description: "bucketing cap; defaults to max value." },
    { name: "today", type: "string", description: '"YYYY-MM-DD" to ring.' },
    { name: "onSelectDay", type: "(date: string) => void", description: "makes cells clickable." },
    { name: "title", type: "(date: string, value: number) => string", description: "cell tooltip formatter." },
  ],
});
