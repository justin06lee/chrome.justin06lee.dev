import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "login-form",
  type: "registry:ui",
  description:
    "styled credential form with loading / error / rate-limited states and enter-to-submit. transport-agnostic via an injected onSubmit; behavior split into a headless useLoginForm hook. rate limiting and lockout belong on the consumer's backend.",
  registryDependencies: ["utils", "input"],
  files: [
    // Styled component first so the docs source view shows it (page reads files[0]).
    { source: "login-form.tsx", target: "login-form.tsx" },
    { source: "use-login-form.ts", target: "use-login-form.ts", type: "registry:hook" },
  ],
  props: [
    {
      name: "onSubmit",
      type: "(credentials) => Promise<{ error?, rateLimited? } | void>",
      description: "caller submit; resolve to succeed, return an error / rateLimited result or throw to fail.",
    },
    { name: "fields", type: "LoginField[]", description: "fields to render. defaults to a single password field." },
    { name: "title", type: "string", default: "'log in'", description: "heading above the fields." },
    { name: "submitLabel", type: "string", default: "'log in'", description: "button label when idle." },
    { name: "loadingLabel", type: "string", default: "'signing in...'", description: "button label while submitting." },
  ],
});
