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
      aliases: { components: "@/components/chrome", utils: "@/lib/utils" },
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

test("add errors when chrome.json missing", async () => {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-add-"));
  writeFileSync(join(dir, "package.json"), '{"name":"x"}');
  await expect(
    runAdd({ cwd: dir, names: ["button"], skipInstall: true, yes: true, fetch: async () => { throw new Error("x"); } }),
  ).rejects.toThrow(/chrome\.json/);
  rmSync(dir, { recursive: true, force: true });
});
