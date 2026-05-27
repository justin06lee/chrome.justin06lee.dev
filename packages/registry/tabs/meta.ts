import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "tabs",
  type: "registry:ui",
  description:
    "bordered pill tab-strip. controlled selection with roving-tabindex arrow-key nav and ARIA, split into a headless useTabs hook.",
  registryDependencies: ["utils"],
  files: [
    // Styled component first so the docs source view shows it (page reads files[0]).
    { source: "tabs.tsx", target: "tabs.tsx" },
    { source: "use-tabs.ts", target: "use-tabs.ts", type: "registry:hook" },
  ],
  props: [
    { name: "value", type: "T", required: true },
    { name: "onValueChange", type: "(value: T) => void", required: true },
    { name: "items", type: "TabItem<T>[]", required: true, description: "{ value, label, disabled? }[]" },
    { name: "loop", type: "boolean", default: "true", description: "loop arrow-key focus past the ends." },
  ],
});
