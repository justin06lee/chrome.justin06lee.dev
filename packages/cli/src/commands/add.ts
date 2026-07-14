import { defineCommand } from "citty";
import { dirname, join, resolve, sep } from "node:path";
import { detectAliasBase, detectAppDir, detectProject } from "../project";
import { readConfig } from "../writers/config";
import type { Fetcher } from "../registry";
import { makeHttpFetcher, resolveItems } from "../registry";
import { writeFileSafe } from "../writers/tsx";
import { patchGlobalsCss, serializeCssVars } from "../writers/css";
import { runInstall } from "../writers/deps";
import type { PackageManager } from "../project";

export type Installer = (
  pm: PackageManager,
  packages: string[],
  cwd: string,
) => Promise<void>;

export interface AddOptions {
  cwd: string;
  names: string[];
  skipInstall?: boolean;
  overwrite?: boolean;
  yes?: boolean;
  registry?: string;
  /** Override for tests. */
  fetch?: Fetcher;
  /** Override for tests. */
  install?: Installer;
}

function aliasToFsRelative(alias: string, base: string): string {
  return join(base, alias.replace(/^@\//, ""));
}

export async function runAdd(opts: AddOptions): Promise<void> {
  const cwd = resolve(opts.cwd);
  const cfg = await readConfig(cwd);
  if (!cfg) {
    throw new Error(
      `no chrome.json found in ${cwd}\n  → run: bunx @justin06lee/chrome@latest init`,
    );
  }
  const project = detectProject(cwd);
  const fetcher = opts.fetch ?? makeHttpFetcher(opts.registry ?? cfg.registry);

  const items = await resolveItems(opts.names, fetcher);
  console.log(`✓ resolved: ${items.map((i) => i.name).join(", ")}`);

  const install = opts.install ?? runInstall;
  const npmDeps = Array.from(
    new Set(items.flatMap((i) => [...i.dependencies, ...(i.devDependencies ?? [])])),
  );
  if (!opts.skipInstall && npmDeps.length > 0) {
    await install(project.packageManager, npmDeps, cwd);
    console.log(`✓ installed ${npmDeps.join(" ")}`);
  }

  // "@/" maps to src/ on src-layout projects, the root otherwise.
  const aliasBase = detectAliasBase(cwd);
  const componentsRel = aliasToFsRelative(cfg.aliases.components, aliasBase);
  const utilsRel = aliasToFsRelative(cfg.aliases.utils, aliasBase);
  // Hooks land at the hooks alias; older configs predate the field, so fall back.
  const hooksRel = aliasToFsRelative(cfg.aliases.hooks ?? "@/hooks", aliasBase);
  // Page files land in the Next.js app directory (app/ or src/app/).
  const appRel = detectAppDir(cwd);

  // Resolve the globals.css target once and refuse paths that escape the project.
  const cssPath = resolve(cwd, cfg.tailwind.css);
  if (cssPath !== cwd && !cssPath.startsWith(cwd + sep)) {
    throw new Error(
      `tailwind.css path "${cfg.tailwind.css}" escapes the project root ${cwd} — fix tailwind.css in chrome.json`,
    );
  }

  const overwrite = opts.overwrite || opts.yes;
  const conflicts: string[] = [];

  for (const item of items) {
    for (const file of item.files) {
      let dest: string;
      if (file.type === "registry:page") {
        // Registry page targets are declared app-relative with an `app/`
        // prefix (e.g. "app/not-found.tsx"); strip it and re-root at the
        // detected app dir so src/ layouts get src/app/not-found.tsx.
        dest = join(cwd, appRel, file.path.replace(/^app\//, ""));
      } else if (file.type === "registry:hook") {
        dest = join(cwd, hooksRel, file.path);
      } else if (item.type === "registry:lib") {
        // Lib files land at <utilsDir>/<file.path>. The utils alias points at a
        // single file (e.g. lib/utils → lib/utils.ts), so use its parent dir.
        // For a bare alias (no slash, e.g. "utils") the dir is the project root.
        const utilsDir = dirname(utilsRel);
        dest = join(cwd, utilsDir === "." ? "" : utilsDir, file.path);
      } else if (item.type === "registry:theme") {
        await patchGlobalsCss(cssPath, file.content);
        console.log(`✓ patched ${cfg.tailwind.css}`);
        continue;
      } else {
        dest = join(cwd, componentsRel, file.path);
      }
      const result = await writeFileSafe(dest, file.content, { overwrite, cwdGuard: cwd });
      if (result.action === "written") console.log(`✓ wrote ${dest}`);
      else if (result.action === "skipped") console.log(`✓ skipped ${dest} (already present)`);
      else {
        conflicts.push(dest);
        console.log(`✗ conflict at ${dest} — re-run with --overwrite to replace`);
      }
    }

    if (typeof item.css === "string" && item.css.trim().length > 0) {
      await patchGlobalsCss(cssPath, item.css, item.name);
      console.log(`✓ patched ${cfg.tailwind.css} (${item.name})`);
    }

    const cssVars = serializeCssVars(item.cssVars);
    if (cssVars.length > 0) {
      await patchGlobalsCss(cssPath, cssVars, `${item.name}-vars`);
      console.log(`✓ patched ${cfg.tailwind.css} (${item.name} vars)`);
    }
  }

  if (conflicts.length > 0) {
    throw new Error(
      `${conflicts.length} file conflict${conflicts.length === 1 ? "" : "s"} — re-run with --overwrite (or --yes) to replace`,
    );
  }
}

export const addCommand = defineCommand({
  meta: { name: "add", description: "install one or more components" },
  args: {
    name: { type: "positional", required: true },
    cwd: { type: "string", default: "." },
    overwrite: { type: "boolean", default: false },
    yes: { type: "boolean", default: false },
    registry: { type: "string" },
  },
  async run({ args }) {
    // citty only assigns one positional; remaining positionals land in args._
    const names = [args.name, ...(args._ ?? [])].filter(Boolean);
    await runAdd({
      cwd: args.cwd,
      names,
      overwrite: args.overwrite,
      yes: args.yes,
      registry: args.registry,
    });
  },
});
