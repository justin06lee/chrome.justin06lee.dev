// Bridges the @/hooks/use-combobox alias (used by registry component source) to
// the canonical hook in packages/registry, mirroring lib/utils.ts.
export { useCombobox } from "../../../packages/registry/combobox/use-combobox";
export type {
  ComboboxOption,
  UseComboboxOptions,
  UseComboboxReturn,
} from "../../../packages/registry/combobox/use-combobox";
