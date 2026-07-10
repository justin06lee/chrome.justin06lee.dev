import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import { join, relative, dirname } from "node:path";
import { walkRegistry } from "./walker";
import { compileItem } from "./compile";
import { validateRegistry } from "./validate";
import { validateRegistryImports } from "./validate-imports";
import { writeManifest } from "./manifest";

export interface BuildOptions {
  registryDir: string;
  outDir: string;
  /** Optional path to write a TS manifest module re-exporting all component metas as `REGISTRY`. */
  manifestPath?: string;
}

export async function build(opts: BuildOptions): Promise<void> {
  const items = await walkRegistry(opts.registryDir);
  validateRegistry(items.map((i) => i.meta));

  await mkdir(opts.outDir, { recursive: true });

  // Remove stale JSON left behind by deleted or renamed components. Only ever
  // touches *.json files directly inside outDir.
  const expected = new Set([
    "index.json",
    ...items.map((i) => `${i.meta.name}.json`),
  ]);
  for (const entry of await readdir(opts.outDir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".json") && !expected.has(entry.name)) {
      await unlink(join(opts.outDir, entry.name));
    }
  }

  const summaries: Array<{
    name: string;
    type: string;
    description?: string;
    dependencies: string[];
    registryDependencies: string[];
  }> = [];

  const compiledItems = await Promise.all(items.map(compileItem));
  validateRegistryImports(compiledItems);

  for (const compiled of compiledItems) {
    await writeFile(
      join(opts.outDir, `${compiled.name}.json`),
      JSON.stringify(compiled, null, 2),
    );
    summaries.push({
      name: compiled.name,
      type: compiled.type,
      description: compiled.description,
      dependencies: compiled.dependencies,
      registryDependencies: compiled.registryDependencies,
    });
  }

  if (opts.manifestPath) {
    const entries = items.map((item) => {
      const fromDir = dirname(opts.manifestPath!);
      const importPath = relative(fromDir, join(item.dir, "meta")).replace(/\\/g, "/");
      return {
        name: item.meta.name,
        relativeImportPath: importPath.startsWith(".") ? importPath : `./${importPath}`,
      };
    });
    await writeManifest(opts.manifestPath, entries);
  }

  await writeFile(
    join(opts.outDir, "index.json"),
    JSON.stringify(summaries, null, 2),
  );
}
