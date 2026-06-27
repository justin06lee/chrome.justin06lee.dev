import { defineCommand } from "citty";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve, sep } from "node:path";
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
      console.error("no chrome.json — run `bunx @justin06lee/chrome@latest init`");
      process.exit(1);
    }
    const fetcher = makeHttpFetcher(cfg.registry);
    let remote;
    try {
      remote = await fetcher(args.name);
    } catch (err) {
      console.error(`✗ ${(err as Error).message}`);
      process.exit(1);
    }
    const componentsRel = aliasToFs(cfg.aliases.components);
    const utilsRel = aliasToFs(cfg.aliases.utils);
    const hooksRel = aliasToFs(cfg.aliases.hooks ?? "@/hooks");
    // Mirror add.ts: hook → hooks alias, lib → utils alias's parent dir, else components.
    const utilsSlash = utilsRel.lastIndexOf("/");
    const libBase = utilsSlash === -1 ? "" : utilsRel.slice(0, utilsSlash);
    for (const file of remote.files) {
      let localDir: string;
      if (file.type === "registry:hook") {
        localDir = hooksRel;
      } else if (remote.type === "registry:lib") {
        localDir = libBase;
      } else {
        localDir = componentsRel;
      }
      const localPath = join(cwd, localDir, file.path);
      // Guard against a malicious registry whose file.path (e.g. "../../etc/passwd")
      // escapes the project root — mirror add.ts's writeFileSafe cwdGuard.
      if (!resolve(localPath).startsWith(cwd + sep)) {
        console.error(`✗ refusing to read "${file.path}" — escapes the project root`);
        process.exit(1);
      }
      if (!existsSync(localPath)) {
        console.log(`(no local copy at ${localPath})`);
        continue;
      }
      const local = await readFile(localPath, "utf8");
      console.log(unifiedDiff(local, file.content, file.path));
    }
  },
});
