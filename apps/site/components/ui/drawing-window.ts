// Bridges the @/components/ui/drawing-window alias (used by registry source that
// composes the drawing window, e.g. desk) to the canonical component.
export { DrawingWindow } from "../../../../packages/registry/drawing-window/drawing-window";
export type {
  DrawingWindowProps,
  DrawingPreset,
  DrawingSaveResult,
} from "../../../../packages/registry/drawing-window/drawing-window";
