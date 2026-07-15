import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "command-palette",
  type: "registry:ui",
  description:
    "spotlight-style command palette: cmd+k opens a centered search overlay with grouped, keyboard-navigable results.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils", "kbd"],
  files: [{ source: "command-palette.tsx", target: "command-palette.tsx" }],
  props: [
    {
      name: "items",
      type: "PaletteItem[]",
      required: true,
      description: "{ id?, label, href?, group?, keywords? }[]",
    },
    {
      name: "onSelect",
      type: "(item: PaletteItem) => void",
      description: "called with the chosen item. default follows item.href via window.location.",
    },
    { name: "placeholder", type: "string", default: '"search…"' },
    {
      name: "hotkey",
      type: "string",
      default: '"k"',
      description: "key that opens the palette with cmd/ctrl held.",
    },
    {
      name: "open",
      type: "boolean",
      description: "controlled visibility; omit for the built-in hotkey flow.",
    },
    { name: "onOpenChange", type: "(open: boolean) => void" },
    {
      name: "emptyMessage",
      type: "string",
      default: '"no results."',
      description: "shown when nothing matches.",
    },
    { name: "className", type: "string" },
  ],
});
