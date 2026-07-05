import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "collapsible-prose",
  type: "registry:ui",
  description:
    "splits markdown into collapsible sections on each ## heading. bring your own renderer via renderMarkdown — typically prose.",
  dependencies: ["lucide-react"],
  registryDependencies: ["prose", "utils"],
  files: [{ source: "collapsible-prose.tsx", target: "collapsible-prose.tsx" }],
  props: [
    { name: "children", type: "string", required: true, description: "markdown source; split on ## headings." },
    {
      name: "renderMarkdown",
      type: "(markdown: string) => ReactNode",
      required: true,
      description: "renders a markdown string — typically (md) => <Prose>{md}</Prose>.",
    },
    { name: "defaultOpen", type: "boolean", default: "true", description: "whether sections start expanded." },
  ],
});
