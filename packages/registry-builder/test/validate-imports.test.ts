import { test, expect } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { build } from "../src/build";
import {
  aliasImports,
  installedSpecifier,
  validateRegistryImports,
} from "../src/validate-imports";
import type { RegistryFile, RegistryItem } from "../src/schema";

function file(
  target: string,
  type: RegistryFile["type"],
  content = "",
): RegistryFile {
  return { path: target, target, type, content };
}

function item(
  name: string,
  type: RegistryItem["type"],
  files: RegistryFile[],
  registryDependencies: string[] = [],
): RegistryItem {
  return {
    name,
    type,
    dependencies: [],
    registryDependencies,
    files,
  };
}

const utils = item("utils", "registry:lib", [
  file("utils.ts", "registry:lib", "export function cn() {}"),
]);

test("installedSpecifier maps ui, hook, and lib files; skips css", () => {
  expect(installedSpecifier(file("tilt.tsx", "registry:ui"))).toBe(
    "@/components/ui/tilt",
  );
  expect(installedSpecifier(file("use-line-sync.ts", "registry:hook"))).toBe(
    "@/hooks/use-line-sync",
  );
  expect(installedSpecifier(file("utils.ts", "registry:lib"))).toBe(
    "@/lib/utils",
  );
  expect(installedSpecifier(file("theme.css", "registry:theme"))).toBeNull();
});

test("aliasImports finds static, re-export, and dynamic alias imports only", () => {
  const src = `
import { cn } from "@/lib/utils";
import { Tilt } from '@/components/ui/tilt';
export { useMenu } from "@/hooks/use-menu";
const lazy = import("@/components/ui/dialog");
import { other } from "@/registry/nope";
import { pkg } from "lucide-react";
`;
  expect(aliasImports(src)).toEqual([
    "@/lib/utils",
    "@/components/ui/tilt",
    "@/hooks/use-menu",
    "@/components/ui/dialog",
  ]);
});

test("passes when every alias import is directly declared", () => {
  const tilt = item(
    "tilt",
    "registry:ui",
    [file("tilt.tsx", "registry:ui", `import { cn } from "@/lib/utils";`)],
    ["utils"],
  );
  expect(() => validateRegistryImports([tilt, utils])).not.toThrow();
});

test("fails when an alias import's owner is missing from registryDependencies", () => {
  const tilt = item("tilt", "registry:ui", [
    file("tilt.tsx", "registry:ui", `import { cn } from "@/lib/utils";`),
  ]);
  expect(() => validateRegistryImports([tilt, utils])).toThrow(
    /\[tilt\].*@\/lib\/utils.*"utils".*missing from registryDependencies/,
  );
});

test("transitive coverage is not enough — direct declaration is required", () => {
  const editor = item(
    "editor",
    "registry:ui",
    [file("editor.tsx", "registry:ui", `import { cn } from "@/lib/utils";`)],
    ["utils"],
  );
  const desk = item(
    "desk",
    "registry:ui",
    [file("desk.tsx", "registry:ui", `import { cn } from "@/lib/utils";`)],
    ["editor"], // utils only available transitively via editor
  );
  expect(() => validateRegistryImports([desk, editor, utils])).toThrow(
    /\[desk\].*@\/lib\/utils.*missing from registryDependencies/,
  );
});

test("self-imports are exempt, including own hooks", () => {
  const editor = item("editor", "registry:ui", [
    file(
      "editor.tsx",
      "registry:ui",
      `import { useLineSync } from "@/hooks/use-line-sync";
import { EditorPreview } from "@/components/ui/editor-preview";`,
    ),
    file("editor-preview.tsx", "registry:ui"),
    file("use-line-sync.ts", "registry:hook"),
  ]);
  expect(() => validateRegistryImports([editor])).not.toThrow();
});

test("hook imports require the hook's owning component as a dependency", () => {
  const editor = item("editor", "registry:ui", [
    file("editor.tsx", "registry:ui"),
    file("use-line-sync.ts", "registry:hook"),
  ]);
  const prose = item("prose", "registry:ui", [
    file(
      "prose.tsx",
      "registry:ui",
      `import { useLineSync } from "@/hooks/use-line-sync";`,
    ),
  ]);
  expect(() => validateRegistryImports([prose, editor])).toThrow(
    /\[prose\].*@\/hooks\/use-line-sync.*"editor".*missing from registryDependencies/,
  );
  const proseOk = { ...prose, registryDependencies: ["editor"] };
  expect(() => validateRegistryImports([proseOk, editor])).not.toThrow();
});

test("unknown alias imports are errors", () => {
  const card = item("card", "registry:ui", [
    file(
      "card.tsx",
      "registry:ui",
      `import { Ghost } from "@/components/ui/ghost";`,
    ),
  ]);
  expect(() => validateRegistryImports([card])).toThrow(
    /\[card\].*@\/components\/ui\/ghost.*no registry item emits/,
  );
});

test("two components emitting the same installed module is an error", () => {
  const a = item("a", "registry:ui", [file("shared.tsx", "registry:ui")]);
  const b = item("b", "registry:ui", [file("shared.tsx", "registry:ui")]);
  expect(() => validateRegistryImports([a, b])).toThrow(
    /both "a" and "b".*@\/components\/ui\/shared/,
  );
});

test("aggregates every offender in one error message", () => {
  const tilt = item("tilt", "registry:ui", [
    file("tilt.tsx", "registry:ui", `import { cn } from "@/lib/utils";`),
  ]);
  const stack = item("stack", "registry:ui", [
    file("stack.tsx", "registry:ui", `import { cn } from "@/lib/utils";`),
  ]);
  let message = "";
  try {
    validateRegistryImports([tilt, stack, utils]);
  } catch (err) {
    message = (err as Error).message;
  }
  expect(message).toContain("[tilt]");
  expect(message).toContain("[stack]");
});

test("build fails loudly on an uncovered alias import (fixture registry-b)", async () => {
  const outDir = mkdtempSync(join(tmpdir(), "chrome-ui-validate-imports-"));
  const fixture = join(import.meta.dir, "fixtures/registry-b");
  await expect(build({ registryDir: fixture, outDir })).rejects.toThrow(
    /\[badge\].*@\/lib\/utils.*"utils".*missing from registryDependencies/,
  );
  rmSync(outDir, { recursive: true, force: true });
});

test("build passes when alias imports are covered (fixture registry-a)", async () => {
  const outDir = mkdtempSync(join(tmpdir(), "chrome-ui-validate-imports-ok-"));
  const fixture = join(import.meta.dir, "fixtures/registry-a");
  await expect(build({ registryDir: fixture, outDir })).resolves.toBeUndefined();
  rmSync(outDir, { recursive: true, force: true });
});
