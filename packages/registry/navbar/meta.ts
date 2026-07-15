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
    {
      name: "leftLinks",
      type: "NavLink[]",
      description: "items next to the brand on desktop; listed before links in the mobile panel.",
    },
    {
      name: "links",
      type: "NavLink[]",
      description:
        "right-side items; listed after leftLinks in the mobile panel. NavLink = { label: ReactNode, href?, onClick?, id? } — omit href (with onClick) for a <button> item; id keys items when labels are nodes or hrefs repeat.",
    },
    { name: "actions", type: "ReactNode", description: "right-side desktop extras." },
    { name: "menuLabel", type: "string", default: "'menu'", description: "heading atop the mobile panel." },
  ],
});
