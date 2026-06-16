// Bridges the @/hooks/use-login-form alias (used by registry component source) to
// the canonical hook in packages/registry, mirroring lib/utils.ts.
export { useLoginForm } from "../../../packages/registry/login-form/use-login-form";
export type {
  LoginCredentials,
  LoginSubmitResult,
  UseLoginFormOptions,
  UseLoginFormReturn,
} from "../../../packages/registry/login-form/use-login-form";
