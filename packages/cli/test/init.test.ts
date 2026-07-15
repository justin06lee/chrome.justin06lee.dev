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
  expect(existsSync(join(dir, "chrome.json"))).toBe(true);
  const css = readFileSync(join(dir, "app/globals.css"), "utf8");
  expect(css).toContain("/* @chrome:theme */");
  expect(css).toContain("--background: #000000");
  rmSync(dir, { recursive: true, force: true });
});

test("init records the alias base in chrome.json (root layout)", async () => {
  const dir = fakeNextProject();
  await runInit({ cwd: dir, yes: true, skipInstall: true });
  const cfg = JSON.parse(readFileSync(join(dir, "chrome.json"), "utf8"));
  expect(cfg.aliasBase).toBe("");
  rmSync(dir, { recursive: true, force: true });
});

test("init records aliasBase 'src' on src layouts and writes lib under src/", async () => {
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
  writeFileSync(
    join(dir, "tsconfig.json"),
    // trailing comma on purpose — next.js scaffolds jsonc
    `{ "compilerOptions": { "paths": { "@/*": ["./src/*"], } } }`,
  );
  mkdirSync(join(dir, "src/app"), { recursive: true });
  writeFileSync(join(dir, "src/app/globals.css"), `@import "tailwindcss";\n`);
  await runInit({ cwd: dir, yes: true, skipInstall: true });
  const cfg = JSON.parse(readFileSync(join(dir, "chrome.json"), "utf8"));
  expect(cfg.aliasBase).toBe("src");
  expect(existsSync(join(dir, "src/lib/utils.ts"))).toBe(true);
  expect(existsSync(join(dir, "lib/utils.ts"))).toBe(false);
  rmSync(dir, { recursive: true, force: true });
});

test("init is idempotent", async () => {
  const dir = fakeNextProject();
  await runInit({ cwd: dir, yes: true, skipInstall: true });
  await runInit({ cwd: dir, yes: true, skipInstall: true });
  const css = readFileSync(join(dir, "app/globals.css"), "utf8");
  expect((css.match(/@chrome:theme/g) ?? []).length).toBe(1);
  rmSync(dir, { recursive: true, force: true });
});
