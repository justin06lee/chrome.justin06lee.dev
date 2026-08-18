import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "salon",
  type: "registry:ui",
  description:
    "a salon hang: a wall of images shown at their own aspect ratios, packed into justified rows that fill the width. rows are scaled to span the container with the row height kept near `targetRowHeight` — the effective minimum piece size — so the wall reads full rather than ragged and pieces never shrink away to fit; only the trailing leftover row is capped so a stray piece sits at a sane size instead of stretching across. nothing is cropped (each `<img>` gets intrinsic width/height plus object-contain, so a viewBox-only svg shows whole rather than being cropped by object-cover's 300x150 fallback). it isn't `gallery` (the uniform searchable card grid — every project the same card sized to a column), `shelf` (one horizontal scrolling row you skim), or `showcase` (a single framed preview): a salon keeps every piece's real proportions and makes the varied hang itself the point, so reach for it when the images are the content and their shapes carry meaning. the row-packing geometry ships as a separate tested module.",
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
