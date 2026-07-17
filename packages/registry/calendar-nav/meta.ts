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
    {
      name: "linkComponent",
      type: "React.ElementType",
      description:
        "pass your router's Link (e.g. next/link) to render prev/next/today + the view switcher as prefetched client-side links instead of callback buttons — much faster period-switching on server-rendered (force-dynamic) routes. Provide the *Href props too.",
    },
    { name: "prevHref", type: "string", description: "href for the previous period (with linkComponent)." },
    { name: "nextHref", type: "string", description: "href for the next period." },
    { name: "todayHref", type: "string", description: "href for the current period." },
    { name: "viewHref", type: "(view: CalendarView) => string", description: "maps a view to its href; each switcher segment becomes a prefetched link." },
    { name: "prefetch", type: "boolean", description: "forwarded to linkComponent (e.g. next/link's prefetch) for every control." },
    { name: "className", type: "string" },
  ],
});
