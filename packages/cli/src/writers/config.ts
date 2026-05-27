import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { DEFAULT_REGISTRY } from "../constants";

export interface ChromeUiConfig {
  $schema: string;
  registry: string;
  style: "default";
  tsx: boolean;
  tailwind: { css: string; baseColor: "black" };
  aliases: { components: string; utils: string; hooks: string };
}

export function defaultConfig(opts: { cssPath: string }): ChromeUiConfig {
  return {
    $schema: "https://chrome.justin06lee.dev/schema.json",
    registry: DEFAULT_REGISTRY,
    style: "default",
    tsx: true,
    tailwind: { css: opts.cssPath, baseColor: "black" },
    aliases: { components: "@/components/chrome", utils: "@/lib/utils", hooks: "@/hooks" },
  };
}

const CONFIG_FILE = "chrome.json";

export async function readConfig(cwd: string): Promise<ChromeUiConfig | null> {
  const path = join(cwd, CONFIG_FILE);
  let raw: string;
  try {
    raw = await readFile(path, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw new Error(`failed to read ${path}: ${(err as Error).message}`);
  }
  try {
    return JSON.parse(raw) as ChromeUiConfig;
  } catch (err) {
    throw new Error(`malformed JSON in ${path}: ${(err as Error).message}`);
  }
}

export async function writeConfig(cwd: string, cfg: ChromeUiConfig): Promise<void> {
  await writeFile(join(cwd, CONFIG_FILE), JSON.stringify(cfg, null, 2) + "\n");
}
