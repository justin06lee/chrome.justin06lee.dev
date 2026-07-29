import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "toast",
  type: "registry:ui",
  description:
    "stacked, auto-dismissing notifications. a ToastProvider plus a useToast() hook, with pause-on-hover, a polite live region, and six anchor corners.",
  dependencies: ["motion", "lucide-react"],
  registryDependencies: ["utils"],
  files: [
    // Styled component first so the docs source view shows it (page reads files[0]).
    { source: "toast.tsx", target: "toast.tsx" },
    { source: "use-toast.ts", target: "use-toast.ts", type: "registry:hook" },
  ],
  props: [
    { name: "children", type: "ReactNode", description: "the tree that can call useToast()." },
    {
      name: "position",
      type: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
      default: "'bottom-right'",
      description: "corner the stack grows from. bottom corners stack upward so the newest toast sits nearest the corner.",
    },
    { name: "duration", type: "number", default: "4000", description: "default auto-dismiss delay in ms for toasts that don't set their own." },
    { name: "max", type: "number", default: "4", description: "how many toasts stay on screen; the oldest fall off past this." },
    {
      name: "anchor",
      type: "'viewport' | 'container'",
      default: "'viewport'",
      description: "'viewport' pins the stack to the window; 'container' pins it to the nearest positioned ancestor, for toasts scoped to a panel.",
    },
    { name: "label", type: "string", default: "'notifications'", description: "accessible name for the aria-live region." },
    { name: "className", type: "string", description: "extra classes for the viewport." },
    { name: "toast(options).title", type: "ReactNode", required: true, description: "toast() option — the headline line." },
    { name: "toast(options).description", type: "ReactNode", description: "toast() option — secondary copy under the title." },
    {
      name: "toast(options).variant",
      type: "'default' | 'success' | 'danger'",
      default: "'default'",
      description: "toast() option — tone. success is marked by a check icon; danger is the only variant that spends color (red).",
    },
    {
      name: "toast(options).duration",
      type: "number",
      description: "toast() option — ms before auto-dismiss, overriding the provider default. 0 or Infinity pins it until dismissed by hand.",
    },
    { name: "toast(options).action", type: "ReactNode", description: "toast() option — trailing slot under the copy, e.g. an undo button. pair with duration: 0 so it stays reachable." },
    { name: "useToast().toast", type: "(options: ToastOptions) => string", description: "queues a toast and returns its id." },
    { name: "useToast().dismiss", type: "(id?: string) => void", description: "dismisses one toast by id, or every toast when called with no argument." },
  ],
});
