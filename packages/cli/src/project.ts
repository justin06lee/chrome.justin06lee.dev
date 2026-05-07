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
  return JSON.parse(readFileSync(pkgPath, "utf8"));
}

function parseMajor(range: string | undefined): number {
  if (!range) return 0;
  const m = range.match(/(\d+)/);
  return m ? Number(m[1]) : 0;
}

export function detectProject(cwd: string): ProjectInfo {
  const pkg = readPkg(cwd);
  const all = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };

  let framework: Framework = "unknown";
  if (all["next"]) framework = "next";
  else if (all["vite"]) framework = "vite";
  else if (all["react"]) framework = "react";

  const tailwindMajor = parseMajor(all["tailwindcss"]);
  if (tailwindMajor !== 0 && tailwindMajor < 4) {
    throw new Error(
      `@justin06lee/chrome requires tailwind v4. found tailwindcss "${all["tailwindcss"]}". upgrade or wait for v3 support in v1.1.`,
    );
  }

  const hasTypeScript = !!all["typescript"];

  return {
    cwd,
    packageManager: detectPackageManager(cwd),
    framework,
    tailwindMajor: tailwindMajor || 4,
    hasTypeScript,
  };
}
