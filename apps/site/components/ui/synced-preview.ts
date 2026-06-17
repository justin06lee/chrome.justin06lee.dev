// Bridges the @/components/ui/synced-preview alias (used by registry source that
// depends on the preview pane) to the canonical component, which now ships as part
// of the synced-editor registry item.
export { SyncedPreview } from "../../../../packages/registry/synced-editor/synced-preview";
export type {
  PreviewBlockSelection,
  SyncedPreviewHandle,
  SyncedPreviewProps,
} from "../../../../packages/registry/synced-editor/synced-preview";
