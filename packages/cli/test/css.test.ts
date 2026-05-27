import { test, expect } from "bun:test";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { patchGlobalsCss, serializeCssVars } from "../src/writers/css";

function temp(content: string): string {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-css-"));
  const path = join(dir, "globals.css");
  writeFileSync(path, content);
  return path;
}

const BLOCK = `:root { --background: #000; }`;

test("appends fenced block when absent", async () => {
  const path = temp(`@import "tailwindcss";\n`);
  await patchGlobalsCss(path, BLOCK);
  const out = readFileSync(path, "utf8");
  expect(out).toContain("/* @chrome:theme */");
  expect(out).toContain("/* @chrome:end */");
  expect(out).toContain("--background: #000");
  rmSync(path, { force: true });
});

test("replaces block on second patch (idempotent)", async () => {
  const path = temp(`@import "tailwindcss";\n`);
  await patchGlobalsCss(path, BLOCK);
  await patchGlobalsCss(path, `:root { --background: #fff; }`);
  const out = readFileSync(path, "utf8");
  expect(out).toContain("--background: #fff");
  expect(out).not.toContain("--background: #000");
  expect((out.match(/@chrome:theme/g) ?? []).length).toBe(1);
  rmSync(path, { force: true });
});

test("per-component block coexists with theme block", async () => {
  const path = temp(`@import "tailwindcss";\n`);
  await patchGlobalsCss(path, BLOCK);
  await patchGlobalsCss(path, `.socials { display: flex; }`, "socials");
  const out = readFileSync(path, "utf8");
  expect(out).toContain("/* @chrome:theme */");
  expect(out).toContain("/* @chrome:css:socials */");
  expect(out).toContain("--background: #000");
  expect(out).toContain(".socials { display: flex; }");
  rmSync(path, { force: true });
});

test("re-patching the same blockId replaces that block", async () => {
  const path = temp(`@import "tailwindcss";\n`);
  await patchGlobalsCss(path, `.socials { gap: 4px; }`, "socials");
  await patchGlobalsCss(path, `.socials { gap: 8px; }`, "socials");
  const out = readFileSync(path, "utf8");
  expect(out).toContain(".socials { gap: 8px; }");
  expect(out).not.toContain(".socials { gap: 4px; }");
  expect((out.match(/@chrome:css:socials/g) ?? []).length).toBe(1);
  rmSync(path, { force: true });
});

test("serializeCssVars renders each selector as a rule with its vars", () => {
  const out = serializeCssVars({
    ":root": { "--ring": "#fff", "--ring-offset": "2px" },
    ".dark": { "--ring": "#000" },
  });
  expect(out).toContain(":root {");
  expect(out).toContain("--ring: #fff;");
  expect(out).toContain("--ring-offset: 2px;");
  expect(out).toContain(".dark {");
  expect(out).toContain("--ring: #000;");
});

test("serializeCssVars returns empty string for no vars", () => {
  expect(serializeCssVars(undefined)).toBe("");
  expect(serializeCssVars({})).toBe("");
});

test("distinct blockIds do not clobber each other", async () => {
  const path = temp(`@import "tailwindcss";\n`);
  await patchGlobalsCss(path, BLOCK);
  await patchGlobalsCss(path, `.socials { gap: 8px; }`, "socials");
  await patchGlobalsCss(path, `.marquee { overflow: hidden; }`, "marquee");
  // re-patch theme — must not touch the component blocks
  await patchGlobalsCss(path, `:root { --background: #fff; }`);
  const out = readFileSync(path, "utf8");
  expect(out).toContain("--background: #fff");
  expect(out).toContain(".socials { gap: 8px; }");
  expect(out).toContain(".marquee { overflow: hidden; }");
  expect((out.match(/@chrome:end/g) ?? []).length).toBe(3);
  rmSync(path, { force: true });
});
