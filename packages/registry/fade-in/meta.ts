import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "fade-in",
  type: "registry:ui",
  description:
    "fade + translate a node in on mount. pure css keyframe with per-instance delay/offset; stagger a list via the staggerDelay helper. honors prefers-reduced-motion.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [{ source: "fade-in.tsx", target: "fade-in.tsx" }],
  cssFile: "fade-in.css",
  props: [
    { name: "as", type: "ElementType", default: "'div'", description: "element/component to render." },
    { name: "delay", type: "number", default: "0", description: "delay before the animation starts, in seconds." },
    { name: "y", type: "number", default: "-10", description: "starting vertical offset in px (animates to 0)." },
    { name: "x", type: "number", default: "0", description: "starting horizontal offset in px (animates to 0)." },
    { name: "duration", type: "number", default: "0.4", description: "animation duration in seconds." },
    { name: "once", type: "boolean", default: "true", description: "animate once on mount." },
    { name: "className", type: "string" },
    { name: "children", type: "ReactNode" },
  ],
});
