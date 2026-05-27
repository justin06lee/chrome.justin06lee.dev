import { test, expect } from "bun:test";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { ComponentMeta } from "../src/schema";

/**
 * CSS-parity regression guard.
 *
 * Every registry component must be self-contained: any CSS it references
 * (@keyframes, ambient helper classes, theme-token utilities) must travel
 * with the component on install — either inline in a <style> tag inside its
 * own .tsx, or in a `cssFile` declared by its meta.ts. The docs site's
 * apps/site/app/globals.css does NOT travel and must not be relied on.
 */

const REGISTRY_DIR = join(import.meta.dir, "../../registry");

/**
 * Ambient (non-Tailwind) helper classes that must be shipped via a cssFile.
 * Note: chrome-accordion is intentionally defined inline in a <style> tag inside
 * accordion.tsx itself and so does not appear here.
 */
const AMBIENT_HELPER_CLASSES: string[] = [
  // Add class names here when a component ships ambient helpers via a cssFile.
];
/** Class-name prefixes that count as ambient helper classes. */
const AMBIENT_HELPER_PREFIXES: string[] = [];

/** Tailwind utilities that resolve to docs-site-only theme tokens. */
const THEME_TOKEN_CLASSES = [
  "bg-surface",
  "bg-surface-alt",
  "bg-background",
  "text-foreground",
  "text-muted",
  "text-accent",
  "border-border",
];

interface Component {
  name: string;
  dir: string;
  tsxFiles: string[];
  /** Concatenated content of every .tsx file in the component dir. */
  tsxContent: string;
  /** Content of the declared cssFile, or "" if none. */
  cssContent: string;
  hasCssFile: boolean;
}

