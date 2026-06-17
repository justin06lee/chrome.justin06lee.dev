// Bridges the @/components/ui/synced-preview alias (used by registry source that
// depends on the preview pane) to the canonical component in packages/registry.
export { SyncedPreview } from "../../../../packages/registry/synced-preview/synced-preview";
export type {
  PreviewBlockSelection,
  SyncedPreviewHandle,
  SyncedPreviewProps,
} from "../../../../packages/registry/synced-preview/synced-preview";
