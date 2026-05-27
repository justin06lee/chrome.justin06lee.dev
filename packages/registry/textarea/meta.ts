import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "textarea",
  type: "registry:ui",
  description: "minimal multiline input. matches input — thin border, square corners, vertical resize.",
  registryDependencies: ["utils"],
  files: [{ source: "textarea.tsx", target: "textarea.tsx" }],
  props: [
    { name: "rows", type: "number", default: "4" },
    { name: "background", type: "string", description: "CSS background. transparent by default." },
    { name: "...props", type: "TextareaHTMLAttributes", description: "all native textarea attributes." },
  ],
});
