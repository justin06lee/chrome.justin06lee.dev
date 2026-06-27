import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "asset-sidebar",
  type: "registry:ui",
  description:
    "scrollable image/asset sidebar. drag a row into a textarea or click insert; optional drop zone for uploads.",
  registryDependencies: ["utils"],
  files: [{ source: "asset-sidebar.tsx", target: "asset-sidebar.tsx" }],
  props: [
    { name: "assets", type: "Asset[]", description: "rows to render." },
    { name: "onInsert", type: "(asset: Asset) => void", description: "fired by the insert button." },
    { name: "onDelete", type: "(asset: Asset) => void", description: "fired by the delete button; parent owns confirm." },
    { name: "onUpload", type: "(files: File[]) => void", description: "files dropped on the drop zone. omit to hide it." },
    { name: "title", type: "string", default: "'images'" },
    { name: "description", type: "string" },
    { name: "className", type: "string" },
    { name: "emptyLabel", type: "string", default: "'no images yet.'" },
  ],
});
