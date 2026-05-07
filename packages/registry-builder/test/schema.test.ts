import { test, expect } from "bun:test";
import type { RegistryItem, ComponentMeta } from "../src/schema";

test("RegistryItem has shadcn-compatible required fields", () => {
  const item: RegistryItem = {
    name: "button",
    type: "registry:ui",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "button.tsx", content: "x", type: "registry:ui", target: "" }],
  };
  expect(item.name).toBe("button");
});

test("ComponentMeta accepts the documented shape", () => {
  const meta: ComponentMeta = {
    name: "button",
    type: "registry:ui",
    description: "a button",
    dependencies: ["motion"],
    devDependencies: [],
    registryDependencies: ["utils"],
    files: [{ source: "button.tsx", target: "button.tsx" }],
    cssVars: {},
    props: [],
  };
  expect(meta.name).toBe("button");
});
