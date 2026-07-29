import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "break-overlay",
  type: "registry:ui",
  description:
    "full-screen rest overlay with a large live countdown and resume / extend / skip actions. traps focus, locks scroll, and only escapes when you let it.",
  dependencies: ["motion", "lucide-react"],
  registryDependencies: ["utils"],
  files: [{ source: "break-overlay.tsx", target: "break-overlay.tsx" }],
  props: [
    { name: "open", type: "boolean", required: true, description: "whether the rest screen is showing." },
    {
      name: "endsAt",
      type: "number | Date",
      description: "absolute end of the break; wins over seconds. use it when the break is persisted and must survive a remount at the right offset.",
    },
    { name: "seconds", type: "number", description: "break length in seconds, counted from the moment it opens." },
    { name: "title", type: "string", default: "'break time'", description: "heading above the countdown." },
    { name: "message", type: "ReactNode", description: "optional line under the countdown — what to actually do with the break." },
    { name: "label", type: "string", default: "'break'", description: "small mono label above the heading." },
    { name: "onResume", type: "() => void", description: "user ended the break early. also fires on escape when dismissible. omit to hide the button." },
    { name: "onSkip", type: "() => void", description: "user skipped the break outright. omit to hide the button." },
    { name: "onExtend", type: "(seconds: number) => void", description: "user extended the break; receives the added seconds. the overlay moves its own deadline too. omit to hide the button." },
    { name: "extendBy", type: "number", default: "300", description: "how much extend adds, in seconds." },
    { name: "onComplete", type: "() => void", description: "fires once, when the countdown reaches zero on its own." },
    { name: "dismissible", type: "boolean", default: "false", description: "allow escape to close the overlay, resolving as resume. off by default — a forced break should be mildly inconvenient to dismiss." },
    {
      name: "anchor",
      type: "'viewport' | 'container'",
      default: "'viewport'",
      description: "'viewport' covers the window and locks body scroll; 'container' covers the nearest positioned ancestor instead.",
    },
    { name: "className", type: "string", description: "extra classes for the overlay." },
  ],
});
