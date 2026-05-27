// Bridges the @/hooks/use-menu alias (used by registry component source) to the
// canonical hook in packages/registry, mirroring lib/utils.ts.
export { useMenu } from "../../../packages/registry/menu/use-menu";
export type { UseMenuOptions, UseMenuReturn } from "../../../packages/registry/menu/use-menu";
