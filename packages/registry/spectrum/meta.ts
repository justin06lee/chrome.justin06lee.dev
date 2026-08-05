import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "spectrum",
  type: "registry:ui",
  description:
    "live frequency analyser off a web audio AnalyserNode (or any sample callback). canvas, logarithmically-spaced columns, instant attack and gradual decay so it reads as loudness instead of strobing. waveform is the static counterpart — a shape that never repaints.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [{ source: "spectrum.tsx", target: "spectrum.tsx" }],
  props: [
    { name: "analyser", type: "AnalyserNode", description: "web audio analyser to read; create it once and hand it over, the component only reads." },
    { name: "sample", type: "(time: number) => number[]", description: "escape hatch for anything that isn't a web audio graph — return `bars` magnitudes in 0–1 per frame. ignored when analyser is set." },
    { name: "bars", type: "number", default: "40", description: "column count." },
    { name: "height", type: "number", default: "64" },
    { name: "barWidth", type: "number", default: "6", description: "widest a column may get; columns flex to fill." },
    { name: "gap", type: "number", default: "2" },
    { name: "accent", type: "string", default: "'#fff'" },
    { name: "mirror", type: "boolean", default: "false", description: "mirror the columns around the centre line." },
    { name: "decay", type: "number", default: "0.12", description: "fall speed per frame, 0–1. lower falls slower." },
    { name: "peakHold", type: "boolean", default: "true", description: "hold a thin cap at each column's recent maximum." },
    { name: "paused", type: "boolean", default: "false", description: "stop reading and let the columns settle to the floor." },
    { name: "ariaLabel", type: "string", default: "'audio spectrum'" },
    { name: "className", type: "string" },
  ],
});
