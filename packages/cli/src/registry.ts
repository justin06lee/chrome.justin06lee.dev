import type { RegistryItem } from "./types";

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

export function makeHttpFetcher(baseUrl: string): Fetcher {
  const base = baseUrl.replace(/\/$/, "");
  return async (name: string): Promise<RegistryItem> => {
    if (!VALID_NAME.test(name)) {
      throw new Error(
        `invalid component name "${name}": names must match /^[a-z0-9][a-z0-9-]*$/`,
      );
    }
    const url = `${base}/${name}.json`;
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
    const data = await res.json();
    if (
      typeof data !== "object" || data === null ||
      typeof (data as Record<string, unknown>).name !== "string" ||
      typeof (data as Record<string, unknown>).type !== "string" ||
      !Array.isArray((data as Record<string, unknown>).files)
    ) {
      throw new Error(`registry returned invalid item shape for "${name}" (${url})`);
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
