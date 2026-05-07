import { defineCommand } from "citty";
export const addCommand = defineCommand({
  meta: { name: "add", description: "install one or more components" },
  args: {
    name: { type: "positional", description: "component name(s)", required: true },
    cwd: { type: "string", default: "." },
    overwrite: { type: "boolean", default: false },
    yes: { type: "boolean", default: false },
    registry: { type: "string", description: "override registry URL" },
  },
  async run({ args }) {
    console.log("add not yet implemented", args);
  },
});
