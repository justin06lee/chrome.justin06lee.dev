import type { ComponentMeta } from "./schema";

export function validateRegistry(metas: ComponentMeta[]): void {
  const seen = new Set<string>();
  for (const m of metas) {
    if (seen.has(m.name)) {
      throw new Error(`duplicate component name: ${m.name}`);
    }
    seen.add(m.name);
  }
  for (const m of metas) {
    for (const dep of m.registryDependencies ?? []) {
      if (!seen.has(dep)) {
        throw new Error(
          `${m.name} depends on registry item "${dep}", but no component with that name exists`,
        );
      }
    }
  }
}
