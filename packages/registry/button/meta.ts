import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "button",
  type: "registry:ui",
  description: "a button. clicks like a button.",
  registryDependencies: ["utils"],
  files: [{ source: "button.tsx", target: "button.tsx" }],
  props: [
    { name: "variant", type: "'default' | 'ghost'", default: "'default'" },
    { name: "size", type: "'sm' | 'md'", default: "'md'" },
  ],
});
