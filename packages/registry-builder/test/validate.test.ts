import { test, expect } from "bun:test";
import { validateRegistry } from "../src/validate";
import type { ComponentMeta } from "../src/schema";

const button: ComponentMeta = {
  name: "button",
  type: "registry:ui",
  files: [{ source: "button.tsx", target: "button.tsx" }],
  registryDependencies: ["utils"],
};

const utils: ComponentMeta = {
  name: "utils",
  type: "registry:lib",
  files: [{ source: "utils.ts", target: "utils.ts" }],
};

test("validateRegistry passes when all deps resolve", () => {
  expect(() => validateRegistry([button, utils])).not.toThrow();
});

test("validateRegistry throws on dangling registryDependency", () => {
  expect(() => validateRegistry([button])).toThrow(/button.*depends on.*utils/);
});

test("validateRegistry throws on duplicate names", () => {
  expect(() => validateRegistry([button, button])).toThrow(/duplicate/);
});
