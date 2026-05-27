import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "menu",
  type: "registry:ui",
  description:
    "action dropdown: a trigger opening a list of items, each running its onSelect. optional selected markers (e.g. a sort menu). behavior split into a headless useMenu hook.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [
    { source: "menu.tsx", target: "menu.tsx" },
    { source: "use-menu.ts", target: "use-menu.ts", type: "registry:hook" },
  ],
  props: [
    { name: "trigger", type: "ReactNode", required: true },
    { name: "items", type: "MenuItem[]", required: true, description: "{ label, onSelect, icon?, selected?, disabled? }[]" },
    { name: "label", type: "string", description: "heading above the items." },
    { name: "align", type: "'left' | 'right'", default: "'left'" },
  ],
});
