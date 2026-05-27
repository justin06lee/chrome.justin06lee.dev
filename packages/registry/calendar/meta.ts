import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "calendar",
  type: "registry:ui",
  description:
    "month date grid — selectable days, today ring, prev/next header, Sunday-aligned. pass renderDay to layer dots or counts onto cells. generalized from the justin06lee.dev calendar.",
  registryDependencies: ["utils"],
  files: [{ source: "calendar.tsx", target: "calendar.tsx" }],
  props: [
    { name: "month", type: "string", required: true, description: '"YYYY-MM" displayed month.' },
    { name: "onMonthChange", type: "(month: string) => void", description: "enables prev/next." },
    { name: "selected", type: "string | null", description: '"YYYY-MM-DD".' },
    { name: "onSelect", type: "(date: string) => void" },
    { name: "today", type: "string", description: '"YYYY-MM-DD" to ring.' },
    { name: "renderDay", type: "(date: string) => ReactNode", description: "extra cell content." },
  ],
});
