import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "waveform",
  type: "registry:ui",
  description:
    "a track's amplitude envelope with the played portion filled in, seekable by click. bars are elements rather than a canvas — crisp at every dpr, hoverable, and the fill is a css transition instead of a repaint loop. ships samplePeaks() to downsample raw pcm.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [{ source: "waveform.tsx", target: "waveform.tsx" }],
  props: [
    { name: "peaks", type: "number[]", required: true, description: "peak amplitudes 0–1, left to right; one entry per bar. samplePeaks() builds these from pcm." },
    { name: "progress", type: "number", default: "0", description: "how far through, 0–1." },
    { name: "onSeek", type: "(ratio: number) => void", description: "makes the waveform seekable; ratio is 0–1." },
    { name: "height", type: "number", default: "48", description: "height in px." },
    { name: "barWidth", type: "number", default: "3", description: "widest a bar may get; bars flex to fill the container up to this." },
    { name: "gap", type: "number", default: "2", description: "gap between bars in px." },
    { name: "mirror", type: "boolean", default: "false", description: "mirror each bar around the centre line instead of standing it on the floor." },
    { name: "accent", type: "string", default: "'#fff'", description: "css color of the played bars." },
    { name: "floor", type: "number", default: "0.06", description: "shortest bar as a fraction of the tallest, so silence still has a spine." },
    { name: "ariaLabel", type: "string", default: "'waveform'" },
    { name: "className", type: "string" },
  ],
});
