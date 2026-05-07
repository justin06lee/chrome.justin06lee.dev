import { test, expect } from "bun:test";
import { mkdtempSync, existsSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeFileSafe } from "../src/writers/tsx";

test("creates file when absent", async () => {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-tsx-"));
  const path = join(dir, "components/chrome/button.tsx");
  const result = await writeFileSafe(path, "export const Button = () => null;");
  expect(result.action).toBe("written");
  expect(existsSync(path)).toBe(true);
  rmSync(dir, { recursive: true });
});

test("skips when content identical", async () => {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-tsx-"));
  const path = join(dir, "x.tsx");
  writeFileSync(path, "same");
  const result = await writeFileSafe(path, "same");
  expect(result.action).toBe("skipped");
  rmSync(dir, { recursive: true });
});

test("returns conflict when content differs and overwrite=false", async () => {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-tsx-"));
  const path = join(dir, "x.tsx");
  writeFileSync(path, "old");
  const result = await writeFileSafe(path, "new");
  expect(result.action).toBe("conflict");
  expect(readFileSync(path, "utf8")).toBe("old");
  rmSync(dir, { recursive: true });
});

test("overwrites when overwrite=true", async () => {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-tsx-"));
  const path = join(dir, "x.tsx");
  writeFileSync(path, "old");
  const result = await writeFileSafe(path, "new", { overwrite: true });
  expect(result.action).toBe("written");
  expect(readFileSync(path, "utf8")).toBe("new");
  rmSync(dir, { recursive: true });
});
