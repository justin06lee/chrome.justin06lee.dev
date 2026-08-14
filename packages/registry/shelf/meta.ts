import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "shelf",
  type: "registry:ui",
  description:
    "horizontally scrolling row of cards — the browsable counterpart to gallery's searchable grid. arrows appear only once the row genuinely overflows (measured, not assumed) and disable at their end; scrolling stays native, so trackpad, touch and keyboard all work untouched.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [{ source: "shelf.tsx", target: "shelf.tsx" }],
  props: [
    { name: "children", type: "ReactNode", required: true, description: "the cards; each is given itemWidth and made unshrinkable." },
    { name: "title", type: "ReactNode", description: "mono uppercase heading above the row." },
    { name: "action", type: "ReactNode", description: "right-hand slot on the title line — a 'see all' link, a count." },
    { name: "itemWidth", type: "number", default: "176", description: "width of each item in px." },
    { name: "gap", type: "number", default: "16" },
    { name: "arrows", type: "boolean", default: "true", description: "paging buttons, shown only when the row overflows." },
    { name: "snap", type: "boolean", default: "true", description: "snap each item to the left edge as you scroll." },
    { name: "ariaLabel", type: "string", description: "accessible name for the scroll region; falls back to title when it's a string." },
    { name: "className", type: "string" },
  ],
});
