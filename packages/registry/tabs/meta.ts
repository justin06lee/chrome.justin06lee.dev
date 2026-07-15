import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "tabs",
  type: "registry:ui",
  description:
    "tab-strip in a bordered pill or underline style. controlled selection with roving-tabindex arrow-key nav and ARIA, split into a headless useTabs hook.",
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
    { name: "variant", type: "'pill' | 'underline'", default: "'pill'", description: "visual style — bordered pill buttons, or a bottom-border bar where the active tab gets a 2px white underline." },
    { name: "loop", type: "boolean", default: "true", description: "loop arrow-key focus past the ends." },
  ],
});
