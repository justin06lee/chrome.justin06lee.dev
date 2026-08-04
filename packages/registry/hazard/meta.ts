import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "hazard",
  type: "registry:ui",
  description:
    "diagonal caution-stripe tape — a band that reads as a boundary rather than a border, plus a HazardFrame that tapes the edges of any block. hard-stop repeating gradients stay knife-sharp at any pitch, and the optional march animates by exactly one pitch so the loop is seamless.",
  registryDependencies: ["utils"],
  files: [{ source: "hazard.tsx", target: "hazard.tsx" }],
  props: [
    { name: "thickness", type: "number", default: "8", description: "band thickness in px." },
    { name: "pitch", type: "number", default: "12", description: "stripe pitch in px — one stripe plus one gap." },
    { name: "angle", type: "number", default: "45", description: "stripe angle in degrees." },
    { name: "color", type: "string", default: "'rgba(255,255,255,0.22)'" },
    { name: "gapColor", type: "string", default: "'transparent'", description: "colour between the stripes." },
    { name: "orientation", type: "'horizontal' | 'vertical'", default: "'horizontal'", description: "Hazard only." },
    { name: "animate", type: "boolean", default: "false", description: "march the stripes; frozen under reduced motion." },
    { name: "duration", type: "number", default: "1.2", description: "seconds for one full stripe cycle." },
    {
      name: "edges",
      type: "('top' | 'right' | 'bottom' | 'left')[]",
      default: "['top', 'bottom']",
      description: "HazardFrame only — which sides get taped.",
    },
    { name: "className", type: "string" },
  ],
});
