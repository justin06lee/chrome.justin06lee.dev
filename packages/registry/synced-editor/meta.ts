import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "synced-editor",
  type: "registry:ui",
  description:
    "split-pane markdown editor whose preview scrolls and highlights in sync both ways — select text to push to the preview, click a preview block to scroll the editor and streak the matching lines. ships three composable pieces: a headless useLineSync engine, a SyncedPreview pane, and a SyncedEditorTextarea, plus the turnkey SyncedEditor that combines them. dark-only.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [
    { source: "synced-editor.tsx", target: "synced-editor.tsx" },
    { source: "synced-preview.tsx", target: "synced-preview.tsx" },
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
    { name: "className", type: "string", description: "sizing/extra classes for the root grid (give it a height)." },
  ],
});
