import { defineComponent } from "../../../../src/define";
export default defineComponent({
  name: "button",
  type: "registry:ui",
  files: [{ source: "button.tsx", target: "button.tsx" }],
  registryDependencies: ["utils"],
});
