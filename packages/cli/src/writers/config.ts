import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

export interface ChromeUiConfig {
  $schema: string;
  registry: string;
  style: "default";
  tsx: boolean;
  tailwind: { css: string; baseColor: "black" };
  aliases: { components: string; utils: string };
}

export function defaultConfig(opts: { cssPath: string }): ChromeUiConfig {
  return {
    $schema: "https://chrome.justin06lee.dev/schema.json",
    registry: "https://chrome.justin06lee.dev/r",
    style: "default",
    tsx: true,
    tailwind: { css: opts.cssPath, baseColor: "black" },
    aliases: { components: "@/components/chrome", utils: "@/lib/utils" },
  };
}

const CONFIG_FILE = "chrome.json";

export async function readConfig(cwd: string): Promise<ChromeUiConfig | null> {
  const path = join(cwd, CONFIG_FILE);
  if (!existsSync(path)) return null;
  return JSON.parse(await readFile(path, "utf8"));
}

export async function writeConfig(cwd: string, cfg: ChromeUiConfig): Promise<void> {
  await writeFile(join(cwd, CONFIG_FILE), JSON.stringify(cfg, null, 2) + "\n");
}
