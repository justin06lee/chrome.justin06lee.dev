import { test, expect } from "bun:test";
import { unifiedDiff } from "../src/commands/diff";
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

test("sanitize strips ansi escapes and control chars but keeps newlines and tabs", () => {
  expect(sanitize("\x1b[31mred\x1b[0m")).toBe("red");
  expect(sanitize("\x1b]0;title\x07text")).toBe("text");
  expect(sanitize("a\x00b\x08c\x7fd")).toBe("abcd");
  expect(sanitize("line1\nline2\tend")).toBe("line1\nline2\tend");
});
