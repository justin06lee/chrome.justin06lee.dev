// Bridges the @/components/ui/asset-sidebar alias (used by registry source that
// composes the sidebar, e.g. desk) to the canonical component in packages/registry.
export { AssetSidebar } from "../../../../packages/registry/asset-sidebar/asset-sidebar";
export type {
  Asset,
  AssetSidebarProps,
} from "../../../../packages/registry/asset-sidebar/asset-sidebar";
