import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "editor",
  type: "registry:ui",
  description:
    "split-pane markdown editor whose live preview scrolls and highlights in sync, both ways. bring your own markdown renderer (e.g. prose).",
  dependencies: ["lucide-react"],
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
    {
      name: "textareaProps",
      type: "Omit<ComponentProps<'textarea'>, 'value' | 'defaultValue'>",
      description:
        "escape hatch onto the underlying textarea — e.g. onKeyDown for a vim keymap. handlers compose: the internal sync/selection glue runs first, then yours with the same event; className is merged.",
    },
    {
      name: "transformSource",
      type: "(source: string) => { body: string; lineOffset: number }",
      description:
        "strip a leading front-matter region from the preview: the preview renders body while line-sync shifts by lineOffset (editor line N ↔ preview block N − lineOffset; selections in the stripped region clamp to the first block). keep the reference stable.",
    },
    {
      name: "size",
      type: "'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'screen' | 'auto'",
      default: "'screen'",
      description:
        "size preset setting height and width (width clamped to the container). 'screen' fills the container at viewport height (like justin06lee.dev/desk); sm–2xl step from 20×32rem up to 52×88rem; 'auto' opts out so className owns the sizing.",
    },
    { name: "className", type: "string", description: "extra classes; h-*/w-* classes here override size." },
  ],
});
