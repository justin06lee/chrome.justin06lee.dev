import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname } from "node:path";

export interface WriteOptions { overwrite?: boolean }
export type WriteAction = "written" | "skipped" | "conflict";
export interface WriteResult { action: WriteAction; path: string }

export async function writeFileSafe(
  path: string,
  content: string,
  opts: WriteOptions = {},
): Promise<WriteResult> {
  await mkdir(dirname(path), { recursive: true });
  if (existsSync(path)) {
    const current = await readFile(path, "utf8");
    if (current === content) return { action: "skipped", path };
    if (!opts.overwrite) return { action: "conflict", path };
  }
  await writeFile(path, content);
  return { action: "written", path };
}
