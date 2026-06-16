// Bridges the @/hooks/use-inline-edit alias (used by registry component source) to
// the canonical hook in packages/registry, mirroring lib/utils.ts.
export { useInlineEdit } from "../../../packages/registry/inline-edit/use-inline-edit";
export type {
  UseInlineEditOptions,
  UseInlineEditReturn,
} from "../../../packages/registry/inline-edit/use-inline-edit";
