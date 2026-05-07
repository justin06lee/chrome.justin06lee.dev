import { test, expect, beforeEach } from "bun:test";
import { mkdtempSync, rmSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { build } from "../src/build";

const FIXTURE = join(import.meta.dir, "fixtures/registry-a");

let outDir: string;
beforeEach(() => {
  outDir = mkdtempSync(join(tmpdir(), "chrome-ui-build-"));
});

test("build emits one JSON per component plus index.json", async () => {
  await build({ registryDir: FIXTURE, outDir });
  expect(existsSync(join(outDir, "button.json"))).toBe(true);
  expect(existsSync(join(outDir, "utils.json"))).toBe(true);
  expect(existsSync(join(outDir, "index.json"))).toBe(true);
  const button = JSON.parse(readFileSync(join(outDir, "button.json"), "utf8"));
  expect(button.name).toBe("button");
  expect(button.files[0].content).toContain("export function Button");
  rmSync(outDir, { recursive: true, force: true });
});

test("index.json contains a summary entry per component", async () => {
  await build({ registryDir: FIXTURE, outDir });
  const index = JSON.parse(readFileSync(join(outDir, "index.json"), "utf8"));
  expect(Array.isArray(index)).toBe(true);
  expect(index.map((e: { name: string }) => e.name).sort()).toEqual(["button", "utils"]);
  rmSync(outDir, { recursive: true, force: true });
});
