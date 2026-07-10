import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "tilt",
  type: "registry:ui",
  description: "3d perspective tilt card with sweeping shine on hover.",
  registryDependencies: ["utils"],
  files: [{ source: "tilt.tsx", target: "tilt.tsx" }],
  props: [
    { name: "rotate", type: "number", default: "14", description: "tilt angle in degrees" },
    { name: "shine", type: "boolean", default: "true" },
    { name: "duration", type: "number", default: "900", description: "shine duration in ms" },
    { name: "children", type: "ReactNode", required: true },
    {
      name: "background",
      type: "string",
      description: "CSS background applied to the root element. transparent by default.",
    },
  ],
});
