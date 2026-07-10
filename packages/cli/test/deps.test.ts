import { test, expect } from "bun:test";
import { installCommand } from "../src/writers/deps";

test("emits the right install verb per pkg manager", () => {
  expect(installCommand("bun", ["motion"])).toEqual({ cmd: "bun", args: ["add", "motion"] });
  expect(installCommand("pnpm", ["motion"])).toEqual({ cmd: "pnpm", args: ["add", "motion"] });
  expect(installCommand("yarn", ["motion"])).toEqual({ cmd: "yarn", args: ["add", "motion"] });
  expect(installCommand("npm", ["motion"])).toEqual({ cmd: "npm", args: ["install", "motion"] });
});

test("returns null when no packages to install", () => {
  expect(installCommand("bun", [])).toBeNull();
});

test("dedupes packages", () => {
  expect(installCommand("bun", ["clsx", "clsx", "motion"])).toEqual({
    cmd: "bun", args: ["add", "clsx", "motion"],
  });
});

test("rejects package names that could be parsed as flags or shell input", () => {
  expect(() => installCommand("bun", ["--registry=https://evil.example"])).toThrow(/not a valid npm package name/);
  expect(() => installCommand("npm", ["-g"])).toThrow(/not a valid npm package name/);
  expect(() => installCommand("bun", ["pkg; rm -rf /"])).toThrow(/not a valid npm package name/);
  expect(() => installCommand("bun", ["pkg && echo pwned"])).toThrow(/not a valid npm package name/);
});

test("accepts scoped and versioned package names", () => {
  expect(installCommand("bun", ["@types/node"])).toEqual({ cmd: "bun", args: ["add", "@types/node"] });
  expect(installCommand("bun", ["clsx@2.1.0"])).toEqual({ cmd: "bun", args: ["add", "clsx@2.1.0"] });
  expect(installCommand("bun", ["@scope/pkg@^1.2.3"])).toEqual({ cmd: "bun", args: ["add", "@scope/pkg@^1.2.3"] });
});
