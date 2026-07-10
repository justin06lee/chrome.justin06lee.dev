import { spawn } from "node:child_process";
import type { PackageManager } from "../project";

export interface InstallCommand { cmd: string; args: string[] }

// optionally scoped npm name, with an optional @version/@range suffix.
const VALID_PACKAGE =
  /^(@[a-z0-9~][a-z0-9._~-]*\/)?[a-z0-9~][a-z0-9._~-]*(@[a-zA-Z0-9._^~*<>=|+-]+)?$/;

export function isValidPackageName(dep: string): boolean {
  return !dep.startsWith("-") && VALID_PACKAGE.test(dep);
}

export function installCommand(pm: PackageManager, packages: string[]): InstallCommand | null {
  const unique = Array.from(new Set(packages));
  if (unique.length === 0) return null;
  for (const dep of unique) {
    if (!isValidPackageName(dep)) {
      throw new Error(
        `refusing to install ${JSON.stringify(dep)}: not a valid npm package name — remove it from the registry item or install it manually`,
      );
    }
  }
  const verb = pm === "npm" ? "install" : "add";
  return { cmd: pm, args: [verb, ...unique] };
}

export function runInstall(pm: PackageManager, packages: string[], cwd: string): Promise<void> {
  const cmd = installCommand(pm, packages);
  if (!cmd) return Promise.resolve();
  return new Promise((resolve, reject) => {
    // shell on windows so .cmd shims (npm.cmd, pnpm.cmd, …) resolve; safe
    // because every package name is validated above.
    const child = spawn(cmd.cmd, cmd.args, {
      cwd,
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd.cmd} exited with code ${code}`)),
    );
  });
}
