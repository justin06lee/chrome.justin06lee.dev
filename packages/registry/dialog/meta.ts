import { defineComponent } from "chrome-ui-registry-builder";
export default defineComponent({
  name: "dialog",
  type: "registry:ui",
  description: "promise-based confirm and alert dialogs.",
  registryDependencies: [],
  files: [{ source: "dialog.tsx", target: "dialog.tsx" }],
  props: [
    { name: "title", type: "string", required: true },
    { name: "message", type: "string" },
    { name: "danger", type: "boolean", default: "false" },
  ],
});
