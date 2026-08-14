import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "sound-bars",
  type: "registry:ui",
  description:
    "the little dancing meter that marks the row currently playing. pure css, no state — each bar's period and phase come from its index, so the pattern is identical on the server and the client. paused and reduced-motion hold resting heights rather than flattening.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [{ source: "sound-bars.tsx", target: "sound-bars.tsx" }],
  props: [
    { name: "bars", type: "number", default: "4", description: "how many bars (1–12)." },
    { name: "paused", type: "boolean", default: "false", description: "freeze the bars low." },
    { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'" },
    { name: "accent", type: "string", default: "'currentColor'", description: "css color of the bars; inherits the row it sits in by default." },
    { name: "speed", type: "number", default: "1.1", description: "seconds for one full cycle of the slowest bar." },
    { name: "label", type: "string | null", default: "'playing'", description: "screen-reader text; null when an adjacent label already says it." },
    { name: "className", type: "string" },
  ],
});
