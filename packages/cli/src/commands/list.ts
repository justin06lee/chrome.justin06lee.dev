import { defineCommand } from "citty";
export const listCommand = defineCommand({
  meta: { name: "list", description: "list available components" },
  args: { registry: { type: "string" } },
  async run({ args }) {
    console.log("list not yet implemented", args);
  },
});
