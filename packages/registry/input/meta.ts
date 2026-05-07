import { defineComponent } from "chrome-ui-registry-builder";
export default defineComponent({
  name: "input",
  type: "registry:ui",
  description: "minimal text input. thin border, no corners.",
  registryDependencies: ["utils"],
  files: [{ source: "input.tsx", target: "input.tsx" }],
});
