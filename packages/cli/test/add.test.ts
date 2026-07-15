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
  "not-found": {
    name: "not-found", type: "registry:ui",
    dependencies: [], registryDependencies: [],
    files: [
      { path: "not-found.tsx", type: "registry:ui", target: "not-found.tsx", content: "export const NotFound = () => null;\n" },
      { path: "app/not-found.tsx", type: "registry:page", target: "app/not-found.tsx", content: "export default function Page() { return null; }\n" },
    ],
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

test("add rejects with a conflict error when the file exists and differs", async () => {
  const dir = makeProject();
  mkdirSync(join(dir, "components/chrome"), { recursive: true });
  writeFileSync(join(dir, "components/chrome/socials.tsx"), "// my local edits\n");
  await expect(
    runAdd({
      cwd: dir, names: ["socials"], skipInstall: true,
      fetch: async (n) => FAKE_REGISTRY[n]!,
    }),
  ).rejects.toThrow(/conflict/);
  // local file untouched
  expect(readFileSync(join(dir, "components/chrome/socials.tsx"), "utf8")).toContain("my local edits");
  rmSync(dir, { recursive: true, force: true });
});

test("add --overwrite replaces a conflicting file", async () => {
  const dir = makeProject();
  mkdirSync(join(dir, "components/chrome"), { recursive: true });
  writeFileSync(join(dir, "components/chrome/socials.tsx"), "// my local edits\n");
  await runAdd({
    cwd: dir, names: ["socials"], skipInstall: true, overwrite: true,
    fetch: async (n) => FAKE_REGISTRY[n]!,
  });
  expect(readFileSync(join(dir, "components/chrome/socials.tsx"), "utf8")).toContain("Socials");
  rmSync(dir, { recursive: true, force: true });
});

test("add --yes replaces a conflicting file", async () => {
  const dir = makeProject();
  mkdirSync(join(dir, "components/chrome"), { recursive: true });
  writeFileSync(join(dir, "components/chrome/socials.tsx"), "// my local edits\n");
  await runAdd({
    cwd: dir, names: ["socials"], skipInstall: true, yes: true,
    fetch: async (n) => FAKE_REGISTRY[n]!,
  });
  expect(readFileSync(join(dir, "components/chrome/socials.tsx"), "utf8")).toContain("Socials");
  rmSync(dir, { recursive: true, force: true });
});

test("add errors when chrome.json's tailwind.css escapes the project root", async () => {
  const dir = makeProject();
  writeFileSync(
    join(dir, "chrome.json"),
    JSON.stringify({
      $schema: "x", registry: "x", style: "default", tsx: true,
      tailwind: { css: "../outside/globals.css", baseColor: "black" },
      aliases: { components: "@/components/chrome", utils: "@/lib/utils", hooks: "@/hooks" },
    }),
  );
  await expect(
    runAdd({
      cwd: dir, names: ["socials"], skipInstall: true, yes: true,
      fetch: async (n) => FAKE_REGISTRY[n]!,
    }),
  ).rejects.toThrow(/escapes the project root/);
  rmSync(dir, { recursive: true, force: true });
});

test("add routes registry:page files into the app directory", async () => {
  const dir = makeProject(); // root layout: app/ exists
  await runAdd({
    cwd: dir, names: ["not-found"], skipInstall: true, yes: true,
    fetch: async (n) => FAKE_REGISTRY[n]!,
  });
  // ui file → components alias, page file → app/not-found.tsx
  expect(existsSync(join(dir, "components/chrome/not-found.tsx"))).toBe(true);
  expect(readFileSync(join(dir, "app/not-found.tsx"), "utf8")).toContain("export default");
  // the page file must not also land under the components alias
  expect(existsSync(join(dir, "components/chrome/app/not-found.tsx"))).toBe(false);
  rmSync(dir, { recursive: true, force: true });
});

test("add routes registry:page files into src/app on src layouts", async () => {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-add-"));
  writeFileSync(join(dir, "bun.lock"), "");
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({ name: "x", dependencies: { next: "16.0.0" }, devDependencies: { tailwindcss: "^4" } }),
  );
  writeFileSync(
    join(dir, "tsconfig.json"),
    JSON.stringify({ compilerOptions: { paths: { "@/*": ["./src/*"] } } }),
  );
  mkdirSync(join(dir, "src/app"), { recursive: true });
  writeFileSync(join(dir, "src/app/globals.css"), `@import "tailwindcss";\n`);
  writeFileSync(
    join(dir, "chrome.json"),
    JSON.stringify({
      $schema: "x", registry: "x", style: "default", tsx: true,
      tailwind: { css: "src/app/globals.css", baseColor: "black" },
      aliases: { components: "@/components/chrome", utils: "@/lib/utils", hooks: "@/hooks" },
    }),
  );
  await runAdd({
    cwd: dir, names: ["not-found"], skipInstall: true, yes: true,
    fetch: async (n) => FAKE_REGISTRY[n]!,
  });
  expect(existsSync(join(dir, "src/components/chrome/not-found.tsx"))).toBe(true);
  expect(existsSync(join(dir, "src/app/not-found.tsx"))).toBe(true);
  expect(existsSync(join(dir, "app/not-found.tsx"))).toBe(false);
  rmSync(dir, { recursive: true, force: true });
});

test("add reports a conflict for an existing, differing app page file", async () => {
  const dir = makeProject();
  writeFileSync(join(dir, "app/not-found.tsx"), "// my custom 404\n");
  await expect(
    runAdd({
      cwd: dir, names: ["not-found"], skipInstall: true,
      fetch: async (n) => FAKE_REGISTRY[n]!,
    }),
  ).rejects.toThrow(/conflict/);
  // local page untouched
  expect(readFileSync(join(dir, "app/not-found.tsx"), "utf8")).toContain("my custom 404");
  rmSync(dir, { recursive: true, force: true });
});

