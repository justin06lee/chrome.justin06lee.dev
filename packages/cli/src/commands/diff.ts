import { defineCommand } from "citty";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { readConfig } from "../writers/config";
import { detectAliasBase, detectAppDir } from "../project";
import type { Fetcher } from "../registry";
import { makeHttpFetcher } from "../registry";
import { rewriteImports } from "../writers/imports";
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

export interface DiffOptions {
  cwd: string;
  name: string;
  /** Override for tests. */
  fetch?: Fetcher;
  /** Override for tests; defaults to console.log. */
  log?: (line: string) => void;
}

export async function runDiff(opts: DiffOptions): Promise<void> {
  const cwd = resolve(opts.cwd);
  const log = opts.log ?? console.log;
  const cfg = await readConfig(cwd);
  if (!cfg) {
    throw new Error("no chrome.json — run `bunx @justin06lee/chrome@latest init`");
  }
  const fetcher = opts.fetch ?? makeHttpFetcher(cfg.registry);
  const remote = await fetcher(opts.name);
  // Mirror add.ts: prefer the layout recorded in chrome.json at init; live
  // detection is the fallback for older configs that predate the field.
  const aliasBase = cfg.aliasBase ?? detectAliasBase(cwd);
  const componentsRel = aliasToFs(cfg.aliases.components, aliasBase);
  const utilsRel = aliasToFs(cfg.aliases.utils, aliasBase);
  const hooksRel = aliasToFs(cfg.aliases.hooks ?? "@/hooks", aliasBase);
  // Mirror add.ts: hook → hooks alias, lib → utils alias's parent dir, else components.
  const utilsDir = dirname(utilsRel);
  const libBase = utilsDir === "." ? "" : utilsDir;
  for (const file of remote.files) {
    let localDir: string;
    let filePath = file.path;
    if (file.type === "registry:page") {
      // Mirror add.ts: page files live in the app dir, target stripped of
      // its `app/` prefix (src/ layouts resolve to src/app/...).
      localDir = detectAppDir(cwd, aliasBase);
      filePath = file.path.replace(/^app\//, "");
    } else if (file.type === "registry:hook") {
      localDir = hooksRel;
    } else if (remote.type === "registry:lib") {
      localDir = libBase;
    } else {
      localDir = componentsRel;
    }
    const localPath = join(cwd, localDir, filePath);
    // Guard against a malicious registry whose file.path (e.g. "../../etc/passwd")
    // escapes the project root — mirror add.ts's writeFileSafe cwdGuard.
    if (!resolve(localPath).startsWith(cwd + sep)) {
      throw new Error(`refusing to read "${sanitize(file.path)}" — escapes the project root`);
    }
    if (!existsSync(localPath)) {
      log(`(no local copy at ${localPath})`);
      continue;
    }
    const local = await readFile(localPath, "utf8");
    // add.ts rewrites registry import aliases at install time; apply the same
    // rewrite before comparing, or every cross-component import shows as drift.
    const remoteContent = rewriteImports(file.content, cfg.aliases);
    log(unifiedDiff(local, sanitize(remoteContent), sanitize(file.path)));
  }
}

export const diffCommand = defineCommand({
  meta: { name: "diff", description: "show local vs registry diff for a component" },
  args: { name: { type: "positional", required: true } },
  async run({ args }) {
    try {
      await runDiff({ cwd: ".", name: args.name });
    } catch (err) {
      console.error(`✗ ${(err as Error).message}`);
      process.exit(1);
    }
  },
});
