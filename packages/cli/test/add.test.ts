import { test, expect } from "bun:test";
import { mkdtempSync, writeFileSync, mkdirSync, existsSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { RegistryItem } from "../src/types";
import { runAdd } from "../src/commands/add";

const FAKE_REGISTRY: Record<string, RegistryItem> = {
  utils: {
    name: "utils", type: "registry:lib",
    dependencies: ["clsx", "tailwind-merge"], registryDependencies: [],
    files: [{ path: "utils.ts", type: "registry:lib", target: "", content: "export const cn = () => '';\n" }],
  },
  button: {
    name: "button", type: "registry:ui",
    dependencies: [], registryDependencies: ["utils"],
    files: [{ path: "button.tsx", type: "registry:ui", target: "", content: "export const Button = () => null;\n" }],
  },
  socials: {
    name: "socials", type: "registry:ui",
    dependencies: [], registryDependencies: [],
    files: [{ path: "socials.tsx", type: "registry:ui", target: "", content: "export const Socials = () => null;\n" }],
    css: ".socials { display: flex; gap: 8px; }\n",
  },
  tabs: {
    name: "tabs", type: "registry:ui",
    dependencies: [], devDependencies: ["@types/node"], registryDependencies: [],
    files: [
      { path: "use-tabs.ts", type: "registry:hook", target: "", content: "export const useTabs = () => ({});\n" },
      { path: "tabs.tsx", type: "registry:ui", target: "", content: "export const Tabs = () => null;\n" },
    ],
    cssVars: { ":root": { "--tab-accent": "#fff" } },
  },
};

function makeProject(): string {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-add-"));
  writeFileSync(join(dir, "bun.lock"), "");
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({ name: "x", dependencies: { next: "16.0.0" }, devDependencies: { tailwindcss: "^4" } }),
  );
  mkdirSync(join(dir, "app"));
  writeFileSync(join(dir, "app/globals.css"), `@import "tailwindcss";\n`);
  writeFileSync(
    join(dir, "chrome.json"),
    JSON.stringify({
      $schema: "x", registry: "x", style: "default", tsx: true,
      tailwind: { css: "app/globals.css", baseColor: "black" },
      aliases: { components: "@/components/chrome", utils: "@/lib/utils", hooks: "@/hooks" },
    }),
  );
  return dir;
}

test("add writes the requested component and its registryDependency", async () => {
  const dir = makeProject();
  await runAdd({
    cwd: dir, names: ["button"], skipInstall: true, yes: true,
    fetch: async (n) => {
      const i = FAKE_REGISTRY[n];
      if (!i) throw new Error("missing");
      return i;
    },
  });
  expect(existsSync(join(dir, "components/chrome/button.tsx"))).toBe(true);
  expect(existsSync(join(dir, "lib/utils.ts"))).toBe(true);
  expect(readFileSync(join(dir, "components/chrome/button.tsx"), "utf8")).toContain("Button");
  rmSync(dir, { recursive: true, force: true });
});

test("add patches a component's css into globals.css", async () => {
  const dir = makeProject();
  await runAdd({
    cwd: dir, names: ["socials"], skipInstall: true, yes: true,
    fetch: async (n) => {
      const i = FAKE_REGISTRY[n];
      if (!i) throw new Error("missing");
      return i;
    },
  });
  expect(existsSync(join(dir, "components/chrome/socials.tsx"))).toBe(true);
  const css = readFileSync(join(dir, "app/globals.css"), "utf8");
  expect(css).toContain("/* @chrome:css:socials */");
  expect(css).toContain(".socials { display: flex; gap: 8px; }");
  rmSync(dir, { recursive: true, force: true });
});

test("add routes registry:hook files to the hooks alias", async () => {
  const dir = makeProject();
  await runAdd({
    cwd: dir, names: ["tabs"], skipInstall: true, yes: true,
    fetch: async (n) => {
      const i = FAKE_REGISTRY[n];
      if (!i) throw new Error("missing");
      return i;
    },
  });
  // hook → hooks alias, styled file → components alias
  expect(existsSync(join(dir, "hooks/use-tabs.ts"))).toBe(true);
  expect(existsSync(join(dir, "components/chrome/tabs.tsx"))).toBe(true);
  expect(existsSync(join(dir, "components/chrome/use-tabs.ts"))).toBe(false);
  rmSync(dir, { recursive: true, force: true });
});

test("add installs a component's devDependencies alongside dependencies", async () => {
  const dir = makeProject();
  const installed: string[] = [];
  await runAdd({
    cwd: dir, names: ["tabs"], yes: true,
    fetch: async (n) => {
      const i = FAKE_REGISTRY[n];
      if (!i) throw new Error("missing");
      return i;
    },
    install: async (_pm, packages) => { installed.push(...packages); },
  });
  expect(installed).toContain("@types/node");
  rmSync(dir, { recursive: true, force: true });
});

test("add applies a component's cssVars into globals.css", async () => {
  const dir = makeProject();
  await runAdd({
    cwd: dir, names: ["tabs"], skipInstall: true, yes: true,
    fetch: async (n) => {
      const i = FAKE_REGISTRY[n];
      if (!i) throw new Error("missing");
      return i;
    },
  });
  const css = readFileSync(join(dir, "app/globals.css"), "utf8");
  expect(css).toContain("/* @chrome:css:tabs-vars */");
  expect(css).toContain("--tab-accent: #fff;");
  rmSync(dir, { recursive: true, force: true });
});

test("add errors when chrome.json missing", async () => {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-add-"));
  writeFileSync(join(dir, "package.json"), '{"name":"x"}');
  await expect(
    runAdd({ cwd: dir, names: ["button"], skipInstall: true, yes: true, fetch: async () => { throw new Error("x"); } }),
  ).rejects.toThrow(/chrome\.json/);
  rmSync(dir, { recursive: true, force: true });
});
