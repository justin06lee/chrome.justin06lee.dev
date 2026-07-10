import { basename } from "node:path";
import type { RegistryFile, RegistryItem } from "./schema";

/** Extensions that produce importable modules once installed. */
const IMPORTABLE_EXT = /\.(tsx|ts|jsx|js)$/;

/**
 * The module specifier a shipped file resolves to after the CLI installs it.
 * Mirrors packages/cli install targets: registry:ui files land under the
 * components alias (`@/components/ui/...` in shipped source), registry:hook
 * files under `@/hooks`, registry:lib files under `@/lib`. Theme/CSS files
 * are not importable modules.
 */
export function installedSpecifier(file: RegistryFile): string | null {
  if (!IMPORTABLE_EXT.test(file.target)) return null;
  const base = basename(file.target).replace(IMPORTABLE_EXT, "");
  switch (file.type) {
    case "registry:ui":
      return `@/components/ui/${base}`;
    case "registry:hook":
      return `@/hooks/${base}`;
    case "registry:lib":
      return `@/lib/${base}`;
    default:
      return null;
  }
}

/** Alias import specifiers (`@/components/ui/...`, `@/hooks/...`, `@/lib/...`)
 *  referenced by `import`/`export ... from`/`import(...)` in a source file. */
export function aliasImports(source: string): string[] {
  const out: string[] = [];
  const re = /(?:\bfrom\s*|\bimport\s*\(?\s*)["'](@\/(?:components\/ui|hooks|lib)\/[^"']+)["']/g;
  for (const match of source.matchAll(re)) {
    out.push(match[1]!);
  }
  return out;
}

/**
 * Fails loudly when a shipped file's alias imports aren't covered by the
 * component's own registryDependencies. Coverage must be declared directly on
 * each component (transitive availability is not enough — that is how the
 * existing metas declare `utils`). Self-imports are exempt.
 */
export function validateRegistryImports(items: RegistryItem[]): void {
  // Map every emitted module specifier to its owning component.
  const owners = new Map<string, string>();
  const errors: string[] = [];
  for (const item of items) {
    for (const file of item.files) {
      const spec = installedSpecifier(file);
      if (!spec) continue;
      const existing = owners.get(spec);
      if (existing && existing !== item.name) {
        errors.push(
          `both "${existing}" and "${item.name}" emit a file installed as ${spec}`,
        );
        continue;
      }
      owners.set(spec, item.name);
    }
  }

  for (const item of items) {
    const deps = new Set(item.registryDependencies ?? []);
    for (const file of item.files) {
      if (!IMPORTABLE_EXT.test(file.target)) continue;
      for (const spec of aliasImports(file.content)) {
        const owner = owners.get(spec);
        if (!owner) {
          errors.push(
            `[${item.name}] ${file.target} imports ${spec}, but no registry item emits that module`,
          );
          continue;
        }
        if (owner === item.name) continue; // self-import
        if (!deps.has(owner)) {
          errors.push(
            `[${item.name}] ${file.target} imports ${spec} (owned by "${owner}"), but "${owner}" is missing from registryDependencies`,
          );
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `alias-import validation failed:\n  - ${errors.join("\n  - ")}`,
    );
  }
}
