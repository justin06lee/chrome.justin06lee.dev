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

export function makeHttpFetcher(baseUrl: string): Fetcher {
  const base = baseUrl.replace(/\/$/, "");
  return async (name: string): Promise<RegistryItem> => {
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
    return (await res.json()) as RegistryItem;
  };
}
