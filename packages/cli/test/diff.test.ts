import { test, expect } from "bun:test";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { RegistryItem } from "../src/types";
import { runAdd } from "../src/commands/add";
import { runDiff, unifiedDiff } from "../src/commands/diff";
import { sanitize } from "../src/sanitize";

test("identical content reports no diff", () => {
  expect(unifiedDiff("a\nb\n", "a\nb\n", "x.tsx")).toBe("(no diff for x.tsx)");
});

test("a single inserted line does not mark subsequent lines changed", () => {
  const local = "one\ntwo\nthree";
  const remote = "one\ninserted\ntwo\nthree";
  const out = unifiedDiff(local, remote, "x.tsx");
  const changed = out.split("\n").filter((l) => l.startsWith("+ ") || l.startsWith("- "));
  expect(changed).toEqual(["+ inserted"]);
});

test("a single deleted line does not mark subsequent lines changed", () => {
  const local = "one\ntwo\nthree\nfour";
  const remote = "one\nthree\nfour";
  const out = unifiedDiff(local, remote, "x.tsx");
  const changed = out.split("\n").filter((l) => l.startsWith("+ ") || l.startsWith("- "));
  expect(changed).toEqual(["- two"]);
});

test("a replaced line shows one - and one +", () => {
  const out = unifiedDiff("a\nb\nc", "a\nB\nc", "x.tsx");
  const changed = out.split("\n").filter((l) => l.startsWith("+ ") || l.startsWith("- "));
  expect(changed).toEqual(["- b", "+ B"]);
});

const GALLERY: RegistryItem = {
  name: "gallery", type: "registry:ui",
  dependencies: [], registryDependencies: [],
  files: [{
    path: "gallery.tsx", type: "registry:ui", target: "",
    content:
      `import { cn } from "@/lib/utils";\n` +
      `import { Chrome } from "@/components/ui/chrome";\n` +
      `export const Gallery = () => null;\n`,
  }],
};

function projectWithAliases(aliases: Record<string, string>, aliasBase?: string): string {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-diff-"));
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
      aliases,
      ...(aliasBase === undefined ? {} : { aliasBase }),
    }),
  );
  return dir;
}

test("diff applies the same import rewrite as add — a fresh install shows no drift", async () => {
  const aliases = { components: "@/components/custom", utils: "@/utils/cn", hooks: "@/my-hooks" };
  const dir = projectWithAliases(aliases);
  await runAdd({
    cwd: dir, names: ["gallery"], skipInstall: true, yes: true,
    fetch: async () => GALLERY,
  });
  const lines: string[] = [];
  await runDiff({ cwd: dir, name: "gallery", fetch: async () => GALLERY, log: (l) => lines.push(l) });
  expect(lines.join("\n")).toContain("(no diff for gallery.tsx)");
  rmSync(dir, { recursive: true, force: true });
});

test("diff honors the aliasBase recorded in chrome.json", async () => {
  const aliases = { components: "@/components/chrome", utils: "@/lib/utils", hooks: "@/hooks" };
  const dir = projectWithAliases(aliases, "src"); // app/ exists, live probe would say root
  await runAdd({
    cwd: dir, names: ["gallery"], skipInstall: true, yes: true,
    fetch: async () => GALLERY,
  });
  const lines: string[] = [];
  await runDiff({ cwd: dir, name: "gallery", fetch: async () => GALLERY, log: (l) => lines.push(l) });
  // add wrote under src/; diff must look in the same place, not report a missing copy
  expect(lines.join("\n")).toContain("(no diff for gallery.tsx)");
  rmSync(dir, { recursive: true, force: true });
});

test("diff reports real local edits as drift after the rewrite", async () => {
  const aliases = { components: "@/components/custom", utils: "@/utils/cn", hooks: "@/my-hooks" };
  const dir = projectWithAliases(aliases);
  await runAdd({
    cwd: dir, names: ["gallery"], skipInstall: true, yes: true,
    fetch: async () => GALLERY,
  });
  writeFileSync(
    join(dir, "components/custom/gallery.tsx"),
    `import { cn } from "@/utils/cn";\n` +
    `import { Chrome } from "@/components/custom/chrome";\n` +
    `export const Gallery = () => <div />;\n`,
  );
  const lines: string[] = [];
  await runDiff({ cwd: dir, name: "gallery", fetch: async () => GALLERY, log: (l) => lines.push(l) });
  const out = lines.join("\n");
  expect(out).toContain("- export const Gallery = () => <div />;");
  expect(out).toContain("+ export const Gallery = () => null;");
  // alias differences must not appear in the diff
  expect(out).not.toContain("@/components/ui/");
  rmSync(dir, { recursive: true, force: true });
});

test("diff throws when chrome.json is missing", async () => {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-diff-"));
  await expect(runDiff({ cwd: dir, name: "gallery", fetch: async () => GALLERY })).rejects.toThrow(
    /chrome\.json/,
  );
  rmSync(dir, { recursive: true, force: true });
});

test("sanitize strips ansi escapes and control chars but keeps newlines and tabs", () => {
  expect(sanitize("\x1b[31mred\x1b[0m")).toBe("red");
  expect(sanitize("\x1b]0;title\x07text")).toBe("text");
  expect(sanitize("a\x00b\x08c\x7fd")).toBe("abcd");
  expect(sanitize("line1\nline2\tend")).toBe("line1\nline2\tend");
});
