// Bridges the @/components/ui/editor alias (used by registry source that composes
// the editor, e.g. desk) to the canonical component in packages/registry.
export {
  Editor,
  EditorTextarea,
  editorSizeClass,
  EDITOR_SIZE_CLASS,
} from "../../../../packages/registry/editor/editor";
export type {
  EditorProps,
  EditorTextareaProps,
  EditorSize,
} from "../../../../packages/registry/editor/editor";
