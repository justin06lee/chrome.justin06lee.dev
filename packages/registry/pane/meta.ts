import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "pane",
  type: "registry:ui",
  description:
    "a window onto content taller than the room you want to give it: the pane scrolls, not the page. what a section becomes when it would otherwise push everything below it off the end of the document — a growing wall of images, a long log, a list with no natural end. it isn't `shelf` (the horizontal errand: a row of cards you skim, sized by the shelf and paged by arrows) — a pane keeps its content exactly as given and only bounds how much of it you see. the thin scrollbar is on by default and is the affordance, written against a class so it survives an app-wide `*::-webkit-scrollbar { display: none }`; scroll chaining is deliberately left alone so the page keeps moving at the end of the pane; the edge is faded only where the content actually continues, measured with a ResizeObserver, and the pane is a tab stop only while it overflows.",
  registryDependencies: ["utils"],
  files: [{ source: "pane.tsx", target: "pane.tsx" }],
  props: [
    { name: "children", type: "ReactNode", required: true },
    {
      name: "maxHeight",
      type: "string",
      default: "'70vh'",
      description: "tallest the pane may grow, as any CSS length; shorter content is left alone and does not scroll.",
    },
    {
      name: "scrollbar",
      type: "boolean",
      default: "true",
      description: "show a thin scrollbar. off leaves the pane scrollable but unmarked.",
    },
    { name: "ariaLabel", type: "string", description: "accessible name; given one, the pane becomes a named region." },
    { name: "className", type: "string" },
  ],
});
