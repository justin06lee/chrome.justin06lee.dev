// Bridges the @/hooks/use-toc alias (used by registry component source) to the
// canonical hook in packages/registry, mirroring lib/utils.ts.
export { useToc } from "../../../packages/registry/toc/use-toc";
export type { TocHeading } from "../../../packages/registry/toc/use-toc";
