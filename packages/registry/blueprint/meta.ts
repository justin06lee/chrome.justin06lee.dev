import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "blueprint",
  type: "registry:ui",
  description:
    "engineering graph-paper substrate — minor/major grid, corner registration marks, edge fade, and an optional pointer crosshair with a live coordinate readout. four stacked linear-gradients rather than a tiled image, so it stays crisp at any zoom and costs no request.",
  registryDependencies: ["utils"],
  files: [{ source: "blueprint.tsx", target: "blueprint.tsx" }],
  props: [
    { name: "cell", type: "number", default: "8", description: "minor grid pitch in px." },
    { name: "major", type: "number", default: "5", description: "minor cells per major line; 0 draws minor lines only." },
    { name: "color", type: "string", default: "'rgba(255,255,255,0.05)'", description: "minor line colour." },
    { name: "majorColor", type: "string", default: "'rgba(255,255,255,0.1)'", description: "major line colour." },
    { name: "fade", type: "'none' | 'radial' | 'top' | 'bottom'", default: "'none'", description: "masks the grid toward the edges so it reads as a substrate, not a table." },
    { name: "ticks", type: "boolean", default: "false", description: "L-shaped registration marks in the four corners." },
    {
      name: "crosshair",
      type: "boolean",
      default: "false",
      description:
        "full-bleed rules that track the pointer, with a mono coordinate readout. ignored for coarse pointers.",
    },
    {
      name: "formatCoordinate",
      type: "(x: number, y: number, cell: number) => string",
      description: "formats the crosshair readout. defaults to grid cell coordinates.",
    },
    { name: "as", type: "ElementType", default: "'div'" },
    { name: "children", type: "ReactNode" },
    { name: "className", type: "string" },
  ],
});