const IMPORTY: Record<string, RegistryItem> = {
  gallery: {
    name: "gallery", type: "registry:ui",
    dependencies: [], registryDependencies: [],
    files: [{
      path: "gallery.tsx", type: "registry:ui", target: "",
      content:
        `import { cn } from "@/lib/utils";\n` +
        `import { Chrome } from "@/components/ui/chrome";\n` +
        `import { useLineSync } from "@/hooks/use-line-sync";\n` +
        `export const Gallery = () => null;\n`,
    }],
  },
  "not-found-page": {
    name: "not-found-page", type: "registry:ui",
    dependencies: [], registryDependencies: [],
    files: [{
      path: "app/not-found.tsx", type: "registry:page", target: "app/not-found.tsx",
      content:
        `import { NotFound } from "@/components/ui/not-found";\n` +
        `export default function Page() { return <NotFound />; }\n`,
    }],
  },
};

test("add rewrites registry imports to the configured aliases", async () => {
  const dir = makeProject();
  writeFileSync(
    join(dir, "chrome.json"),
    JSON.stringify({
      $schema: "x", registry: "x", style: "default", tsx: true,
      tailwind: { css: "app/globals.css", baseColor: "black" },
      aliases: { components: "@/components/custom", utils: "@/utils/cn", hooks: "@/my-hooks" },
    }),
  );
  await runAdd({
    cwd: dir, names: ["gallery"], skipInstall: true, yes: true,
    fetch: async (n) => IMPORTY[n]!,
  });
  const written = readFileSync(join(dir, "components/custom/gallery.tsx"), "utf8");
  expect(written).toContain(`from "@/utils/cn"`);
  expect(written).toContain(`from "@/components/custom/chrome"`);
  expect(written).toContain(`from "@/my-hooks/use-line-sync"`);
  expect(written).not.toContain("@/components/ui/");
  expect(written).not.toContain(`"@/lib/utils"`);
  rmSync(dir, { recursive: true, force: true });
});

test("add rewrites @/components/ui to the default @/components/chrome alias", async () => {
  const dir = makeProject();
  await runAdd({
    cwd: dir, names: ["gallery"], skipInstall: true, yes: true,
    fetch: async (n) => IMPORTY[n]!,
  });
  const written = readFileSync(join(dir, "components/chrome/gallery.tsx"), "utf8");
  expect(written).toContain(`from "@/components/chrome/chrome"`);
  // default utils/hooks aliases are identity rewrites
  expect(written).toContain(`from "@/lib/utils"`);
  expect(written).toContain(`from "@/hooks/use-line-sync"`);
  rmSync(dir, { recursive: true, force: true });
});

test("add rewrites imports in page files too", async () => {
  const dir = makeProject();
  await runAdd({
    cwd: dir, names: ["not-found-page"], skipInstall: true, yes: true,
    fetch: async (n) => IMPORTY[n]!,
  });
  const page = readFileSync(join(dir, "app/not-found.tsx"), "utf8");
  expect(page).toContain(`from "@/components/chrome/not-found"`);
  rmSync(dir, { recursive: true, force: true });
});

test("add prefers the aliasBase recorded in chrome.json over live detection", async () => {
  const dir = makeProject(); // app/ exists, so live detection would say root
  writeFileSync(
    join(dir, "chrome.json"),
    JSON.stringify({
      $schema: "x", registry: "x", style: "default", tsx: true,
      tailwind: { css: "app/globals.css", baseColor: "black" },
      aliases: { components: "@/components/chrome", utils: "@/lib/utils", hooks: "@/hooks" },
      aliasBase: "src",
    }),
  );
  await runAdd({
    cwd: dir, names: ["button"], skipInstall: true, yes: true,
    fetch: async (n) => FAKE_REGISTRY[n]!,
  });
  expect(existsSync(join(dir, "src/components/chrome/button.tsx"))).toBe(true);
  expect(existsSync(join(dir, "src/lib/utils.ts"))).toBe(true);
  expect(existsSync(join(dir, "components/chrome/button.tsx"))).toBe(false);
  expect(existsSync(join(dir, "lib/utils.ts"))).toBe(false);
  rmSync(dir, { recursive: true, force: true });
});

test("add writes under src/ when tsconfig maps @/* to ./src/*", async () => {
  const dir = makeProject();
  writeFileSync(
    join(dir, "tsconfig.json"),
    JSON.stringify({ compilerOptions: { paths: { "@/*": ["./src/*"] } } }),
  );
  await runAdd({
    cwd: dir, names: ["button"], skipInstall: true, yes: true,
    fetch: async (n) => {
      if (n === "button")
        return {
          name: "button", type: "registry:ui", description: "", dependencies: [],
          registryDependencies: ["utils"],
          files: [{ path: "button.tsx", content: "// b", type: "registry:ui", target: "button.tsx" }],
        };
      return {
        name: "utils", type: "registry:lib", description: "", dependencies: [],
        registryDependencies: [],
        files: [{ path: "utils.ts", content: "// u", type: "registry:lib", target: "utils.ts" }],
      };
    },
  });
  expect(existsSync(join(dir, "src/components/chrome/button.tsx"))).toBe(true);
  expect(existsSync(join(dir, "src/lib/utils.ts"))).toBe(true);
  expect(existsSync(join(dir, "components/chrome/button.tsx"))).toBe(false);
});
