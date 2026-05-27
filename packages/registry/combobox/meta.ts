import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "combobox",
  type: "registry:ui",
  description:
    "searchable select with optional color swatches, inline create, and clear. behavior split into a headless useCombobox hook. generalized from the calendar category picker.",
  registryDependencies: ["utils"],
  files: [
    { source: "combobox.tsx", target: "combobox.tsx" },
    { source: "use-combobox.ts", target: "use-combobox.ts", type: "registry:hook" },
  ],
  props: [
    { name: "value", type: "T | null", required: true },
    { name: "onChange", type: "(value: T | null) => void", required: true },
    { name: "options", type: "ComboboxOption<T>[]", required: true, description: "{ value, label, color? }[]" },
    { name: "allowClear", type: "boolean", description: "show a Clear row when selected." },
    { name: "onCreate", type: "(query: string) => void", description: "renders a '+ Create' row." },
  ],
});
