#!/usr/bin/env bun
import { build } from "./build";
import { resolve } from "node:path";

const args = process.argv.slice(2);
function flag(name: string, fallback: string): string {
  const i = args.indexOf(name);
  if (i < 0) return fallback;
  const next = args[i + 1];
  return next ?? fallback;
}

const repoRoot = resolve(import.meta.dir, "../../..");
const registryDir = resolve(repoRoot, flag("--registry", "packages/registry"));
const outDir = resolve(repoRoot, flag("--out", "apps/site/public/r"));
const manifestPath = resolve(repoRoot, flag("--manifest", "apps/site/registry-manifest.ts"));

await build({ registryDir, outDir, manifestPath });
console.log(`✓ registry built → ${outDir}`);
console.log(`✓ manifest → ${manifestPath}`);
