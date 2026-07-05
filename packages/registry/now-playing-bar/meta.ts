import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "now-playing-bar",
  type: "registry:ui",
  description:
    "sticky bottom bar for a currently-running activity: a live elapsed timer that ticks every second, a left accent color/dot, and a right-side action slot. all data is prop/callback driven — no backend coupling. omit startedAt for an idle state. dark-only.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [{ source: "now-playing-bar.tsx", target: "now-playing-bar.tsx" }],
  props: [
    { name: "title", type: "ReactNode", required: true },
    {
      name: "startedAt",
      type: "number | Date",
      description: "when set, shows a live elapsed timer ticking every second; omit for the idle state.",
    },
    { name: "accent", type: "string", description: "css color for the left accent bar + dot." },
    { name: "subtitle", type: "ReactNode" },
    { name: "actions", type: "ReactNode", description: "right-side slot, e.g. a Stop button." },
    { name: "onClick", type: "() => void" },
    { name: "visible", type: "boolean", default: "true", description: "hide the bar and tear down the timer." },
    { name: "position", type: "'fixed' | 'sticky'", default: "'fixed'" },
    { name: "className", type: "string" },
  ],
});
