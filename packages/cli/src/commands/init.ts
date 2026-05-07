import { defineCommand } from "citty";
export const initCommand = defineCommand({
  meta: { name: "init", description: "bootstrap chrome.ui in this project" },
  args: {
    cwd: { type: "string", description: "project directory", default: "." },
    yes: { type: "boolean", description: "accept all defaults", default: false },
  },
  async run({ args }) {
    console.log("init not yet implemented", args);
  },
});
