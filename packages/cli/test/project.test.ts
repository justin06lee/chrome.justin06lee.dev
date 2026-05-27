import { test, expect } from "bun:test";
import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { detectProject } from "../src/project";

function tempProject(setup: (dir: string) => void): string {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-proj-"));
  setup(dir);
  return dir;
}

test("detects bun via bun.lock", () => {
  const dir = tempProject((d) => {
    writeFileSync(join(d, "bun.lock"), "");
    writeFileSync(join(d, "package.json"), '{"name":"x","dependencies":{"next":"16.0.0","tailwindcss":"^4"}}');
  });
  const proj = detectProject(dir);
  expect(proj.packageManager).toBe("bun");
  expect(proj.framework).toBe("next");
  expect(proj.tailwindMajor).toBe(4);
  rmSync(dir, { recursive: true, force: true });
});

test("falls back to npm when no lockfile", () => {
  const dir = tempProject((d) => {
    writeFileSync(join(d, "package.json"), '{"name":"x","devDependencies":{"tailwindcss":"^4"}}');
  });
  expect(detectProject(dir).packageManager).toBe("npm");
  rmSync(dir, { recursive: true, force: true });
});

test("throws when tailwindcss is absent", () => {
  const dir = tempProject((d) => {
    writeFileSync(join(d, "package.json"), '{"name":"x","dependencies":{"next":"16.0.0"}}');
  });
  expect(() => detectProject(dir)).toThrow(/tailwindcss not found/);
  rmSync(dir, { recursive: true, force: true });
});

test("throws on tailwind v3", () => {
  const dir = tempProject((d) => {
    writeFileSync(join(d, "package.json"), '{"name":"x","devDependencies":{"tailwindcss":"^3.4"}}');
  });
  expect(() => detectProject(dir)).toThrow(/tailwind v4/i);
  rmSync(dir, { recursive: true, force: true });
});
