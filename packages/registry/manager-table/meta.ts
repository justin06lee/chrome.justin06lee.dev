import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "manager-table",
  type: "registry:ui",
  description:
    "an admin table of rows you can inline-rename, recolor via a swatch picker, archive, and delete with a confirm dialog. every mutation is a callback — bring your own state. composes inline-edit, color-swatch, and dialog. archived rows render muted. dark-only.",
  dependencies: [],
  registryDependencies: ["utils", "inline-edit", "color-swatch", "dialog"],
  files: [{ source: "manager-table.tsx", target: "manager-table.tsx" }],
  props: [
    { name: "rows", type: "ManagerRow[]", required: true, description: "rows to render; the source of truth, owned by the caller." },
    { name: "palette", type: "string[]", default: "DEFAULT_MANAGER_PALETTE", description: "hex colors offered by the recolor swatch picker." },
    { name: "onRename", type: "(id: string, name: string) => void", description: "commit a renamed row." },
    { name: "onRecolor", type: "(id: string, color: string) => void", description: "commit a recolored row." },
    { name: "onArchive", type: "(id: string, archived: boolean) => void", description: "toggle a row's archived flag." },
    { name: "onDelete", type: "(id: string) => void", description: "delete a row (already confirmed)." },
    { name: "className", type: "string" },
  ],
});
