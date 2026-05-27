import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const END = "/* @chrome:end */";

/**
 * Render a component's `cssVars` (selector → { prop: value }) into CSS rules.
 * Selectors are honored as-authored (e.g. ":root", ".dark") so a component can
 * scope its tokens however it needs. Returns "" when there's nothing to emit.
 */
export function serializeCssVars(
  vars: Record<string, Record<string, string>> | undefined,
): string {
  if (!vars) return "";
  const blocks: string[] = [];
  for (const [selector, decls] of Object.entries(vars)) {
    const body = Object.entries(decls)
      .map(([prop, value]) => `  ${prop}: ${value};`)
      .join("\n");
    if (body.length === 0) continue;
    blocks.push(`${selector} {\n${body}\n}`);
  }
  return blocks.join("\n\n");
}

/** Build the start marker for a given block id. "theme" keeps the legacy marker. */
function startMarker(blockId: string): string {
  const safe = blockId.replace(/[^a-z0-9-]/g, "");
  if (safe.length === 0) throw new Error(`invalid CSS blockId "${blockId}": must contain [a-z0-9-]`);
  return safe === "theme"
    ? "/* @chrome:theme */"
    : `/* @chrome:css:${safe} */`;
}

export async function patchGlobalsCss(
  path: string,
  block: string,
  blockId = "theme",
): Promise<void> {
  const start = startMarker(blockId);
  const trimmed = block
    .replace(new RegExp(`^${escape(start)}\\s*`), "")
    .replace(new RegExp(`\\s*${escape(END)}\\s*$`), "")
    .trim();
  const fenced = `${start}\n${trimmed}\n${END}`;
  await mkdir(dirname(path), { recursive: true });
  let current = "";
  try {
    current = await readFile(path, "utf8");
  } catch {
    current = "";
  }
  const re = new RegExp(`${escape(start)}[\\s\\S]*?${escape(END)}`, "g");
  const next = re.test(current)
    ? current.replace(re, fenced)
    : current.trimEnd() + "\n\n" + fenced + "\n";
  await writeFile(path, next);
}

function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
