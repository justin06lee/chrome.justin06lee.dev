import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { walkRegistry } from "./walker";
import { compileItem } from "./compile";
import { validateRegistry } from "./validate";

export interface BuildOptions {
  registryDir: string;
  outDir: string;
}

export async function build(opts: BuildOptions): Promise<void> {
  const items = await walkRegistry(opts.registryDir);
  validateRegistry(items.map((i) => i.meta));

  await mkdir(opts.outDir, { recursive: true });

  const summaries: Array<{
    name: string;
    type: string;
    description?: string;
    dependencies: string[];
    registryDependencies: string[];
  }> = [];

  for (const item of items) {
    const compiled = await compileItem(item);
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

  await writeFile(
    join(opts.outDir, "index.json"),
    JSON.stringify(summaries, null, 2),
  );
}
