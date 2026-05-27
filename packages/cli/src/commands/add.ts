import { defineCommand } from "citty";
import { join, resolve } from "node:path";
import { detectProject } from "../project";
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

function aliasToFsRelative(alias: string): string {
  return alias.replace(/^@\//, "");
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

  const componentsRel = aliasToFsRelative(cfg.aliases.components);
  const utilsRel = aliasToFsRelative(cfg.aliases.utils);
  // Hooks land at the hooks alias; older configs predate the field, so fall back.
  const hooksRel = aliasToFsRelative(cfg.aliases.hooks ?? "@/hooks");

  for (const item of items) {
    for (const file of item.files) {
      let dest: string;
      if (file.type === "registry:hook") {
        dest = join(cwd, hooksRel, file.path);
      } else if (item.type === "registry:lib") {
        // Lib files land at <utilsAlias>/<file.path> — but since utils is normally
        // a single file (utils.ts), strip the alias's basename to avoid lib/utils/utils.ts.
        const utilsBase = utilsRel.replace(/\/[^/]+$/, "");
        dest = join(cwd, utilsBase, file.path);
      } else if (item.type === "registry:theme") {
        await patchGlobalsCss(join(cwd, cfg.tailwind.css), file.content);
        console.log(`✓ patched ${cfg.tailwind.css}`);
        continue;
      } else {
        dest = join(cwd, componentsRel, file.path);
      }
      const result = await writeFileSafe(dest, file.content, { overwrite: opts.overwrite, cwdGuard: cwd });
      if (result.action === "written") console.log(`✓ wrote ${dest}`);
      else if (result.action === "skipped") console.log(`✓ skipped ${dest} (already present)`);
      else console.log(`✗ conflict at ${dest} — re-run with --overwrite to replace`);
    }

    if (typeof item.css === "string" && item.css.trim().length > 0) {
      await patchGlobalsCss(join(cwd, cfg.tailwind.css), item.css, item.name);
      console.log(`✓ patched ${cfg.tailwind.css} (${item.name})`);
    }

    const cssVars = serializeCssVars(item.cssVars);
    if (cssVars.length > 0) {
      await patchGlobalsCss(join(cwd, cfg.tailwind.css), cssVars, `${item.name}-vars`);
      console.log(`✓ patched ${cfg.tailwind.css} (${item.name} vars)`);
    }
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
