import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "toc",
  type: "registry:ui",
  description:
    "sticky table-of-contents with scroll-spy highlighting via IntersectionObserver. give it the page headings; the active row tracks scroll. behavior split into a headless useToc hook.",
  registryDependencies: ["utils"],
  files: [
    { source: "toc.tsx", target: "toc.tsx" },
    { source: "use-toc.ts", target: "use-toc.ts", type: "registry:hook" },
  ],
  props: [
    { name: "headings", type: "TocHeading[]", required: true, description: "{ id, text }[] — ids must exist in the DOM." },
    { name: "label", type: "string", default: "'on this page'" },
    { name: "container", type: "RefObject<HTMLElement | null>", description: "scrollable element the headings live in. scroll-spy and click scrolling stay inside it; defaults to the document." },
  ],
});
