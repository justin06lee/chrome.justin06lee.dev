import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "callout",
  type: "registry:ui",
  description:
    "inline notice attached to the thing it's about — the counterpart to toast, which interrupts from a corner and leaves. aria role follows severity: danger asserts, warn and success announce politely, a plain note stays silent.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [{ source: "callout.tsx", target: "callout.tsx" }],
  props: [
    {
      name: "variant",
      type: "'note' | 'success' | 'warn' | 'danger'",
      default: "'note'",
      description: "tone. only warn and danger spend colour; the rest stay on the opacity ladder.",
    },
    { name: "title", type: "ReactNode", description: "bold first line. omit for a single-line callout." },
    { name: "children", type: "ReactNode", description: "body copy." },
    { name: "icon", type: "LucideIcon | null", description: "replaces the variant's default icon; null drops it entirely." },
    { name: "onDismiss", type: "() => void", description: "adds a close button. presentational — the caller owns visibility." },
    { name: "action", type: "ReactNode", description: "trailing slot under the copy, e.g. a retry button." },
    { name: "className", type: "string" },
  ],
});
