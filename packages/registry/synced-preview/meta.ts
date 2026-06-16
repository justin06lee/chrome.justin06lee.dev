import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "synced-preview",
  type: "registry:ui",
  description:
    "presentational preview pane with editor↔preview scroll/highlight sync. renders markdown through a caller-supplied renderer (typically the prose component with lineSync), maps source lines to blocks, exposes an imperative alignLineToScreenY handle, and reports clicks via onSelectBlock. framework-agnostic, dark-only.",
  dependencies: [],
  registryDependencies: ["prose", "utils"],
  files: [{ source: "synced-preview.tsx", target: "synced-preview.tsx" }],
  props: [
    { name: "content", type: "string", required: true, description: "markdown source rendered through renderMarkdown." },
    {
      name: "renderMarkdown",
      type: "(markdown: string, state: { highlightLine: number | null }) => ReactNode",
      required: true,
      description:
        "renders the markdown with line-sync enabled — typically (md, { highlightLine }) => <Prose lineSync highlightLine={highlightLine}>{md}</Prose>.",
    },
    {
      name: "onSelectBlock",
      type: "(selection: PreviewBlockSelection) => void",
      description: "fired when the user clicks a block; reports start/end source line, screenY and screenHeight.",
    },
    { name: "label", type: "ReactNode", default: '"live preview"', description: "sticky label over the scroll area; pass null to hide." },
  ],
});
