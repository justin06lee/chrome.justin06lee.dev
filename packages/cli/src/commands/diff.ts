import { defineCommand } from "citty";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { readConfig } from "../writers/config";
import { detectAliasBase } from "../project";
import { makeHttpFetcher } from "../registry";
import { sanitize } from "../sanitize";

function aliasToFs(alias: string, base: string): string {
  return join(base, alias.replace(/^@\//, ""));
}

/** Line diff via longest-common-subsequence, so one inserted or deleted line
 *  doesn't mark every following line as changed. Files are small, so the
 *  O(n·m) dp table is fine. */
export function unifiedDiff(a: string, b: string, label: string): string {
  if (a === b) return `(no diff for ${label})`;
  const linesA = a.split("\n");
  const linesB = b.split("\n");
  const n = linesA.length;
  const m = linesB.length;
  // lcs[i][j] = length of the LCS of linesA[i..] and linesB[j..]
  const lcs: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i]![j] = linesA[i] === linesB[j]
        ? lcs[i + 1]![j + 1]! + 1
        : Math.max(lcs[i + 1]![j]!, lcs[i]![j + 1]!);
    }
  }
  const out: string[] = [`--- local/${label}`, `+++ registry/${label}`];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (linesA[i] === linesB[j]) {
      i++;
      j++;
    } else if (lcs[i + 1]![j]! >= lcs[i]![j + 1]!) {
      out.push(`- ${linesA[i++]}`);
    } else {
      out.push(`+ ${linesB[j++]}`);
    }
  }
  while (i < n) out.push(`- ${linesA[i++]}`);
  while (j < m) out.push(`+ ${linesB[j++]}`);
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
    const aliasBase = detectAliasBase(cwd);
    const componentsRel = aliasToFs(cfg.aliases.components, aliasBase);
    const utilsRel = aliasToFs(cfg.aliases.utils, aliasBase);
    const hooksRel = aliasToFs(cfg.aliases.hooks ?? "@/hooks", aliasBase);
    // Mirror add.ts: hook → hooks alias, lib → utils alias's parent dir, else components.
    const utilsDir = dirname(utilsRel);
    const libBase = utilsDir === "." ? "" : utilsDir;
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
      console.log(unifiedDiff(local, sanitize(file.content), sanitize(file.path)));
    }
  },
});
