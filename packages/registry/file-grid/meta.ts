import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "file-grid",
  type: "registry:ui",
  description:
    "asset-browser grid of stacked-paper file cards with press-and-drag-to-trash delete (pointer-driven, so it never triggers native link-drag; the trash zone only appears while dragging) and a type-the-name-to-confirm dialog. composes file-card, input, and button.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils", "file-card", "input", "button"],
  files: [{ source: "file-grid.tsx", target: "file-grid.tsx" }],
  props: [
    {
      name: "files",
      type: "FileGridFile[]",
      required: true,
      description:
        "the files to render: { id, name, href?, meta? }[]. extra fields ride along into onDelete/renderCard (the component is generic over the file type).",
    },
    {
      name: "onDelete",
      type: "(file: T) => void | Promise<void>",
      description:
        "enables deleting: press-and-drag a card onto the trash zone (which appears only while dragging), then type the exact file name to confirm. may be async — the dialog shows a pending state and a rejection surfaces inline.",
    },
    {
      name: "renderCard",
      type: "(file: T) => ReactNode",
      description: "replaces the default file-card render for each file.",
    },
    {
      name: "linkComponent",
      type: "React.ElementType",
      default: "'a'",
      description: "anchor element/component forwarded to the default card — pass your router's Link.",
    },
    {
      name: "trashPosition",
      type: "'corner' | 'viewport'",
      default: "'corner'",
      description:
        "where the trash drop zone sits while dragging: pinned inside the grid's corner, or fixed to the viewport's bottom right.",
    },
    {
      name: "emptyLabel",
      type: "string",
      default: "'no files yet.'",
      description: "shown when files is empty.",
    },
    { name: "className", type: "string", description: "overrides on the root element." },
  ],
});
