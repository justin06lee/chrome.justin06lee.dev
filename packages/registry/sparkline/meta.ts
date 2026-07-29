import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "sparkline",
  type: "registry:ui",
  description:
    "tiny inline svg trend line — 80x24 by default so it sits in a line of text. linear or catmull-rom smooth, optional area fill and square point markers, no chart library and no dependencies.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [{ source: "sparkline.tsx", target: "sparkline.tsx" }],
  props: [
    { name: "values", type: "number[]", required: true, description: "the series, oldest first. one value renders a flat line." },
    { name: "width", type: "number", default: "80", description: "intrinsic width in px (viewBox units; the svg still stretches to its css box)." },
    { name: "height", type: "number", default: "24", description: "intrinsic height in px." },
    { name: "stroke", type: "string", default: "'currentColor'", description: "line color; inherits the surrounding text by default." },
    { name: "strokeWidth", type: "number", default: "1.5", description: "line thickness in px, kept 1:1 under stretching." },
    { name: "fill", type: "string", description: "area fill under the line. omit for a bare line." },
    { name: "showDots", type: "boolean", default: "false", description: "mark every point with a small square." },
    { name: "highlightLast", type: "boolean", default: "false", description: "mark only the last point. ignored when showDots is set." },
    { name: "min", type: "number", description: "scale floor; defaults to the series minimum." },
    { name: "max", type: "number", description: "scale ceiling; defaults to the series maximum." },
    { name: "curve", type: '"linear" | "smooth"', default: "'linear'", description: "polyline, or a catmull-rom curve that still passes through every sample." },
    { name: "label", type: "string", description: "accessible name; a value-range summary is generated when omitted." },
    { name: "className", type: "string" },
  ],
});
