import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "color-swatch",
  type: "registry:ui",
  description:
    "a fixed-palette color chip plus a controlled palette picker, with a muted default palette and a next-unused-color helper.",
  registryDependencies: ["utils"],
  files: [{ source: "color-swatch.tsx", target: "color-swatch.tsx" }],
  props: [
    { name: "color", type: "string", required: true, description: "ColorSwatch: hex chip fill." },
    { name: "value", type: "string | null", required: true, description: "ColorSwatchPicker: selected hex." },
    { name: "onChange", type: "(hex: string) => void", required: true, description: "ColorSwatchPicker." },
    {
      name: "palette",
      type: "readonly PaletteColor[]",
      default: "CATEGORY_PALETTE",
      description: "ColorSwatchPicker: { name, hex }[] to choose from.",
    },
  ],
});
