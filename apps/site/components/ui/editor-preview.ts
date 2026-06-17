// Bridges the @/components/ui/editor-preview alias (used by registry source that
// depends on the preview pane) to the canonical component, which now ships as part
// of the editor registry item.
export { EditorPreview } from "../../../../packages/registry/editor/editor-preview";
export type {
  PreviewBlockSelection,
  EditorPreviewHandle,
  EditorPreviewProps,
} from "../../../../packages/registry/editor/editor-preview";
