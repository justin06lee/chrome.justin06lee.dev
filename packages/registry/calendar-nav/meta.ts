import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "calendar-nav",
  type: "registry:ui",
  description:
    "period-navigation header: a day/month/year switcher plus prev / today / next controls. fully controlled, no router coupling.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils", "segmented", "button"],
  files: [{ source: "calendar-nav.tsx", target: "calendar-nav.tsx" }],
  props: [
    { name: "label", type: "ReactNode", required: true, description: "the current period label, e.g. \"June 2026\"." },
    { name: "view", type: "'day' | 'month' | 'year'", description: "controlled active view." },
    { name: "views", type: "CalendarView[]", default: "['day', 'month', 'year']", description: "switcher hidden when fewer than 2." },
    { name: "onViewChange", type: "(view: CalendarView) => void" },
    { name: "onPrev", type: "() => void" },
    { name: "onNext", type: "() => void" },
    { name: "onToday", type: "() => void" },
    { name: "todayLabel", type: "ReactNode", default: "'today'" },
    { name: "className", type: "string" },
  ],
});
