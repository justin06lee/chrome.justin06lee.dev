import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "live-badge",
  type: "registry:ui",
  description:
    "\"happening right now\" — a pulsing dot, a word, and an optional detail. badge says what a thing is; this says what it is doing at this second, across four fixed states, with role=status so going live is announced. the pulse is an expanding ring rather than a blinking dot, and drops out under reduced motion.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [{ source: "live-badge.tsx", target: "live-badge.tsx" }],
  props: [
    { name: "status", type: "'live' | 'connecting' | 'idle' | 'offline'", default: "'live'" },
    { name: "label", type: "ReactNode", description: "overrides the default word for the status." },
    { name: "detail", type: "ReactNode", description: "appended after a middot — a listener count, a bitrate, a room name." },
    { name: "size", type: "'sm' | 'md'", default: "'md'" },
    { name: "accent", type: "string", default: "'#fff'", description: "css color of the dot when live." },
    { name: "className", type: "string" },
  ],
});
