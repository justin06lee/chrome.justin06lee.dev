import { defineComponent } from "chrome-ui-registry-builder";
export default defineComponent({
  name: "socials",
  type: "registry:ui",
  description: "social-link bar with tooltip + email-copy support.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [{ source: "socials.tsx", target: "socials.tsx" }],
});
