import { defineCommand } from "citty";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { readConfig } from "../writers/config";
import { makeHttpFetcher } from "../registry";

function aliasToFs(alias: string): string {
  return alias.replace(/^@\//, "");
}

function unifiedDiff(a: string, b: string, label: string): string {
  if (a === b) return `(no diff for ${label})`;
  const linesA = a.split("\n");
  const linesB = b.split("\n");
  const out: string[] = [`--- local/${label}`, `+++ registry/${label}`];
  const max = Math.max(linesA.length, linesB.length);
  for (let i = 0; i < max; i++) {
    const la = linesA[i];
    const lb = linesB[i];
    if (la === lb) continue;
    if (la !== undefined) out.push(`- ${la}`);
    if (lb !== undefined) out.push(`+ ${lb}`);
  }
  return out.join("\n");
}

export const diffCommand = defineCommand({
  meta: { name: "diff", description: "show local vs registry diff for a component" },
  args: { name: { type: "positional", required: true } },
  async run({ args }) {
    const cwd = resolve(".");
    const cfg = await readConfig(cwd);
    if (!cfg) {
      console.error("no chrome.ui.json — run `bunx chrome.ui@latest init`");
      process.exit(1);
    }
    const fetcher = makeHttpFetcher(cfg.registry);
    const remote = await fetcher(args.name);
    for (const file of remote.files) {
      const localPath = join(cwd, aliasToFs(cfg.aliases.components), file.path);
      if (!existsSync(localPath)) {
        console.log(`(no local copy at ${localPath})`);
        continue;
      }
      const local = await readFile(localPath, "utf8");
      console.log(unifiedDiff(local, file.content, file.path));
    }
  },
});
