import { test, expect } from "bun:test";
import { resolveItems } from "../src/registry";
import type { RegistryItem } from "../src/types";

const ITEMS: Record<string, RegistryItem> = {
  button: {
    name: "button", type: "registry:ui",
    dependencies: ["motion"], registryDependencies: ["utils"],
    files: [{ path: "button.tsx", content: "x", type: "registry:ui", target: "" }],
  },
  utils: {
    name: "utils", type: "registry:lib",
    dependencies: ["clsx", "tailwind-merge"], registryDependencies: [],
    files: [{ path: "utils.ts", content: "y", type: "registry:lib", target: "" }],
  },
};

test("resolveItems returns deps before dependents (topological order)", async () => {
  const order = await resolveItems(["button"], async (n) => {
    const i = ITEMS[n];
    if (!i) throw new Error("missing");
    return i;
  });
  expect(order.map((i) => i.name)).toEqual(["utils", "button"]);
});

test("resolveItems dedupes when multiple roots share a dep", async () => {
  const items: Record<string, RegistryItem> = {
    ...ITEMS,
    input: {
      name: "input", type: "registry:ui",
      dependencies: [], registryDependencies: ["utils"],
      files: [{ path: "input.tsx", content: "z", type: "registry:ui", target: "" }],
    },
  };
  const order = await resolveItems(["button", "input"], async (n) => items[n]!);
  expect(order.map((i) => i.name)).toEqual(["utils", "button", "input"]);
});
