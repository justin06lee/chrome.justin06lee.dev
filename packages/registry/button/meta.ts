import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "button",
  type: "registry:ui",
  description:
    "polymorphic button. renders as an anchor when given href, a button otherwise.",
  registryDependencies: ["utils"],
  files: [{ source: "button.tsx", target: "button.tsx" }],
  props: [
    { name: "variant", type: "'default' | 'ghost'", default: "'default'" },
    { name: "size", type: "'sm' | 'md'", default: "'md'" },
    {
      name: "href",
      type: "string",
      description: "if provided, renders as <a> instead of <button>",
    },
  ],
});
