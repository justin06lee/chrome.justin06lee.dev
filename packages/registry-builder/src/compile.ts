import { readFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import type { RegistryItem } from "./schema";
import type { WalkedItem } from "./walker";

/** Resolve a meta source path and refuse anything that escapes the component dir. */
function resolveSource(name: string, dir: string, source: string): string {
  const sourcePath = resolve(dir, source);
  const rel = relative(dir, sourcePath);
  if (rel.startsWith("..") || isAbsolute(rel)) {
    throw new Error(
      `[${name}] source file ${source} escapes the component folder ${dir}`,
    );
  }
  return sourcePath;
}

export async function compileItem(item: WalkedItem): Promise<RegistryItem> {
  const { meta, dir } = item;
  const files = await Promise.all(
    meta.files.map(async (f) => {
      const sourcePath = resolveSource(meta.name, dir, f.source);
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
        type: f.type ?? meta.type,
        target: f.target,
      };
    }),
  );
  let css: string | undefined;
  if (meta.cssFile) {
    const cssPath = resolveSource(meta.name, dir, meta.cssFile);
    try {
      css = await readFile(cssPath, "utf8");
    } catch (err) {
      throw new Error(
        `[${meta.name}] cannot read source file ${meta.cssFile} at ${cssPath}: ${(err as Error).message}`,
      );
    }
  }

  return {
    name: meta.name,
    type: meta.type,
    description: meta.description,
    dependencies: meta.dependencies ?? [],
    devDependencies: meta.devDependencies ?? [],
    registryDependencies: meta.registryDependencies ?? [],
    files,
    cssVars: meta.cssVars,
    css,
  };
}
