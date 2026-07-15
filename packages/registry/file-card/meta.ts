import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "file-card",
  type: "registry:ui",
  description:
    "animated stacked-paper download card — papers fan out on hover, still under reduced motion. renders as a link or button. composes stack.",
  registryDependencies: ["utils", "stack"],
  files: [{ source: "file-card.tsx", target: "file-card.tsx" }],
  props: [
    { name: "name", type: "string", required: true, description: "file name shown on the front paper." },
    {
      name: "meta",
      type: "string",
      description: "small uppercase kicker line above the name, e.g. 'pdf · 1.2 mb'.",
    },
    { name: "href", type: "string", description: "link target; renders the card as an anchor." },
    {
      name: "onClick",
      type: "() => void",
      description: "click handler; without href the card renders as a <button>.",
    },
    {
      name: "download",
      type: "boolean | string",
      description: "sets the anchor's download attribute (true, or a filename to save as).",
    },
    {
      name: "linkComponent",
      type: "React.ElementType",
      default: "'a'",
      description: "anchor element/component — pass your router's Link.",
    },
    {
      name: "layers",
      type: "number",
      default: "1",
      description: "paper layers behind the front card, forwarded to stack.",
    },
    { name: "className", type: "string", description: "overrides on the root element." },
  ],
});
