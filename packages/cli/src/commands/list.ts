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
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`✗ failed to load ${url} (${res.status})`);
      process.exit(1);
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      console.error(`✗ registry returned unexpected index format from ${url}`);
      process.exit(1);
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
