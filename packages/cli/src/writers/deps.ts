import { spawn } from "node:child_process";
import type { PackageManager } from "../project";

export interface InstallCommand { cmd: string; args: string[] }

export function installCommand(pm: PackageManager, packages: string[]): InstallCommand | null {
  const unique = Array.from(new Set(packages));
  if (unique.length === 0) return null;
  const verb = pm === "npm" ? "install" : "add";
  return { cmd: pm, args: [verb, ...unique] };
}

export function runInstall(pm: PackageManager, packages: string[], cwd: string): Promise<void> {
  const cmd = installCommand(pm, packages);
  if (!cmd) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const child = spawn(cmd.cmd, cmd.args, { cwd, stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd.cmd} exited with code ${code}`)),
    );
  });
}
