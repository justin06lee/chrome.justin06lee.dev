import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "pencil-rule",
  type: "registry:ui",
  description:
    "a rule that draws itself with a pencil riding the leading edge. the stroke is a scaled element rather than an animated width, so it composites and never causes layout; the pencil shares the stroke's timing function, which is what keeps the nib pinned to the end of the line. draws on scroll-into-view by default. under reduced motion the finished rule renders immediately and the pencil never appears.",
  registryDependencies: ["utils"],
  files: [{ source: "pencil-rule.tsx", target: "pencil-rule.tsx" }],
  props: [
    { name: "duration", type: "number", default: "1.2", description: "seconds to cross the full width." },
    { name: "delay", type: "number", default: "0" },
    { name: "trigger", type: "'in-view' | 'mount'", default: "'in-view'" },
    { name: "repeat", type: "boolean", default: "false", description: "redraw every time it re-enters the viewport." },
    { name: "thickness", type: "number", default: "1", description: "line thickness in px." },
    { name: "color", type: "string", default: "'rgba(255,255,255,0.35)'" },
    { name: "pencilColor", type: "string", default: "'rgba(255,255,255,0.75)'" },
    { name: "showPencil", type: "boolean", default: "true", description: "false draws the line alone." },
    { name: "className", type: "string" },
  ],
});
