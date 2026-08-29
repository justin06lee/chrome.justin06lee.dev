import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "navbar",
  type: "registry:ui",
  description:
    "fixed top nav with inline desktop links and a hamburger-driven slide-in panel below md. routes are caller-supplied; behavior split into a headless useNavbar hook. because it is position:fixed it owns its entrance animation via `entrance` — a transformed wrapper would become its containing block and render it at the wrapper's width.",
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
    {
      name: "linkComponent",
      type: "ElementType",
      default: "'a'",
      description:
        "anchor component for internal hrefs — pass your router's Link (e.g. next/link) for client-side navigation. external http(s) and '#' hrefs always render a plain <a>.",
    },
    {
      name: "entrance",
      type: "boolean | { y?: number; duration?: number; delay?: number }",
      description:
        "fade + slide the bar in on mount. true uses the house entrance (y: -10, 0.8s); an object tunes offset, duration and delay. use this rather than wrapping <Navbar> in an animating element — the nav is position:fixed, so a wrapper carrying a transform becomes its containing block and inset-x-0 resolves against the wrapper instead of the viewport. honors prefers-reduced-motion by fading without the travel.",
    },
    { name: "className", type: "string", description: "merges onto the <nav>; override `position` here to pin it inside a bounded frame." },
  ],
});
