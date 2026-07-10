import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "timeline",
  type: "registry:ui",
  description:
    "day schedule — a 24h vertical axis with positioned event blocks and an optional live now-line. blocks placed by minutes-of-day. generalized from the justin06lee.dev day view.",
  registryDependencies: ["utils"],
  files: [{ source: "timeline.tsx", target: "timeline.tsx" }],
  props: [
    { name: "events", type: "TimelineEvent[]", required: true, description: "{ startMin, endMin, label?, color? }[]" },
    { name: "showNow", type: "boolean", description: "live red now-line, ticks each minute." },
    { name: "nowMinutes", type: "number", description: "override now-line position (minutes of day)." },
    {
      name: "markers",
      type: "Array<{ minutes: number; label: string; color?: string }>",
      description: "labeled full-width marker lines at minutes-of-day (e.g. prayer times), label at the right edge.",
    },
  ],
});
