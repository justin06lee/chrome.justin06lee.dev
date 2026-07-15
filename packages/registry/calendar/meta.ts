import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "calendar",
  type: "registry:ui",
  description:
    "month date grid with selectable days, today ring, and prev/next header. pass renderDay to layer dots or counts onto cells, or renderCell + cellClassName to take over cells for agenda-style month views.",
  registryDependencies: ["utils"],
  files: [{ source: "calendar.tsx", target: "calendar.tsx" }],
  props: [
    { name: "month", type: "string", required: true, description: '"YYYY-MM" displayed month.' },
    { name: "onMonthChange", type: "(month: string) => void", description: "enables prev/next." },
    { name: "selected", type: "string | null", description: '"YYYY-MM-DD".' },
    { name: "onSelect", type: "(date: string) => void" },
    { name: "today", type: "string", description: '"YYYY-MM-DD" to ring.' },
    { name: "renderDay", type: "(date: string) => ReactNode", description: "extra cell content under the day number." },
    {
      name: "renderCell",
      type: "(day: CalendarDay) => ReactNode",
      description:
        "replace the whole cell (day number included) for rich month grids. day = { date, day, isToday, isSelected }. days stay buttons when onSelect is set, otherwise plain divs so hosts can embed links.",
    },
    {
      name: "cellClassName",
      type: "string | ((day: CalendarDay) => string)",
      description: "per-cell classes — heatmap tint, min-height. works in both modes.",
    },
  ],
});
