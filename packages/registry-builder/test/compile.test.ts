import { test, expect } from "bun:test";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { walkRegistry } from "../src/walker";
import { compileItem } from "../src/compile";

const FIXTURE = join(import.meta.dir, "fixtures/registry-a");

test("compileItem reads source files and produces RegistryItem JSON", async () => {
  const items = await walkRegistry(FIXTURE);
  const button = items.find((i) => i.meta.name === "button")!;
  const compiled = await compileItem(button);
  expect(compiled.name).toBe("button");
  expect(compiled.type).toBe("registry:ui");
  expect(compiled.files).toHaveLength(1);
  const file = compiled.files[0];
  expect(file).toBeDefined();
  expect(file!.path).toBe("button.tsx");
  expect(file!.content).toContain("export function Button");
  expect(compiled.registryDependencies).toEqual(["utils"]);
  expect(compiled.dependencies).toEqual([]);
});

test("compileItem honors a per-file type override, defaulting to meta.type", async () => {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-compile-hook-"));
  writeFileSync(join(dir, "use-tabs.ts"), "export const useTabs = () => ({});\n");
  writeFileSync(join(dir, "tabs.tsx"), "export function Tabs() { return null; }\n");
  const compiled = await compileItem({
    dir,
    meta: {
      name: "tabs",
      type: "registry:ui" as const,
      files: [
        { source: "use-tabs.ts", target: "use-tabs.ts", type: "registry:hook" as const },
        { source: "tabs.tsx", target: "tabs.tsx" },
      ],
    },
  });
  const hook = compiled.files.find((f) => f.path === "use-tabs.ts")!;
  const styled = compiled.files.find((f) => f.path === "tabs.tsx")!;
  expect(hook.type).toBe("registry:hook");
  expect(styled.type).toBe("registry:ui");
  rmSync(dir, { recursive: true, force: true });
});

test("compileItem fails clearly when source file is missing", async () => {
  const item = {
    dir: join(FIXTURE, "button"),
    meta: {
      name: "button",
      type: "registry:ui" as const,
      files: [{ source: "missing.tsx", target: "missing.tsx" }],
    },
  };
  await expect(compileItem(item)).rejects.toThrow(/missing\.tsx/);
});

test("compileItem emits css when meta.cssFile is set", async () => {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-compile-css-"));
  writeFileSync(join(dir, "socials.tsx"), "export function Socials() { return null; }\n");
  writeFileSync(join(dir, "socials.css"), ".socials { display: flex; }\n");
  const compiled = await compileItem({
    dir,
    meta: {
      name: "socials",
      type: "registry:ui" as const,
      files: [{ source: "socials.tsx", target: "socials.tsx" }],
      cssFile: "socials.css",
    },
  });
  expect(compiled.css).toBe(".socials { display: flex; }\n");
  rmSync(dir, { recursive: true, force: true });
});

test("compileItem omits css when meta.cssFile is unset", async () => {
  const items = await walkRegistry(FIXTURE);
  const button = items.find((i) => i.meta.name === "button")!;
  const compiled = await compileItem(button);
  expect(compiled.css).toBeUndefined();
});

test("compileItem fails clearly when cssFile is missing", async () => {
  const item = {
    dir: join(FIXTURE, "button"),
    meta: {
      name: "button",
      type: "registry:ui" as const,
      files: [{ source: "button.tsx", target: "button.tsx" }],
      cssFile: "missing.css",
    },
  };
  await expect(compileItem(item)).rejects.toThrow(/missing\.css/);
});

test("compileItem rejects a files source that escapes the component folder", async () => {
  const item = {
    dir: join(FIXTURE, "button"),
    meta: {
      name: "button",
      type: "registry:ui" as const,
      files: [{ source: "../_shared/utils/utils.ts", target: "utils.ts" }],
    },
  };
  await expect(compileItem(item)).rejects.toThrow(/escapes the component folder/);
});

test("compileItem rejects a cssFile that escapes the component folder", async () => {
  const item = {
    dir: join(FIXTURE, "button"),
    meta: {
      name: "button",
      type: "registry:ui" as const,
      files: [{ source: "button.tsx", target: "button.tsx" }],
      cssFile: "../../../../etc/passwd",
    },
  };
  await expect(compileItem(item)).rejects.toThrow(/escapes the component folder/);
});

test("compileItem still allows nested sources inside the component folder", async () => {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-compile-nested-"));
  writeFileSync(join(dir, "widget.tsx"), "export function Widget() { return null; }\n");
  const compiled = await compileItem({
    dir,
    meta: {
      name: "widget",
      type: "registry:ui" as const,
      files: [{ source: "./widget.tsx", target: "widget.tsx" }],
    },
  });
  expect(compiled.files[0]!.content).toContain("export function Widget");
  rmSync(dir, { recursive: true, force: true });
});
