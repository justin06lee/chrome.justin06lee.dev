import { readFile, writeFile } from "node:fs/promises";

const START = "/* @chromeui:theme */";
const END = "/* @chromeui:end */";

export async function patchGlobalsCss(path: string, block: string): Promise<void> {
  const trimmed = block
    .replace(/^\/\*\s*@chromeui:theme\s*\*\/\s*/, "")
    .replace(/\s*\/\*\s*@chromeui:end\s*\*\/\s*$/, "")
    .trim();
  const fenced = `${START}\n${trimmed}\n${END}`;
  let current = "";
  try {
    current = await readFile(path, "utf8");
  } catch {
    current = "";
  }
  const re = new RegExp(
    `${escape(START)}[\\s\\S]*?${escape(END)}`,
    "g",
  );
  const next = re.test(current)
    ? current.replace(re, fenced)
    : (current.trimEnd() + "\n\n" + fenced + "\n");
  await writeFile(path, next);
}

function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
