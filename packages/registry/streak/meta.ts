import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "streak",
  type: "registry:ui",
  description:
    "streak indicator — the current unbroken run, an optional all-time best, and a compact strip of recent hit/miss day cells so a near-miss stays visible. one sr-only sentence carries the whole thing to screen readers.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [{ source: "streak.tsx", target: "streak.tsx" }],
  props: [
    { name: "current", type: "number", required: true, description: "days (or whatever unit is) in the current unbroken run." },
    { name: "best", type: "number", description: "all-time best run, rendered as a quiet comparison." },
    { name: "days", type: "boolean[]", description: "recent history, most recent LAST — one cell per entry, true = hit." },
    { name: "label", type: "ReactNode", default: "'streak'", description: "mono uppercase kicker." },
    { name: "unit", type: "string", default: "'day'", description: "singular noun for the run; an \"s\" is appended when current isn't 1." },
    { name: "className", type: "string" },
  ],
});
