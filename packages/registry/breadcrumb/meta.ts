import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "breadcrumb",
  type: "registry:ui",
  description:
    "breadcrumb trail from caller-supplied items; the last crumb is the muted current page. framework-agnostic links via linkComponent. ships a crumbsFromPath helper.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [{ source: "breadcrumb.tsx", target: "breadcrumb.tsx" }],
  props: [
    { name: "items", type: "Crumb[]", required: true, description: "{ label, href? }[], root first. last is the current page." },
    { name: "separator", type: "ReactNode", default: "<ChevronRight />", description: "node placed between crumbs." },
    { name: "homeHref", type: "string", description: "optional leading 'home' link prepended before items." },
    { name: "linkComponent", type: "React.ElementType", default: "'a'", description: "anchor element/component for crumb links — pass your router's Link." },
    { name: "className", type: "string" },
  ],
});
