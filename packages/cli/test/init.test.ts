import { test, expect } from "bun:test";
import { mkdtempSync, writeFileSync, mkdirSync, existsSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runInit } from "../src/commands/init";

function fakeNextProject(): string {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-init-"));
  writeFileSync(join(dir, "bun.lock"), "");
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({
      name: "x",
      dependencies: { next: "16.0.0" },
      devDependencies: { tailwindcss: "^4", typescript: "^5" },
    }),
  );
  mkdirSync(join(dir, "app"), { recursive: true });
  writeFileSync(join(dir, "app/globals.css"), `@import "tailwindcss";\n`);
  return dir;
}

test("init writes config, patches globals.css, accepts --yes", async () => {
  const dir = fakeNextProject();
  await runInit({ cwd: dir, yes: true, skipInstall: true });
  expect(existsSync(join(dir, "chrome.ui.json"))).toBe(true);
  const css = readFileSync(join(dir, "app/globals.css"), "utf8");
  expect(css).toContain("/* @chrome.ui:theme */");
  expect(css).toContain("--background: #000000");
  rmSync(dir, { recursive: true, force: true });
});

test("init is idempotent", async () => {
  const dir = fakeNextProject();
  await runInit({ cwd: dir, yes: true, skipInstall: true });
  await runInit({ cwd: dir, yes: true, skipInstall: true });
  const css = readFileSync(join(dir, "app/globals.css"), "utf8");
  expect((css.match(/@chrome\.ui:theme/g) ?? []).length).toBe(1);
  rmSync(dir, { recursive: true, force: true });
});
