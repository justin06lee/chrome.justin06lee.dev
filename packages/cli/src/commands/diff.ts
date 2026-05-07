import { defineCommand } from "citty";
export const diffCommand = defineCommand({
  meta: { name: "diff", description: "show local vs registry diff" },
  args: { name: { type: "positional", required: true } },
  async run({ args }) {
    console.log("diff not yet implemented", args);
  },
});
