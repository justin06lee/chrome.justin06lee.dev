import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "button",
  type: "registry:ui",
  description:
    "polymorphic button with five variants, optional icons, hover tooltip, and click-to-clipboard. renders as an anchor when given href.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [{ source: "button.tsx", target: "button.tsx" }],
  props: [
    {
      name: "variant",
      type: "'solid' | 'outline' | 'dashed' | 'ghost' | 'link'",
      default: "'outline'",
    },
    { name: "size", type: "'sm' | 'md'", default: "'md'" },
    {
      name: "icon",
      type: "LucideIcon",
      description: "lucide icon before text (or alone if no children).",
    },
    {
      name: "iconRight",
      type: "LucideIcon",
      description: "lucide icon after text.",
    },
    {
      name: "tooltip",
      type: "string",
      description: "white slide-up pill shown on hover.",
    },
    {
      name: "label",
      type: "string",
      description: "aria-label override; required for icon-only buttons.",
    },
    {
      name: "href",
      type: "string",
      description:
        "renders as <a>. external URLs (http(s)://) get target=\"_blank\" auto-applied.",
    },
    { name: "onClick", type: "() => void" },
    { name: "fullWidth", type: "boolean", default: "false" },
    { name: "disabled", type: "boolean", default: "false" },
    {
      name: "copy",
      type: "string",
      description:
        "click copies this to the clipboard. tooltip + text children swap to copyFeedback for 1.5s.",
    },
    { name: "copyFeedback", type: "string", default: "'Copied!'" },
    {
      name: "background",
      type: "string",
      description: "CSS background applied to the root element. transparent by default.",
    },
  ],
});