/** Discover every registry component dir that ships at least one .tsx file. */
function discoverComponents(): Component[] {
  const out: Component[] = [];
  for (const entry of readdirSync(REGISTRY_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (entry.name === "node_modules") continue;
    collectFromDir(join(REGISTRY_DIR, entry.name), entry.name, out);
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

/** A component dir is one that directly contains a meta.ts; recurse otherwise (covers _shared/*). */
function collectFromDir(dir: string, name: string, out: Component[]): void {
  const metaPath = join(dir, "meta.ts");
  if (existsSync(metaPath)) {
    const tsxFiles = readdirSync(dir)
      .filter((f) => f.endsWith(".tsx") && f !== "demo.tsx")
      .map((f) => join(dir, f));
    // Exclude components that ship no .tsx (e.g. _shared/utils, _shared/theme).
    if (tsxFiles.length === 0) return;

    const meta = loadMeta(metaPath);
    let cssContent = "";
    let hasCssFile = false;
    if (meta.cssFile) {
      hasCssFile = true;
      const cssPath = join(dir, meta.cssFile);
      if (existsSync(cssPath)) cssContent = readFileSync(cssPath, "utf8");
    }
    out.push({
      name: meta.name ?? name,
      dir,
      tsxFiles,
      tsxContent: tsxFiles.map((f) => readFileSync(f, "utf8")).join("\n"),
      cssContent,
      hasCssFile,
    });
    return;
  }
  // No meta.ts here — recurse into subdirectories (e.g. _shared/<name>).
  for (const sub of readdirSync(dir, { withFileTypes: true })) {
    if (!sub.isDirectory() || sub.name === "node_modules") continue;
    collectFromDir(join(dir, sub.name), sub.name, out);
  }
}

/** Parse meta.ts without executing it (avoids importing component runtime deps). */
function loadMeta(metaPath: string): Partial<ComponentMeta> {
  const src = readFileSync(metaPath, "utf8");
  const name = src.match(/name:\s*["']([^"']+)["']/)?.[1];
  const cssFile = src.match(/cssFile:\s*["']([^"']+)["']/)?.[1];
  return { name, cssFile };
}

/** Collect every `@keyframes NAME` defined in a CSS/TSX source blob. */
function definedKeyframes(source: string): Set<string> {
  const out = new Set<string>();
  const re = /@keyframes\s+([A-Za-z_][\w-]*)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) out.add(m[1]!);
  return out;
}

/**
 * Collect every keyframe NAME *used* by a component:
 *  - `animation:` shorthand (CSS strings + inline style objects)
 *  - `animation-name:` / `animationName` values
 * The first non-numeric, non-keyword token after the property is the name.
 */
function usedKeyframes(source: string): Set<string> {
  const out = new Set<string>();

  // animation-name / animationName: explicit name reference.
  const nameRe = /(?:animation-name|animationName)\s*:\s*["'`]?\s*([A-Za-z_][\w-]*)/g;
  let m: RegExpExecArray | null;
  while ((m = nameRe.exec(source)) !== null) {
    if (!isAnimationKeyword(m[1]!)) out.add(m[1]!);
  }

  // animation shorthand: scan tokens until end of the value, pick the name token.
  // The value may be a CSS declaration (`animation: x 1s;`) or an inline-style
  // object entry where the value is a quoted/templated string
  // (`animation: "x 1s ..."` / `animation: \`x ${d}s ...\``).
  const shorthandRe =
    /(?:^|[^-\w])animation\s*:\s*(?:(["'`])((?:\\.|(?!\1)[\s\S])*?)\1|([^;"'`}]+))/g;
  while ((m = shorthandRe.exec(source)) !== null) {
    const value = m[2] ?? m[3] ?? "";
    // Strip template-literal interpolations like ${duration}s.
    const cleaned = value.replace(/\$\{[^}]*\}/g, " ");
    for (const token of cleaned.split(/[\s,]+/)) {
      const name = token.trim();
      if (!name) continue;
      if (isAnimationKeyword(name)) continue;
      if (/^-?[\d.]/.test(name)) continue; // duration / delay / iteration count
      if (/^(cubic-bezier|steps)\(/.test(name)) continue; // timing function
      if (!/^[A-Za-z_][\w-]*$/.test(name)) continue; // not a bare ident
      out.add(name);
      break; // first ident token of the shorthand is the keyframe name
    }
  }
  return out;
}

const ANIMATION_KEYWORDS = new Set([
  "none",
  "infinite",
  "linear",
  "ease",
  "ease-in",
  "ease-out",
  "ease-in-out",
  "normal",
  "reverse",
  "alternate",
  "alternate-reverse",
  "forwards",
  "backwards",
  "both",
  "running",
  "paused",
  "inherit",
  "initial",
  "unset",
  "revert",
  "step-start",
  "step-end",
]);

function isAnimationKeyword(token: string): boolean {
  return ANIMATION_KEYWORDS.has(token.toLowerCase());
}

/** Extract every individual class token used in className/class attributes. */
function usedClassTokens(source: string): Set<string> {
  const out = new Set<string>();
  // Match className="..." className={`...`} className={'...'} class="..." etc.
  // Also catches cn("a b", ...) string literal args via the generic string scan below.
  const attrRe = /\b(?:className|class)\s*=\s*(?:\{)?\s*([`"'])([\s\S]*?)\1/g;
  let m: RegExpExecArray | null;
  while ((m = attrRe.exec(source)) !== null) {
    for (const tok of m[2]!.split(/\s+/)) {
      const t = tok.trim();
      if (t) out.add(t);
    }
  }
  // String-literal arguments anywhere (covers cn("social-tooltip-wrap", ...)).
  const strRe = /(["'`])([A-Za-z][\w :/-]*?)\1/g;
  while ((m = strRe.exec(source)) !== null) {
    for (const tok of m[2]!.split(/\s+/)) {
      const t = tok.trim();
      if (t) out.add(t);
    }
  }
  return out;
}

/** Strip Tailwind variant prefixes like `hover:` / `md:` / `dark:`. */
function baseClass(token: string): string {
  const idx = token.lastIndexOf(":");
  return idx === -1 ? token : token.slice(idx + 1);
}

function isAmbientHelperClass(base: string): boolean {
  if (AMBIENT_HELPER_CLASSES.includes(base)) return true;
  return AMBIENT_HELPER_PREFIXES.some((p) => base.startsWith(p));
}

/** Does the css source define a `.classname` selector? */
function cssDefinesClass(css: string, className: string): boolean {
  const escaped = className.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\.${escaped}(?![\\w-])`).test(css);
}

const components = discoverComponents();

test("registry has discoverable components", () => {
  expect(components.length).toBeGreaterThan(0);
});

for (const c of components) {
  // 1. KEYFRAMES — every used keyframe must be defined in shipped CSS.
  test(`[${c.name}] keyframes used are defined in shipped CSS`, () => {
    const shipped = definedKeyframes(c.tsxContent + "\n" + c.cssContent);
    const used = usedKeyframes(c.tsxContent + "\n" + c.cssContent);
    const missing = [...used].filter((k) => !shipped.has(k));
    expect(
      missing,
      `component "${c.name}" uses keyframe(s) [${missing.join(", ")}] ` +
        `that are not defined in its own .tsx or cssFile — they will not travel on install`,
    ).toEqual([]);
  });

  // 2. AMBIENT HELPER CLASSES — must ship a cssFile that defines them.
  test(`[${c.name}] ambient helper classes ship a cssFile defining them`, () => {
    const classes = [...usedClassTokens(c.tsxContent)].map(baseClass);
    const ambient = [...new Set(classes.filter(isAmbientHelperClass))];
    const offenders: string[] = [];
    for (const cls of ambient) {
      if (!c.hasCssFile) {
        offenders.push(`${cls} (component declares no cssFile)`);
      } else if (!cssDefinesClass(c.cssContent, cls)) {
        offenders.push(`${cls} (cssFile does not define a .${cls} selector)`);
      }
    }
    expect(
      offenders,
      `component "${c.name}" uses ambient helper class(es) not shipped with it: ` +
        offenders.join("; "),
    ).toEqual([]);
  });

  // 3. THEME-TOKEN CLASSES — components must be fully self-contained, any use fails.
  test(`[${c.name}] uses no docs-site-only theme-token utility classes`, () => {
    const classes = [...usedClassTokens(c.tsxContent)].map(baseClass);
    const offenders = [...new Set(classes.filter((cls) => THEME_TOKEN_CLASSES.includes(cls)))];
    expect(
      offenders,
      `component "${c.name}" uses theme-token utility class(es) [${offenders.join(", ")}] ` +
        `that resolve to docs-site-only tokens — components must be fully self-contained`,
    ).toEqual([]);
  });
}
