import { test, expect } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
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

function writeMeta(dir: string, name: string) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "meta.ts"),
    `export default { name: ${JSON.stringify(name)}, type: "registry:ui", files: [{ source: "x.tsx", target: "x.tsx" }] };\n`,
  );
}

test("walkRegistry rejects names with path separators", async () => {
  const root = mkdtempSync(join(tmpdir(), "chrome-ui-walker-badname-"));
  writeMeta(join(root, "evil"), "../evil");
  await expect(walkRegistry(root)).rejects.toThrow(/"name" must match/);
  rmSync(root, { recursive: true, force: true });
});

test("walkRegistry rejects non-kebab-case names", async () => {
  const root = mkdtempSync(join(tmpdir(), "chrome-ui-walker-badcase-"));
  writeMeta(join(root, "my-button"), "My_Button");
  await expect(walkRegistry(root)).rejects.toThrow(/"name" must match/);
  rmSync(root, { recursive: true, force: true });
});

test("walkRegistry rejects a component named index", async () => {
  const root = mkdtempSync(join(tmpdir(), "chrome-ui-walker-index-"));
  writeMeta(join(root, "index"), "index");
  await expect(walkRegistry(root)).rejects.toThrow(/reserved/);
  rmSync(root, { recursive: true, force: true });
});

test("walkRegistry skips node_modules and dot-directories", async () => {
  const root = mkdtempSync(join(tmpdir(), "chrome-ui-walker-skip-"));
  writeMeta(join(root, "button"), "button");
  writeMeta(join(root, "node_modules", "stray"), "stray");
  writeMeta(join(root, ".cache", "hidden"), "hidden");
  const found = await walkRegistry(root);
  expect(found.map((f) => f.meta.name)).toEqual(["button"]);
  rmSync(root, { recursive: true, force: true });
});
