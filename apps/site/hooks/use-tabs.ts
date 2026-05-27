// Bridges the @/hooks/use-tabs alias (used by registry component source) to the
// canonical hook in packages/registry, mirroring lib/utils.ts.
export { useTabs } from "../../../packages/registry/tabs/use-tabs";
export type { TabItem, UseTabsOptions, UseTabsReturn, TabProps } from "../../../packages/registry/tabs/use-tabs";
