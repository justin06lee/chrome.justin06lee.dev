// Bridges the @/hooks/use-toast alias (used by registry component source) to the
// canonical hook in packages/registry, mirroring lib/utils.ts.
export { ToastContext, useToast, useToastStore } from "../../../packages/registry/toast/use-toast";
export type {
  ToastContextValue,
  ToastOptions,
  ToastPosition,
  ToastRecord,
  ToastVariant,
  UseToastStoreOptions,
  UseToastStoreReturn,
} from "../../../packages/registry/toast/use-toast";
