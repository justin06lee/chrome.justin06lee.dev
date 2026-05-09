import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "copy-button",
  type: "registry:ui",
  description: "copy-to-clipboard button with copied/error feedback states.",
  files: [{ source: "copy-button.tsx", target: "copy-button.tsx" }],
  props: [
    { name: "text", type: "string", required: true, description: "string to copy" },
    { name: "resetMs", type: "number", default: "2000", description: "ms before reverting" },
    { name: "labels", type: "{ idle, copied, error }", default: "copy/copied/failed" },
  ],
});
