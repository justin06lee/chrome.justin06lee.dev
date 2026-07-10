import { readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import type { ComponentMeta, RegistryItemType } from "./schema";

const KNOWN_TYPES: ReadonlyArray<RegistryItemType> = [
  "registry:ui",
  "registry:lib",
  "registry:theme",
  "registry:hook",
];

// Component names become output filenames (`<name>.json`), so they must be
// simple kebab-case with no path separators.
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export interface WalkedItem {
  dir: string;
  meta: ComponentMeta;
}

async function findMetaFiles(root: string): Promise<string[]> {
  const out: string[] = [];
  async function recurse(dir: string) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
        await recurse(full);
      } else if (entry.name === "meta.ts") {
        out.push(full);
      }
    }
  }
  await recurse(root);
  return out;
}

export async function walkRegistry(root: string): Promise<WalkedItem[]> {
  const metaPaths = await findMetaFiles(root);
  const items: WalkedItem[] = [];
  for (const metaPath of metaPaths) {
    let mod: { default?: unknown };
    try {
      // file:// URL so this works under plain Node ESM, not just Bun.
      mod = await import(pathToFileURL(metaPath).href);
    } catch (err) {
      throw new Error(`Failed to import meta.ts at ${metaPath}: ${(err as Error).message}`);
    }
    const meta = mod.default as ComponentMeta;
    if (!meta || typeof meta !== "object" || !meta.name) {
      throw new Error(`Invalid meta.ts at ${metaPath}: missing default export or name`);
    }
    if (typeof meta.name !== "string" || !NAME_RE.test(meta.name)) {
      throw new Error(
        `Invalid meta.ts in ${dirname(metaPath)}: "name" must match ${NAME_RE} (got ${JSON.stringify(meta.name)})`,
      );
    }
    if (meta.name === "index") {
      throw new Error(
        `Invalid meta.ts in ${dirname(metaPath)}: "index" is reserved for the generated index.json`,
      );
    }
    if (!KNOWN_TYPES.includes(meta.type as RegistryItemType)) {
      throw new Error(
        `Invalid meta.ts at ${metaPath}: "type" must be one of ${KNOWN_TYPES.join(", ")} (got ${JSON.stringify(meta.type)})`,
      );
    }
    if (!Array.isArray(meta.files) || meta.files.length === 0) {
      throw new Error(
        `Invalid meta.ts at ${metaPath}: "files" must be a non-empty array`,
      );
    }
    for (const f of meta.files) {
      if (!f || typeof f.source !== "string" || typeof f.target !== "string") {
        throw new Error(
          `Invalid meta.ts at ${metaPath}: every "files" entry needs string "source" and "target"`,
        );
      }
    }
    items.push({ dir: dirname(metaPath), meta });
  }
  return items.sort((a, b) => a.meta.name.localeCompare(b.meta.name));
}
