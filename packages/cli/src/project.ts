import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type PackageManager = "bun" | "pnpm" | "yarn" | "npm";
export type Framework = "next" | "vite" | "react" | "unknown";

export interface ProjectInfo {
  cwd: string;
  packageManager: PackageManager;
  framework: Framework;
  tailwindMajor: number;
  hasTypeScript: boolean;
}

function detectPackageManager(cwd: string): PackageManager {
  if (existsSync(join(cwd, "bun.lock")) || existsSync(join(cwd, "bun.lockb"))) return "bun";
  if (existsSync(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

function readPkg(cwd: string): { dependencies?: Record<string, string>; devDependencies?: Record<string, string> } {
  const pkgPath = join(cwd, "package.json");
  if (!existsSync(pkgPath)) {
    throw new Error(`no package.json at ${cwd}`);
  }
  let raw: string;
  try {
    raw = readFileSync(pkgPath, "utf8");
  } catch (err) {
    throw new Error(`failed to read package.json at ${pkgPath}: ${(err as Error).message}`);
  }
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`malformed package.json at ${pkgPath}: ${(err as Error).message}`);
  }
}

/**
 * Filesystem base the `@/*` import alias maps to: "" for root layouts,
 * "src" for src/ layouts. Prefers the tsconfig `paths` mapping; falls back
 * to probing for a src/ directory.
 *
 * Live detection is a heuristic — init records its result in chrome.json
 * (`aliasBase`) and add/diff prefer that, so the layout can't drift between
 * runs. This function is the fallback for configs that predate the field.
 * Known gap: `extends` is not followed, so a paths mapping that lives only
 * in a parent tsconfig falls through to the directory probe.
 */
export function detectAliasBase(cwd: string): string {
  try {
    const raw = readFileSync(join(cwd, "tsconfig.json"), "utf8");
    // tsconfig is JSONC: strip comments and trailing commas before parsing.
    const cleaned = raw
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "")
      .replace(/,(\s*[}\]])/g, "$1");
    const ts = JSON.parse(cleaned) as {
      compilerOptions?: { paths?: Record<string, string[]> };
    };
    const target = ts.compilerOptions?.paths?.["@/*"]?.[0];
    if (typeof target === "string") {
      return target.replace(/^\.\//, "").replace(/\/?\*$/, "").replace(/\/$/, "");
    }
  } catch {
    // no tsconfig or unparseable — fall through to the directory probe
  }
  return existsSync(join(cwd, "src")) && !existsSync(join(cwd, "app")) ? "src" : "";
}

/**
 * Next.js app directory relative to the project root: "app" for root layouts,
 * "src/app" for src/ layouts. Prefers an existing directory; when neither
 * exists yet, derives the location from the `@/*` alias base — pass the
 * aliasBase recorded in chrome.json to keep the fallback deterministic.
 */
export function detectAppDir(cwd: string, aliasBase?: string): string {
  if (existsSync(join(cwd, "app"))) return "app";
  if (existsSync(join(cwd, "src", "app"))) return join("src", "app");
  const base = aliasBase ?? detectAliasBase(cwd);
  return base ? join(base, "app") : "app";
}

export function parseMajor(range: string | undefined): number | null {
  if (!range) return null;
  // strip leading range operators (^ ~ >= etc.) then require the major at the start.
  const stripped = range.trim().replace(/^[\^~><=\s]+/, "");
  const m = stripped.match(/^(\d+)(?:[.\s]|$)/);
  return m ? Number(m[1]) : null;
}

export function detectProject(cwd: string): ProjectInfo {
  const pkg = readPkg(cwd);
  const all = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };

  let framework: Framework = "unknown";
  if (all["next"]) framework = "next";
  else if (all["vite"]) framework = "vite";
  else if (all["react"]) framework = "react";

  const tailwindRange = all["tailwindcss"];
  if (!tailwindRange) {
    throw new Error(
      `tailwindcss not found in package.json dependencies. @justin06lee/chrome requires tailwind v4.`,
    );
  }
  const tailwindMajor = parseMajor(tailwindRange);
  if (tailwindMajor === null) {
    throw new Error(
      `could not parse tailwindcss version "${tailwindRange}" in package.json. chrome needs tailwind v4 — pin a v4 range.`,
    );
  }
  if (tailwindMajor < 4) {
    throw new Error(
      `tailwind v${tailwindMajor} is not supported. chrome needs tailwind v4 — found tailwindcss "${tailwindRange}".`,
    );
  }

  const hasTypeScript = !!all["typescript"];

  return {
    cwd,
    packageManager: detectPackageManager(cwd),
    framework,
    tailwindMajor,
    hasTypeScript,
  };
}
