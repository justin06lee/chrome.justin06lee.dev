import { defineCommand } from "citty";
import { join, resolve } from "node:path";
import { detectProject } from "../project";
import { readConfig } from "../writers/config";
import type { Fetcher } from "../registry";
import { makeHttpFetcher, resolveItems } from "../registry";
import { writeFileSafe } from "../writers/tsx";
import { patchGlobalsCss } from "../writers/css";
import { runInstall } from "../writers/deps";

export interface AddOptions {
  cwd: string;
  names: string[];
  skipInstall?: boolean;
  overwrite?: boolean;
  yes?: boolean;
  registry?: string;
  /** Override for tests. */
  fetch?: Fetcher;
}

function aliasToFsRelative(alias: string): string {
  return alias.replace(/^@\//, "");
}

export async function runAdd(opts: AddOptions): Promise<void> {
  const cwd = resolve(opts.cwd);
  const cfg = await readConfig(cwd);
  if (!cfg) {
    throw new Error(
      `no chromeui.json found in ${cwd}\n  → run: bunx chromeui@latest init`,
    );
  }
  const project = detectProject(cwd);
  const fetcher = opts.fetch ?? makeHttpFetcher(opts.registry ?? cfg.registry);

  const items = await resolveItems(opts.names, fetcher);
  console.log(`✓ resolved: ${items.map((i) => i.name).join(", ")}`);

  const npmDeps = Array.from(new Set(items.flatMap((i) => i.dependencies)));
  if (!opts.skipInstall && npmDeps.length > 0) {
    await runInstall(project.packageManager, npmDeps, cwd);
    console.log(`✓ installed ${npmDeps.join(" ")}`);
  }

  const componentsRel = aliasToFsRelative(cfg.aliases.components);
  const utilsRel = aliasToFsRelative(cfg.aliases.utils);

  for (const item of items) {
    for (const file of item.files) {
      let dest: string;
      if (item.type === "registry:lib") {
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
      const result = await writeFileSafe(dest, file.content, { overwrite: opts.overwrite });
      if (result.action === "written") console.log(`✓ wrote ${dest}`);
      else if (result.action === "skipped") console.log(`✓ skipped ${dest} (already present)`);
      else console.log(`✗ conflict at ${dest} — re-run with --overwrite to replace`);
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
    const names = Array.isArray(args.name) ? args.name : [args.name];
    await runAdd({
      cwd: args.cwd,
      names,
      overwrite: args.overwrite,
      yes: args.yes,
      registry: args.registry,
    });
  },
});
