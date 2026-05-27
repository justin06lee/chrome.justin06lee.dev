import { readdir } from "node:fs/promises";
import { join } from "node:path";
import type { ComponentMeta, RegistryItemType } from "./schema";

const KNOWN_TYPES: ReadonlyArray<RegistryItemType> = [
  "registry:ui",
  "registry:lib",
  "registry:theme",
  "registry:hook",
];

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
    const mod = await import(metaPath);
    const meta = mod.default as ComponentMeta;
    if (!meta || typeof meta !== "object" || !meta.name) {
      throw new Error(`Invalid meta.ts at ${metaPath}: missing default export or name`);
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
    items.push({ dir: metaPath.slice(0, -"meta.ts".length - 1), meta });
  }
  return items.sort((a, b) => a.meta.name.localeCompare(b.meta.name));
}
