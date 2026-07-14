import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "gallery",
  type: "registry:ui",
  description:
    "searchable, filterable, sortable project card grid with chrome-foiled pinned markers, tech chips, and repo/live links. composes card, badge, menu, and chrome.",
  dependencies: ["lucide-react", "motion"],
  registryDependencies: ["utils", "card", "badge", "menu", "chrome"],
  files: [{ source: "gallery.tsx", target: "gallery.tsx" }],
  props: [
    { name: "title", type: "string", required: true, description: "heading shown above the grid." },
    {
      name: "subtitle",
      type: "string",
      default: "'A curated list of things I've built or explored.'",
      description: "muted line under the title.",
    },
    {
      name: "items",
      type: "GalleryItem[]",
      default: "[]",
      description:
        "the cards to render: { id, title, link?, description, year, tech[], repo?, live?, notes?, pinned? }[].",
    },
    {
      name: "initialSort",
      type: "'newest' | 'oldest' | 'az' | 'za'",
      default: "'newest'",
      description: "starting sort order; pinned items always sort first.",
    },
    {
      name: "chipBase",
      type: "number",
      default: "0.4",
      description: "base entrance-animation delay (seconds) before the first staggered element.",
    },
    {
      name: "chipStep",
      type: "number",
      default: "0.1",
      description: "per-element stagger step (seconds) for the entrance animation.",
    },
    { name: "className", type: "string", description: "overrides on the root element." },
  ],
});
