import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "scramble",
  type: "registry:ui",
  description: "per-character text scramble effect on hover.",
  files: [{ source: "scramble.tsx", target: "scramble.tsx" }],
  props: [
    { name: "text", type: "string", required: true },
    { name: "speed", type: "number", default: "30", description: "ms between scramble frames" },
    { name: "step", type: "number", default: "1/3", description: "chars to lock per frame" },
  ],
});
