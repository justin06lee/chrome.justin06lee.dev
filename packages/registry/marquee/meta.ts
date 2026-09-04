import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "marquee",
  type: "registry:ui",
  description:
    "infinite scrolling band, for a ticker or a row of pieces. speed is px/s and the duration is derived from the measured content width, so a short label and a long sentence travel at the same rate. the copy count is computed from the container width rather than hardcoded, so narrow content never leaves a hole. only the first copy is real to assistive tech and the keyboard (repeats are aria-hidden and inert), it pauses on hover and on focus-within so a link you tabbed to holds still, and under reduced motion it becomes a plain horizontal scroller of one copy so nothing past the edge is lost.",
  registryDependencies: ["utils"],
  files: [{ source: "marquee.tsx", target: "marquee.tsx" }],
  props: [
    { name: "children", type: "ReactNode", required: true },
    { name: "speed", type: "number", default: "40", description: "px per second." },
    { name: "reverse", type: "boolean", default: "false", description: "scroll right instead of left." },
    { name: "gap", type: "number", default: "32", description: "gap between repeats, in px." },
    { name: "separator", type: "ReactNode", description: "node rendered between repeats — a bullet, a slash, a stripe." },
    { name: "pauseOnHover", type: "boolean", default: "true", description: "halt while the pointer is over the band, or anything inside it has focus." },
    { name: "fade", type: "boolean", default: "false", description: "mask the left and right edges." },
    { name: "ariaLabel", type: "string", description: "accessible name (role=\"region\") when the band carries content worth naming." },
    { name: "className", type: "string" },
  ],
});
