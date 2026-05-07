import { test, expect } from "bun:test";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { patchGlobalsCss } from "../src/writers/css";

function temp(content: string): string {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-css-"));
  const path = join(dir, "globals.css");
  writeFileSync(path, content);
  return path;
}

const BLOCK = `:root { --background: #000; }`;

test("appends fenced block when absent", async () => {
  const path = temp(`@import "tailwindcss";\n`);
  await patchGlobalsCss(path, BLOCK);
  const out = readFileSync(path, "utf8");
  expect(out).toContain("/* @chrome:theme */");
  expect(out).toContain("/* @chrome:end */");
  expect(out).toContain("--background: #000");
  rmSync(path, { force: true });
});

test("replaces block on second patch (idempotent)", async () => {
  const path = temp(`@import "tailwindcss";\n`);
  await patchGlobalsCss(path, BLOCK);
  await patchGlobalsCss(path, `:root { --background: #fff; }`);
  const out = readFileSync(path, "utf8");
  expect(out).toContain("--background: #fff");
  expect(out).not.toContain("--background: #000");
  expect((out.match(/@chrome:theme/g) ?? []).length).toBe(1);
  rmSync(path, { force: true });
});
