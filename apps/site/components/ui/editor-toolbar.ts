// Bridges the @/components/ui/editor-toolbar alias (used by registry source that
// composes the toolbar, e.g. desk) to the canonical component in packages/registry.
export {
  EditorToolbar,
  MARKDOWN_FORMAT_ACTIONS,
} from "../../../../packages/registry/editor-toolbar/editor-toolbar";
export type {
  EditorFormatAction,
  EditorToolbarProps,
} from "../../../../packages/registry/editor-toolbar/editor-toolbar";
