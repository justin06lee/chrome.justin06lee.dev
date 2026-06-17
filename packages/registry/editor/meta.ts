import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "editor",
  type: "registry:ui",
  description:
    "split-pane markdown editor with a live preview that scrolls and highlights in sync, both ways: select text and a button pushes it to the preview; click a block in the preview and the editor scrolls to it and lays a gray streak over the matching lines. bring your own markdown renderer (e.g. prose). dark-only.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [
    { source: "editor.tsx", target: "editor.tsx" },
    { source: "editor-preview.tsx", target: "editor-preview.tsx" },
    { source: "use-line-sync.ts", target: "use-line-sync.ts", type: "registry:hook" },
  ],
  props: [
    { name: "value", type: "string", required: true, description: "markdown source (controlled)." },
    { name: "onChange", type: "(value: string) => void", required: true, description: "called with the next source on edit." },
    {
      name: "renderMarkdown",
      type: "(markdown: string, state: { highlightLine: number | null }) => ReactNode",
      required: true,
      description: "renders the markdown with line-sync — typically (md, { highlightLine }) => <Prose lineSync highlightLine={highlightLine}>{md}</Prose>.",
    },
    { name: "label", type: "ReactNode", default: "'live preview'", description: "sticky label over the preview pane." },
    { name: "placeholder", type: "string", description: "editor textarea placeholder." },
    { name: "className", type: "string", description: "sizing/extra classes for the root (give it a height)." },
  ],
});
