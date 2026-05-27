import { defineComponent } from "chrome-ui-registry-builder";
export default defineComponent({
  name: "select",
  type: "registry:ui",
  description: "headless dropdown with palette swatch support.",
  registryDependencies: [],
  files: [{ source: "select.tsx", target: "select.tsx" }],
  props: [
    { name: "value", type: "T", required: true },
    { name: "onChange", type: "(value: T) => void", required: true },
    { name: "options", type: "SelectOption<T>[]", required: true },
    { name: "size", type: "'default' | 'compact'", default: "'default'" },
    {
      name: "background",
      type: "string",
      description: "CSS background applied to the root element. transparent by default.",
    },
  ],
});
