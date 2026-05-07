import { test, expect } from "bun:test";
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
  expect(compiled.files[0].path).toBe("button.tsx");
  expect(compiled.files[0].content).toContain("export function Button");
  expect(compiled.registryDependencies).toEqual(["utils"]);
  expect(compiled.dependencies).toEqual([]);
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
