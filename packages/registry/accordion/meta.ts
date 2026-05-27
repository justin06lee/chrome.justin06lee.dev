import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "accordion",
  type: "registry:ui",
  description:
    "collapsible rows on native <details>/<summary> with a rotating chevron. share a name across items for one-open-at-a-time behavior. zero javascript state.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [{ source: "accordion.tsx", target: "accordion.tsx" }],
  props: [
    { name: "AccordionItem.title", type: "ReactNode", required: true },
    { name: "AccordionItem.defaultOpen", type: "boolean", description: "open on first render." },
    { name: "AccordionItem.name", type: "string", description: "shared name → exclusive (accordion) behavior." },
  ],
});
