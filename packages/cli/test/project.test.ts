import { test, expect } from "bun:test";
import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { detectAliasBase, detectAppDir, detectProject } from "../src/project";

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

test("parseMajor anchors to the leading major version", async () => {
  const { parseMajor } = await import("../src/project");
  expect(parseMajor("^4")).toBe(4);
  expect(parseMajor("~4.1.0")).toBe(4);
  expect(parseMajor(">=4.0.0 <5")).toBe(4);
  expect(parseMajor("4.0.0-beta.1")).toBe(4);
  // non-semver ranges must not grab a stray digit
  expect(parseMajor("workspace:*")).toBeNull();
  expect(parseMajor("latest")).toBeNull();
  expect(parseMajor("catalog:tw3")).toBeNull();
  expect(parseMajor(undefined)).toBeNull();
});

test("throws a parse error for non-semver tailwind ranges", () => {
  const dir = tempProject((d) => {
    writeFileSync(join(d, "package.json"), '{"name":"x","devDependencies":{"tailwindcss":"workspace:*"}}');
  });
  expect(() => detectProject(dir)).toThrow(/could not parse tailwindcss version/);
  rmSync(dir, { recursive: true, force: true });
});

test("detectAliasBase reads the tsconfig @/* mapping", () => {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-alias-"));
  writeFileSync(
    join(dir, "tsconfig.json"),
    `{\n  // comment allowed\n  "compilerOptions": { "paths": { "@/*": ["./src/*"] } }\n}`,
  );
  expect(detectAliasBase(dir)).toBe("src");
  writeFileSync(
    join(dir, "tsconfig.json"),
    JSON.stringify({ compilerOptions: { paths: { "@/*": ["./*"] } } }),
  );
  expect(detectAliasBase(dir)).toBe("");
});

test("detectAliasBase falls back to probing for src/ without a tsconfig", () => {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-alias-"));
  expect(detectAliasBase(dir)).toBe("");
  mkdirSync(join(dir, "src"));
  expect(detectAliasBase(dir)).toBe("src");
  mkdirSync(join(dir, "app"));
  expect(detectAliasBase(dir)).toBe("");
});

test("detectAppDir prefers an existing app directory", () => {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-appdir-"));
  mkdirSync(join(dir, "app"));
  expect(detectAppDir(dir)).toBe("app");
  rmSync(dir, { recursive: true, force: true });
});

test("detectAppDir finds src/app on src layouts", () => {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-appdir-"));
  mkdirSync(join(dir, "src/app"), { recursive: true });
  expect(detectAppDir(dir)).toBe("src/app");
  rmSync(dir, { recursive: true, force: true });
});

test("detectAppDir falls back to the alias base when no app dir exists", () => {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-appdir-"));
  expect(detectAppDir(dir)).toBe("app");
  writeFileSync(
    join(dir, "tsconfig.json"),
    JSON.stringify({ compilerOptions: { paths: { "@/*": ["./src/*"] } } }),
  );
  expect(detectAppDir(dir)).toBe("src/app");
  rmSync(dir, { recursive: true, force: true });
});
