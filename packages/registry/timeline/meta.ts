import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "timeline",
  type: "registry:ui",
  description:
    "day schedule — a 24h vertical axis with positioned event blocks and an optional live now-line. blocks placed by minutes-of-day; supports clickable blocks, multiple labeled tracks on one axis, streamed marker slots, and opt-in drag editing. generalized from the justin06lee.dev day view.",
  registryDependencies: ["utils"],
  files: [{ source: "timeline.tsx", target: "timeline.tsx" }],
  props: [
    {
      name: "events",
      type: "TimelineEvent[]",
      description: "{ startMin, endMin, label?, color? }[] — single-track events. ignored when tracks is set.",
    },
    {
      name: "tracks",
      type: "TimelineTrack[]",
      description:
        "{ label?, events, onEventClick? }[] — N labeled columns side by side sharing one hour axis, grid, markers and now-line (e.g. plan vs actuals). per-track onEventClick overrides the top-level one.",
    },
    { name: "showNow", type: "boolean", description: "live red now-line, ticks each minute." },
    { name: "nowMinutes", type: "number", description: "override now-line position (minutes of day)." },
    {
      name: "markers",
      type: "Array<{ minutes: number; label: string; color?: string }>",
      description: "labeled full-width marker lines at minutes-of-day (e.g. prayer times), label at the right edge.",
    },
    {
      name: "markersSlot",
      type: "ReactNode",
      description:
        "react slot rendered in the marker layer, so markers can stream in — e.g. a <Suspense>-wrapped server component rendering the exported TimelineMarker primitive.",
    },
    {
      name: "onEventClick",
      type: "(event: TimelineEvent) => void",
      description:
        "when set, blocks render as keyboard-accessible buttons with a subtle hover ring and call this on click. display-only when absent.",
    },
    {
      name: "onEventChange",
      type: "(event, next: { startMin; endMin }) => void",
      description:
        "opt-in editing: blocks become drag-to-move with a bottom resize handle; called once on drop with the proposed times.",
    },
    { name: "snapMinutes", type: "number", description: "snap increment for drag editing. default 5." },
  ],
});
