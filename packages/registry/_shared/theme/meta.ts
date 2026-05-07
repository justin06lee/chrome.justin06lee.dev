import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "theme",
  type: "registry:theme",
  description: "dark-only chrome CSS variables and @theme inline tokens.",
  files: [{ source: "theme.css", target: "theme.css" }],
});
