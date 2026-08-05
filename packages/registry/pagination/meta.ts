import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "pagination",
  type: "registry:ui",
  description:
    "page navigation with boundary pages, a sibling window and ellipsis gaps, plus a compact prev/next variant. the window shifts rather than shrinking at the ends, so the control keeps a constant width as you page through it, and a gap that would elide exactly one page renders that page instead. the range logic ships as a separate tested module.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [
    { source: "pagination.tsx", target: "pagination.tsx" },
    { source: "pagination-range.ts", target: "pagination-range.ts" },
  ],
  props: [
    { name: "page", type: "number", required: true, description: "current page, 1-based." },
    { name: "pageCount", type: "number", required: true, description: "total pages; 1 or fewer renders nothing." },
    { name: "onChange", type: "(page: number) => void", required: true },
    { name: "siblings", type: "number", default: "1", description: "pages shown either side of the current one." },
    { name: "boundaries", type: "number", default: "1", description: "pages pinned at each end." },
    { name: "compact", type: "boolean", default: "false", description: "prev/next with a '3 / 12' readout instead of numbers." },
    { name: "ariaLabel", type: "string", default: "'pagination'" },
    { name: "className", type: "string" },
  ],
});
