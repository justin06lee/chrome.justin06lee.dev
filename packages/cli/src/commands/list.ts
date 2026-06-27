import { defineCommand } from "citty";
import { DEFAULT_REGISTRY } from "../constants";

interface IndexEntry {
  name: string;
  type: string;
  description?: string;
}

export const listCommand = defineCommand({
  meta: { name: "list", description: "list available components" },
  args: { registry: { type: "string" } },
  async run({ args }) {
    const base = (args.registry ?? DEFAULT_REGISTRY).replace(/\/$/, "");
    const url = `${base}/index.json`;
    let res: Response;
    try {
      res = await fetch(url);
    } catch (err) {
      console.error(`✗ registry unreachable at ${url}: ${(err as Error).message}`);
      process.exit(1);
    }
    if (!res.ok) {
      console.error(`✗ failed to load ${url} (${res.status})`);
      process.exit(1);
    }
    let data: unknown;
    try {
      data = await res.json();
    } catch {
      console.error(`✗ registry returned invalid JSON from ${url}`);
      process.exit(1);
    }
    if (!Array.isArray(data)) {
      console.error(`✗ registry returned unexpected index format from ${url}`);
      process.exit(1);
    }
    for (const entry of data) {
      if (
        typeof entry !== "object" || entry === null ||
        typeof (entry as Record<string, unknown>).name !== "string" ||
        typeof (entry as Record<string, unknown>).type !== "string"
      ) {
        console.error(`✗ registry returned an invalid index entry from ${url}`);
        process.exit(1);
      }
    }
    const items = data as IndexEntry[];
    const grouped = new Map<string, IndexEntry[]>();
    for (const i of items) {
      const k = i.type;
      if (!grouped.has(k)) grouped.set(k, []);
      grouped.get(k)!.push(i);
    }
    for (const [type, entries] of grouped) {
      console.log(`\n${type}:`);
      for (const e of entries.sort((a, b) => a.name.localeCompare(b.name))) {
        const tail = e.description ? `  — ${e.description}` : "";
        console.log(`  ${e.name}${tail}`);
      }
    }
  },
});
