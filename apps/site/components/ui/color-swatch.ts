// Bridges the @/components/ui/color-swatch alias (used by registry component source
// that depends on the swatch primitive) to the canonical component in packages/registry.
export {
  ColorSwatch,
  ColorSwatchPicker,
  CATEGORY_PALETTE,
  pickNextUnusedColor,
} from "../../../../packages/registry/color-swatch/color-swatch";
export type {
  PaletteColor,
  ColorSwatchProps,
  ColorSwatchPickerProps,
} from "../../../../packages/registry/color-swatch/color-swatch";
