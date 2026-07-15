import type { ChromeUiConfig } from "./config";

type Aliases = ChromeUiConfig["aliases"];

/** Canonical prefixes used by registry sources. */
const REGISTRY_COMPONENTS = "@/components/ui/";
const REGISTRY_UTILS = "@/lib/utils";
const REGISTRY_HOOKS = "@/hooks/";

/**
 * Registry sources import siblings as `@/components/ui/<name>`, the cn helper
 * as `@/lib/utils`, and hooks as `@/hooks/<name>`. Installed projects map
 * those to whatever `aliases` says in chrome.json (default components alias
 * is `@/components/chrome`), so file content must be rewritten at install
 * time or every cross-component import breaks.
 *
 * The rewrite matches the entire quoted specifier, so lookalikes are left
 * alone: `@/lib/utils-extra` doesn't match `@/lib/utils`, and
 * `@/components/uikit/x` doesn't match `@/components/ui/`.
 */
export function rewriteImports(content: string, aliases: Partial<Aliases>): string {
  const components = aliases.components ?? "@/components/chrome";
  const utils = aliases.utils ?? "@/lib/utils";
  const hooks = aliases.hooks ?? "@/hooks";
  return content.replace(
    /(["'])(@\/(?:components\/ui\/[^"'\n]+|lib\/utils|hooks\/[^"'\n]+))\1/g,
    (_match, quote: string, spec: string) => {
      let next: string;
      if (spec.startsWith(REGISTRY_COMPONENTS)) {
        next = `${components}/${spec.slice(REGISTRY_COMPONENTS.length)}`;
      } else if (spec === REGISTRY_UTILS) {
        next = utils;
      } else {
        next = `${hooks}/${spec.slice(REGISTRY_HOOKS.length)}`;
      }
      return `${quote}${next}${quote}`;
    },
  );
}
