import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import type { RegistryItem } from "./types";
import { isValidPackageName } from "./writers/deps";

export type Fetcher = (name: string) => Promise<RegistryItem>;

export async function resolveItems(roots: string[], fetch: Fetcher): Promise<RegistryItem[]> {
  const seen = new Map<string, RegistryItem>();
  const order: string[] = [];

  async function visit(name: string): Promise<void> {
    if (seen.has(name)) return;
    const item = await fetch(name);
    seen.set(name, item);
    for (const dep of item.registryDependencies) {
      await visit(dep);
    }
    order.push(name);
  }

  for (const r of roots) await visit(r);
  return order.map((n) => seen.get(n)!);
}

const VALID_NAME = /^[a-z0-9][a-z0-9-]*$/;

async function loadRegistryJson(url: string, name: string): Promise<unknown> {
  if (url.startsWith("file://")) {
    let raw: string;
    try {
      raw = await readFile(fileURLToPath(url), "utf8");
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === "ENOENT") {
        throw new Error(`component "${name}" not found in registry (${url})`);
      }
      throw new Error(`registry unreachable at ${url}: ${(err as Error).message}`);
    }
    try {
      return JSON.parse(raw);
    } catch (err) {
      throw new Error(`registry returned invalid JSON for "${name}" (${url}): ${(err as Error).message}`);
    }
  }
  let res: Response;
  try {
    res = await fetch(url);
  } catch (err) {
    throw new Error(`registry unreachable at ${url}: ${(err as Error).message}`);
  }
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`component "${name}" not found in registry (${url})`);
    }
    throw new Error(`registry returned ${res.status} for ${url}`);
  }
  return res.json();
}

export function makeHttpFetcher(baseUrl: string): Fetcher {
  const base = baseUrl.replace(/\/$/, "");
  return async (name: string): Promise<RegistryItem> => {
    if (!VALID_NAME.test(name)) {
      throw new Error(
        `invalid component name "${name}": names must match /^[a-z0-9][a-z0-9-]*$/`,
      );
    }
    const url = `${base}/${name}.json`;
    const data = await loadRegistryJson(url, name);
    if (
      typeof data !== "object" || data === null ||
      typeof (data as Record<string, unknown>).name !== "string" ||
      typeof (data as Record<string, unknown>).type !== "string" ||
      !Array.isArray((data as Record<string, unknown>).files) ||
      !Array.isArray((data as Record<string, unknown>).dependencies) ||
      !Array.isArray((data as Record<string, unknown>).registryDependencies)
    ) {
      throw new Error(`registry returned invalid item shape for "${name}" (${url})`);
    }
    const registryDeps: unknown[] = (data as Record<string, unknown>).registryDependencies as unknown[];
    for (const dep of registryDeps) {
      if (typeof dep !== "string") {
        throw new Error(`registry item "${name}" has a non-string registryDependency (${url})`);
      }
    }
    const devDeps = (data as Record<string, unknown>).devDependencies;
    if (devDeps !== undefined && !Array.isArray(devDeps)) {
      throw new Error(`registry item "${name}" has a non-array devDependencies field (${url})`);
    }
    const depLists: Array<[string, unknown[]]> = [
      ["dependencies", (data as Record<string, unknown>).dependencies as unknown[]],
      ["devDependencies", (devDeps as unknown[] | undefined) ?? []],
    ];
    for (const [field, list] of depLists) {
      for (const dep of list) {
        if (typeof dep !== "string" || !isValidPackageName(dep)) {
          throw new Error(
            `registry item "${name}" has an unsafe ${field} entry ${JSON.stringify(dep)} (${url}) — remove it from the registry item before installing`,
          );
        }
      }
    }
    const files: unknown[] = (data as Record<string, unknown>).files as unknown[];
    for (const f of files) {
      if (
        typeof f !== "object" || f === null ||
        typeof (f as Record<string, unknown>).path !== "string" ||
        typeof (f as Record<string, unknown>).content !== "string"
      ) {
        throw new Error(`registry item "${name}" contains invalid file entry (${url})`);
      }
    }
    return data as RegistryItem;
  };
}
