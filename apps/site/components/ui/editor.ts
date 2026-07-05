// Bridges the @/components/ui/editor alias (used by registry source that composes
// the editor, e.g. desk) to the canonical component in packages/registry.
export { Editor, EditorTextarea } from "../../../../packages/registry/editor/editor";
export type {
  EditorProps,
  EditorTextareaProps,
} from "../../../../packages/registry/editor/editor";
