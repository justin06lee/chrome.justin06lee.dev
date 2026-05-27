import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve, sep } from "node:path";

export interface WriteOptions { overwrite?: boolean; cwdGuard?: string }
export type WriteAction = "written" | "skipped" | "conflict";
export interface WriteResult { action: WriteAction; path: string }

export async function writeFileSafe(
  path: string,
  content: string,
  opts: WriteOptions = {},
): Promise<WriteResult> {
  if (opts.cwdGuard !== undefined) {
    const absPath = resolve(path);
    const absCwd = resolve(opts.cwdGuard);
    if (!absPath.startsWith(absCwd + sep)) {
      throw new Error(
        `path traversal detected: "${path}" escapes the project root "${opts.cwdGuard}"`,
      );
    }
  }
  await mkdir(dirname(path), { recursive: true });
  if (existsSync(path)) {
    const current = await readFile(path, "utf8");
    if (current === content) return { action: "skipped", path };
    if (!opts.overwrite) return { action: "conflict", path };
  }
  await writeFile(path, content);
  return { action: "written", path };
}
