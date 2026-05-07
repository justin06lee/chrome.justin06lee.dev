import { defineCommand } from "citty";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { detectProject } from "../project";
import { defaultConfig, writeConfig } from "../writers/config";
import { patchGlobalsCss } from "../writers/css";
import { runInstall } from "../writers/deps";
import { makeHttpFetcher, resolveItems } from "../registry";
import type { Fetcher } from "../registry";
import type { RegistryItem } from "../types";
import { writeFileSafe } from "../writers/tsx";

const PEER_DEPS = ["clsx", "tailwind-merge", "motion", "lucide-react"];
const DEFAULT_REGISTRY = "https://chrome.justin06lee.dev/r";

function findGlobalsCss(cwd: string): string {
  for (const candidate of ["app/globals.css", "src/app/globals.css", "styles/globals.css"]) {
    if (existsSync(join(cwd, candidate))) return candidate;
  }
  return "app/globals.css";
}

export interface InitOptions {
  cwd: string;
  yes?: boolean;
  registry?: string;
  skipInstall?: boolean;
}

export async function runInit(opts: InitOptions): Promise<void> {
  const cwd = resolve(opts.cwd);
  const project = detectProject(cwd);
  console.log(
    `✓ detected: ${project.packageManager} · ${project.framework} · tailwind v${project.tailwindMajor}` +
    `${project.hasTypeScript ? " · typescript" : ""}`,
  );

  const cssPath = findGlobalsCss(cwd);
  const cfg = defaultConfig({ cssPath });
  cfg.registry = opts.registry ?? DEFAULT_REGISTRY;

  await writeConfig(cwd, cfg);
  console.log(`✓ wrote chrome.ui.json`);

  if (!opts.skipInstall) {
    await runInstall(project.packageManager, PEER_DEPS, cwd);
    console.log(`✓ installed ${PEER_DEPS.join(" ")}`);
  }

  // Install the theme block via the registry, so init shares the `add` code path.
  const fetcher = opts.skipInstall
    ? localThemeFetcher()
    : makeHttpFetcher(cfg.registry);
  const items = await resolveItems(["theme", "utils"], fetcher);
  for (const item of items) {
    if (item.type === "registry:theme") {
      const themeFile = item.files[0];
      if (themeFile) {
        await patchGlobalsCss(join(cwd, cssPath), themeFile.content);
        console.log(`✓ patched ${cssPath}`);
      }
    } else if (item.type === "registry:lib") {
      // Each lib file lands at the utils alias (lib/utils.ts).
      const file = item.files[0];
      if (file) {
        const dest = join(cwd, "lib", file.path);
        const result = await writeFileSafe(dest, file.content);
        if (result.action === "written") console.log(`✓ wrote lib/${file.path}`);
        else console.log(`✓ skipped lib/${file.path} (already present)`);
      }
    }
  }
}

/** Used in tests so we don't hit the network. */
function localThemeFetcher(): Fetcher {
  return async (name: string): Promise<RegistryItem> => {
    if (name === "theme") {
      return {
        name: "theme",
        type: "registry:theme",
        dependencies: [],
        registryDependencies: [],
        files: [{
          path: "theme.css",
          type: "registry:theme",
          target: "",
          content: ":root, .dark {\n  --background: #000000;\n  --foreground: #ffffff;\n}\n",
        }],
      };
    }
    if (name === "utils") {
      return {
        name: "utils",
        type: "registry:lib",
        dependencies: [],
        registryDependencies: [],
        files: [{
          path: "utils.ts",
          type: "registry:lib",
          target: "",
          content: "export const cn = (...c: string[]) => c.join(' ');\n",
        }],
      };
    }
    throw new Error(`local fetcher: unknown ${name}`);
  };
}

export const initCommand = defineCommand({
  meta: { name: "init", description: "bootstrap chrome.ui in this project" },
  args: {
    cwd: { type: "string", default: "." },
    yes: { type: "boolean", default: false },
    registry: { type: "string" },
  },
  async run({ args }) {
    await runInit({ cwd: args.cwd, yes: args.yes, registry: args.registry });
  },
});
