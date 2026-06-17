// Bridges the @/hooks/use-line-sync alias (used by registry component source) to
// the canonical hook in packages/registry, mirroring lib/utils.ts.
export {
  useLineSync,
  STREAK_PAD,
  offsetToLine,
  lineStartOffset,
  trimStreakRange,
} from "../../../packages/registry/editor/use-line-sync";
export type {
  SelectionRect,
  UseLineSyncOptions,
  UseLineSyncReturn,
} from "../../../packages/registry/editor/use-line-sync";
