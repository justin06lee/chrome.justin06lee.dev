import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { RegistryItem } from "./schema";
import type { WalkedItem } from "./walker";

export async function compileItem(item: WalkedItem): Promise<RegistryItem> {
  const { meta, dir } = item;
  const files = await Promise.all(
    meta.files.map(async (f) => {
      const sourcePath = join(dir, f.source);
      let content: string;
      try {
        content = await readFile(sourcePath, "utf8");
      } catch (err) {
        throw new Error(
          `[${meta.name}] cannot read source file ${f.source} at ${sourcePath}: ${(err as Error).message}`,
        );
      }
      return {
        path: f.target,
        content,
        type: meta.type,
        target: "",
      };
    }),
  );
  return {
    name: meta.name,
    type: meta.type,
    description: meta.description,
    dependencies: meta.dependencies ?? [],
    devDependencies: meta.devDependencies ?? [],
    registryDependencies: meta.registryDependencies ?? [],
    files,
    cssVars: meta.cssVars,
  };
}
