#!/usr/bin/env node
import { defineCommand, runMain } from "citty";
import { initCommand } from "./commands/init";
import { addCommand } from "./commands/add";
import { listCommand } from "./commands/list";
import { diffCommand } from "./commands/diff";
import pkg from "../package.json" with { type: "json" };

const main = defineCommand({
  meta: {
    name: "chrome",
    version: pkg.version,
    description: "components for justin06lee.dev. install via bunx.",
  },
  subCommands: {
    init: initCommand,
    add: addCommand,
    list: listCommand,
    diff: diffCommand,
  },
});

runMain(main);
