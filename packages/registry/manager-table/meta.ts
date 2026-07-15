import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "manager-table",
  type: "registry:ui",
  description:
    "admin table with inline rename, swatch recolor, archive, and confirmed delete. every mutation is a callback — bring your own state. rows can be locked (no rename/delete), and rename/delete may be async — a rejection surfaces inline under the row.",
  dependencies: [],
  registryDependencies: ["utils", "inline-edit", "color-swatch", "dialog"],
  files: [{ source: "manager-table.tsx", target: "manager-table.tsx" }],
  props: [
    { name: "rows", type: "ManagerRow[]", required: true, description: "rows to render; the source of truth, owned by the caller. a row with locked: true (built-in/system rows) renders without rename/delete affordances." },
    { name: "palette", type: "string[]", default: "DEFAULT_MANAGER_PALETTE", description: "hex colors offered by the recolor swatch picker." },
    { name: "onRename", type: "(id: string, name: string) => void | Promise<void>", description: "commit a renamed row. async handlers show the draft name optimistically; reject to roll it back and surface the error under the row." },
    { name: "onRecolor", type: "(id: string, color: string) => void", description: "commit a recolored row." },
    { name: "onArchive", type: "(id: string, archived: boolean) => void", description: "toggle a row's archived flag." },
    { name: "onDelete", type: "(id: string) => void | Promise<void>", description: "delete a row (already confirmed). reject to block the delete — the row stays and the error surfaces under it. while it runs the row's actions are disabled." },
    { name: "className", type: "string" },
  ],
});
