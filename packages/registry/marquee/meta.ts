import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "marquee",
  type: "registry:ui",
  description:
    "infinite scrolling ticker band. speed is px/s and the duration is derived from the measured content width, so a short label and a long sentence travel at the same rate. the copy count is computed from the container width rather than hardcoded, so narrow content never leaves a hole. static under reduced motion.",
  registryDependencies: ["utils"],
  files: [{ source: "marquee.tsx", target: "marquee.tsx" }],
  props: [
    { name: "children", type: "ReactNode", required: true },
    { name: "speed", type: "number", default: "40", description: "px per second." },
    { name: "reverse", type: "boolean", default: "false", description: "scroll right instead of left." },
    { name: "gap", type: "number", default: "32", description: "gap between repeats, in px." },
    { name: "separator", type: "ReactNode", description: "node rendered between repeats — a bullet, a slash, a stripe." },
    { name: "pauseOnHover", type: "boolean", default: "true" },
    { name: "fade", type: "boolean", default: "false", description: "mask the left and right edges." },
    { name: "className", type: "string" },
  ],
});
