import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "category-picker",
  type: "registry:ui",
  description:
    "a searchable dropdown of color-coded items with click-outside + escape close and an optional inline create row. controlled and domain-agnostic.",
  registryDependencies: ["utils", "color-swatch"],
  files: [{ source: "category-picker.tsx", target: "category-picker.tsx" }],
  props: [
    { name: "value", type: "string | null", required: true, description: "selected item id." },
    { name: "onChange", type: "(id: string | null) => void", required: true },
    { name: "items", type: "CategoryItem[]", required: true, description: "{ id, label, color }[]" },
    { name: "allowClear", type: "boolean", description: "show a clear row when selected." },
    { name: "onCreate", type: "(label: string) => void", description: "renders a '+ create' row." },
  ],
});
