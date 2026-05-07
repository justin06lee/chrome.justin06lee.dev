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
