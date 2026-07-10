import { test, expect } from "bun:test";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { makeHttpFetcher, resolveItems } from "../src/registry";
import type { RegistryItem } from "../src/types";

const ITEMS: Record<string, RegistryItem> = {
  button: {
    name: "button", type: "registry:ui",
    dependencies: ["motion"], registryDependencies: ["utils"],
    files: [{ path: "button.tsx", content: "x", type: "registry:ui", target: "" }],
  },
  utils: {
    name: "utils", type: "registry:lib",
    dependencies: ["clsx", "tailwind-merge"], registryDependencies: [],
    files: [{ path: "utils.ts", content: "y", type: "registry:lib", target: "" }],
  },
};

test("resolveItems returns deps before dependents (topological order)", async () => {
  const order = await resolveItems(["button"], async (n) => {
    const i = ITEMS[n];
    if (!i) throw new Error("missing");
    return i;
  });
  expect(order.map((i) => i.name)).toEqual(["utils", "button"]);
});

test("resolveItems dedupes when multiple roots share a dep", async () => {
  const items: Record<string, RegistryItem> = {
    ...ITEMS,
    input: {
      name: "input", type: "registry:ui",
      dependencies: [], registryDependencies: ["utils"],
      files: [{ path: "input.tsx", content: "z", type: "registry:ui", target: "" }],
    },
  };
  const order = await resolveItems(["button", "input"], async (n) => items[n]!);
  expect(order.map((i) => i.name)).toEqual(["utils", "button", "input"]);
});

function fileRegistry(items: Record<string, unknown>): string {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-file-reg-"));
  for (const [name, item] of Object.entries(items)) {
    writeFileSync(join(dir, `${name}.json`), JSON.stringify(item));
  }
  return dir;
}

test("makeHttpFetcher reads items from a file:// registry", async () => {
  const dir = fileRegistry({ button: ITEMS.button, utils: ITEMS.utils });
  const fetcher = makeHttpFetcher(`file://${dir}`);
  const item = await fetcher("button");
  expect(item.name).toBe("button");
  expect(item.registryDependencies).toEqual(["utils"]);
  const order = await resolveItems(["button"], fetcher);
  expect(order.map((i) => i.name)).toEqual(["utils", "button"]);
  rmSync(dir, { recursive: true, force: true });
});

test("file:// registry reports a missing component as not found", async () => {
  const dir = fileRegistry({});
  const fetcher = makeHttpFetcher(`file://${dir}`);
  await expect(fetcher("ghost")).rejects.toThrow(/not found/);
  rmSync(dir, { recursive: true, force: true });
});

test("file:// registry rejects malformed json", async () => {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-file-reg-"));
  writeFileSync(join(dir, "broken.json"), "{ nope");
  const fetcher = makeHttpFetcher(`file://${dir}`);
  await expect(fetcher("broken")).rejects.toThrow(/invalid JSON/);
  rmSync(dir, { recursive: true, force: true });
});

test("fetcher rejects unsafe dependencies at parse time", async () => {
  const dir = fileRegistry({
    evil: {
      ...ITEMS.button, name: "evil",
      dependencies: ["--registry=https://evil.example"],
      registryDependencies: [],
    },
  });
  const fetcher = makeHttpFetcher(`file://${dir}`);
  await expect(fetcher("evil")).rejects.toThrow(/unsafe dependencies entry/);
  rmSync(dir, { recursive: true, force: true });
});

test("fetcher rejects unsafe devDependencies at parse time", async () => {
  const dir = fileRegistry({
    evil: {
      ...ITEMS.button, name: "evil",
      dependencies: [],
      devDependencies: ["pkg; rm -rf /"],
      registryDependencies: [],
    },
  });
  const fetcher = makeHttpFetcher(`file://${dir}`);
  await expect(fetcher("evil")).rejects.toThrow(/unsafe devDependencies entry/);
  rmSync(dir, { recursive: true, force: true });
});

test("fetcher accepts scoped and versioned dependencies", async () => {
  const dir = fileRegistry({
    ok: {
      ...ITEMS.button, name: "ok",
      dependencies: ["motion", "@types/node", "clsx@2.1.0", "@scope/pkg@^1.2.3"],
      registryDependencies: [],
    },
  });
  const fetcher = makeHttpFetcher(`file://${dir}`);
  const item = await fetcher("ok");
  expect(item.dependencies).toHaveLength(4);
  rmSync(dir, { recursive: true, force: true });
});
