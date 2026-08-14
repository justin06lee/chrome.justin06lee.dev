import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "vinyl",
  type: "registry:ui",
  description:
    "a record on a platter — grooves as one repeating-radial-gradient, album art in the centre label, optional tonearm. pausing sets animation-play-state so the record holds where it stopped instead of snapping to twelve o'clock. round on purpose: it's the object, not a corner radius.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [{ source: "vinyl.tsx", target: "vinyl.tsx" }],
  props: [
    { name: "src", type: "string", description: "art for the centre label; without it the label is a plain disc." },
    { name: "alt", type: "string", default: "''" },
    { name: "size", type: "number", default: "160", description: "diameter in px." },
    { name: "spinning", type: "boolean", default: "true" },
    { name: "period", type: "number", default: "4", description: "seconds per revolution." },
    { name: "arm", type: "boolean", default: "false", description: "drop the tonearm onto the record." },
    { name: "labelRatio", type: "number", default: "0.36", description: "label diameter as a fraction of the record." },
    { name: "className", type: "string" },
  ],
});
