import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "timer-ring",
  type: "registry:ui",
  description:
    "circular progress ring driven by stroke-dasharray. takes a value/max pair, or an endsAt deadline it counts down to on its own clock, with the remaining time in the center.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [{ source: "timer-ring.tsx", target: "timer-ring.tsx" }],
  props: [
    { name: "value", type: "number", default: "0", description: "determinate value; ignored in countdown mode." },
    { name: "max", type: "number", default: "100", description: "upper bound for value." },
    {
      name: "endsAt",
      type: "number | Date",
      description: "countdown target. setting it makes the ring tick itself once a second.",
    },
    {
      name: "startedAt",
      type: "number | Date",
      default: "mount time",
      description: "the 0% anchor for a countdown; given only endsAt, the ring starts empty at mount.",
    },
    { name: "size", type: "number", default: "128", description: "outer edge in px." },
    { name: "thickness", type: "number", default: "2", description: "stroke width in px." },
    { name: "accent", type: "string", default: "'#fff'", description: "css color for the progress arc." },
    {
      name: "label",
      type: "ReactNode",
      description: "center slot. defaults to the remaining time (countdown) or a percentage; pass null for a bare ring.",
    },
    { name: "onComplete", type: "() => void", description: "fired once when a countdown reaches endsAt; re-arms if endsAt changes." },
    { name: "direction", type: "'fill' | 'drain'", default: "'fill'", description: "'drain' empties the arc as time runs out." },
    { name: "ariaLabel", type: "string" },
    { name: "className", type: "string" },
  ],
});
