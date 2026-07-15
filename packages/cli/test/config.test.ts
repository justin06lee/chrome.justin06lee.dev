import { test, expect } from "bun:test";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readConfig, writeConfig, defaultConfig } from "../src/writers/config";

test("readConfig returns null when chrome.json missing", async () => {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-conf-"));
  expect(await readConfig(dir)).toBeNull();
  rmSync(dir, { recursive: true });
});

test("readConfig parses an existing file", async () => {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-conf-"));
  writeFileSync(
    join(dir, "chrome.json"),
    JSON.stringify(defaultConfig({ cssPath: "app/globals.css" })),
  );
  const cfg = await readConfig(dir);
  expect(cfg?.aliases.components).toBe("@/components/chrome");
  rmSync(dir, { recursive: true });
});

test("defaultConfig records the alias base (root default, src when passed)", () => {
  expect(defaultConfig({ cssPath: "app/globals.css" }).aliasBase).toBe("");
  expect(defaultConfig({ cssPath: "src/app/globals.css", aliasBase: "src" }).aliasBase).toBe("src");
});

test("writeConfig serializes with stable shape", async () => {
  const dir = mkdtempSync(join(tmpdir(), "chrome-ui-conf-"));
  await writeConfig(dir, defaultConfig({ cssPath: "app/globals.css" }));
  const text = await Bun.file(join(dir, "chrome.json")).text();
  expect(JSON.parse(text).tailwind.css).toBe("app/globals.css");
  rmSync(dir, { recursive: true });
});
