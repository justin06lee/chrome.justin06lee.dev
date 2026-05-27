import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "navbar",
  type: "registry:ui",
  description:
    "fixed top nav with inline desktop links and a hamburger-driven slide-in panel below md. routes are caller-supplied; behavior split into a headless useNavbar hook.",
  dependencies: ["lucide-react", "motion"],
  registryDependencies: ["utils"],
  files: [
    // Styled component first so the docs source view shows it (page reads files[0]).
    { source: "navbar.tsx", target: "navbar.tsx" },
    { source: "use-navbar.ts", target: "use-navbar.ts", type: "registry:hook" },
  ],
  props: [
    { name: "brand", type: "ReactNode", description: "left-side logo / name." },
    { name: "links", type: "NavLink[]", description: "{ label, href }[] — plain anchors." },
    { name: "actions", type: "ReactNode", description: "right-side desktop extras." },
    { name: "menuLabel", type: "string", default: "'menu'", description: "heading atop the mobile panel." },
  ],
});
