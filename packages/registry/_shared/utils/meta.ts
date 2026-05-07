import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "utils",
  type: "registry:lib",
  description: "the cn() helper. clsx + tailwind-merge.",
  dependencies: ["clsx", "tailwind-merge"],
  files: [{ source: "utils.ts", target: "utils.ts" }],
});
