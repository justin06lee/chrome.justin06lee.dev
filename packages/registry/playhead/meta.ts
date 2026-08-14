import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "playhead",
  type: "registry:ui",
  description:
    "playback scrubber with elapsed / total times, drag-and-key seeking, and a clock of its own — give it startedAt and it extrapolates between polls, so a remotely-sourced position moves smoothly instead of stepping. progress covers a bare determinate bar; this one knows about time.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [
    // Styled component first so the docs source view shows it (page reads files[0]).
    { source: "playhead.tsx", target: "playhead.tsx" },
    { source: "use-playback-clock.ts", target: "use-playback-clock.ts", type: "registry:hook" },
  ],
  props: [
    { name: "position", type: "number", required: true, description: "last known position in seconds." },
    { name: "duration", type: "number", required: true, description: "track length in seconds." },
    {
      name: "startedAt",
      type: "number | Date",
      description:
        "wall-clock ms at which position was true. supply it and the bar advances on its own between updates.",
    },
    { name: "playing", type: "boolean", default: "true", description: "advance only while true." },
    { name: "buffered", type: "number", description: "seconds buffered ahead, drawn as a fainter fill under the played one." },
    {
      name: "onSeek",
      type: "(seconds: number) => void",
      description: "makes the bar seekable — click, drag, arrows (±5s), page keys (±30s), home/end.",
    },
    { name: "size", type: "'sm' | 'md'", default: "'sm'", description: "track height." },
    { name: "showTimes", type: "boolean", default: "true" },
    { name: "remaining", type: "boolean", default: "false", description: "count the right label down (-1:23) instead of showing the total." },
    { name: "accent", type: "string", default: "'#fff'", description: "css color of the played portion." },
    { name: "ariaLabel", type: "string", default: "'seek'" },
    { name: "className", type: "string" },
  ],
});
