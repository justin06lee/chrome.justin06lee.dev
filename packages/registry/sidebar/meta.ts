import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "sidebar",
  type: "registry:ui",
  description:
    "grouped docs sidebar with active-item highlighting and an optional search filter. framework-agnostic links via linkComponent.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [{ source: "sidebar.tsx", target: "sidebar.tsx" }],
  props: [
    { name: "groups", type: "SidebarGroup[]", description: "{ label, items: { label, href }[] }[] — the nav sections." },
    { name: "activeHref", type: "string", description: "href of the current page; the exact-matching item gets the active treatment." },
    { name: "searchable", type: "boolean", default: "false", description: "renders a search input above the groups that filters items by label." },
    { name: "searchPlaceholder", type: "string", default: "'search…'", description: "placeholder for the search input." },
    { name: "linkComponent", type: "React.ElementType", default: "'a'", description: "anchor element/component for items — pass your router's Link." },
    { name: "className", type: "string", description: "extra classes on the root <aside>." },
  ],
});
