// Bridges the @/components/ui/chrome alias (used by registry source that
// composes it, e.g. gallery's pinned marker) to the canonical component.
export {
  Chrome,
  CHROME_FOIL_STYLE,
  CHROME_GLOW_STYLE,
} from "../../../../packages/registry/chrome/chrome";
export type { ChromeProps } from "../../../../packages/registry/chrome/chrome";
