import { test, expect } from "bun:test";
import { join } from "node:path";
import { walkRegistry } from "../src/walker";

const FIXTURE = join(import.meta.dir, "fixtures/registry-a");

test("walkRegistry discovers all meta.ts files", async () => {
  const found = await walkRegistry(FIXTURE);
  const names = found.map((f) => f.meta.name).sort();
  expect(names).toEqual(["button", "utils"]);
});

test("walkRegistry returns absolute folder paths", async () => {
  const found = await walkRegistry(FIXTURE);
  for (const item of found) {
    expect(item.dir.startsWith(FIXTURE)).toBe(true);
  }
});
