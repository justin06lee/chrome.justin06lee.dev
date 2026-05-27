import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "showcase",
  type: "registry:ui",
  description:
    "framed preview container with a dotted background. holds component demos with optional label, source caption, and note. exports a Row helper for explicit row breaks; bare children get auto-wrapped into one centered row.",
  registryDependencies: ["utils"],
  files: [{ source: "showcase.tsx", target: "showcase.tsx" }],
  props: [
    {
      name: "label",
      type: "string",
      description: "small uppercase label rendered above the frame.",
    },
    {
      name: "source",
      type: "string",
      description: "code-styled caption rendered below the frame.",
    },
    {
      name: "note",
      type: "string",
      description: "muted secondary caption below the source.",
    },
    {
      name: "background",
      type: "'dots' | 'grid' | 'none'",
      default: "'dots'",
      description: "backdrop pattern inside the frame.",
    },
    { name: "className", type: "string" },
  ],
});
