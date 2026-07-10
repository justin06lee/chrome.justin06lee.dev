import { defineComponent } from "chrome-ui-registry-builder";
export default defineComponent({
  name: "select",
  type: "registry:ui",
  description: "styled dropdown select with keyboard navigation and option prefix slots (e.g. palette swatches).",
  registryDependencies: [],
  files: [{ source: "select.tsx", target: "select.tsx" }],
  props: [
    { name: "value", type: "T", required: true },
    { name: "onChange", type: "(value: T) => void", required: true },
    { name: "options", type: "SelectOption<T>[]", required: true },
    { name: "placeholder", type: "string", description: "shown in the trigger when no option matches value." },
    { name: "disabled", type: "boolean", description: "disables the trigger button." },
    { name: "ariaLabel", type: "string", description: "accessible name for the trigger." },
    { name: "className", type: "string", description: "extra classes for the root element." },
    { name: "size", type: "'default' | 'compact'", default: "'default'" },
    {
      name: "background",
      type: "string",
      description: "CSS background applied to the root element. transparent by default.",
    },
  ],
});
