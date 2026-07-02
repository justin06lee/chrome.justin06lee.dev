import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "breadcrumb",
  type: "registry:ui",
  description:
    "presentational breadcrumb trail from caller-supplied items; the last crumb renders as the current page (muted, no link). plain <a> links, dark-only. ships a crumbsFromPath helper that splits a pathname into crumbs (decode + dash→space).",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [{ source: "breadcrumb.tsx", target: "breadcrumb.tsx" }],
  props: [
    { name: "items", type: "Crumb[]", required: true, description: "{ label, href? }[], root first. last is the current page." },
    { name: "separator", type: "ReactNode", default: "<ChevronRight />", description: "node placed between crumbs." },
    { name: "homeHref", type: "string", description: "optional leading 'home' link prepended before items." },
    { name: "className", type: "string" },
  ],
});
