import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "salon",
  type: "registry:ui",
  description:
    "a salon hang: a wall of images shown at their own aspect ratios, laid into ragged rows. every row sits at the target height (pieces keep their aspect, so widths vary) and wraps when the next piece would run past the container; rows are not stretched to a common width, so each ends at its own natural width — a ragged right edge — and one row's length never forces the others wider or narrower. the only piece ever resized is a lone one wider than the container, scaled down to fit; nothing is cropped. it isn't `gallery` (the uniform searchable card grid — every project the same card sized to a column), `shelf` (one horizontal scrolling row you skim), or `showcase` (a single framed preview): a salon keeps every piece's real proportions and makes the varied hang itself the point, so reach for it when the images are the content and their shapes carry meaning. the row-packing geometry ships as a separate tested module.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [
    { source: "salon.tsx", target: "salon.tsx" },
    { source: "salon-layout.ts", target: "salon-layout.ts" },
  ],
  props: [
    {
      name: "items",
      type: "SalonItem[]",
      required: true,
      description:
        "the pieces to hang, each at its own aspect ratio: { src?: string; width: number; height: number; href?: string; alt?: string; title?: ReactNode; external?: boolean }[]. width/height are intrinsic pixels that set the aspect ratio, not the render size; omit src to render a typographic placard in the slot; a title shows as a placard on hover/focus; external (or an http(s) href) opens in a new tab as a plain <a>.",
    },
    {
      name: "targetRowHeight",
      type: "number",
      default: "260",
      description: "height every row is laid at; pieces keep their aspect, so their widths vary.",
    },
    { name: "gap", type: "number", default: "12", description: "gap between pieces and rows in px." },
    {
      name: "maxWidth",
      type: "number",
      description: "container max width in px. unbounded by default (fills its parent).",
    },
    {
      name: "assumedWidth",
      type: "number",
      default: "1040",
      description: "assumed width for the first (server) render, before the container is measured.",
    },
    {
      name: "linkComponent",
      type: "React.ElementType",
      description:
        "router link for internal hrefs (e.g. next/link). defaults to a plain <a>; external hrefs always stay <a>.",
    },
    { name: "ariaLabel", type: "string", description: "accessible name for the wall region." },
    { name: "className", type: "string" },
  ],
});
