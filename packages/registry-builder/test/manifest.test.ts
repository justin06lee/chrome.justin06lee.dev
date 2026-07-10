import { test, expect } from "bun:test";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeManifest } from "../src/manifest";

test("writeManifest writes a TS file importing each meta module", async () => {
  const out = mkdtempSync(join(tmpdir(), "chrome-ui-manifest-"));
  const manifestPath = join(out, "registry-manifest.ts");
  await writeManifest(manifestPath, [
    { name: "button", relativeImportPath: "../packages/registry/button/meta" },
    { name: "utils",  relativeImportPath: "../packages/registry/_shared/utils/meta" },
  ]);
  const text = readFileSync(manifestPath, "utf8");
  expect(text).toContain('import button from "../packages/registry/button/meta"');
  expect(text).toContain('import utils from "../packages/registry/_shared/utils/meta"');
  expect(text).toContain("export const REGISTRY = [button, utils]");
  rmSync(out, { recursive: true, force: true });
});

test("writeManifest prefixes identifiers that are JS reserved words", async () => {
  const out = mkdtempSync(join(tmpdir(), "chrome-ui-manifest-reserved-"));
  const manifestPath = join(out, "registry-manifest.ts");
  await writeManifest(manifestPath, [
    { name: "switch", relativeImportPath: "../packages/registry/switch/meta" },
  ]);
  const text = readFileSync(manifestPath, "utf8");
  expect(text).toContain('import _switch from "../packages/registry/switch/meta"');
  expect(text).toContain("export const REGISTRY = [_switch]");
  rmSync(out, { recursive: true, force: true });
});
