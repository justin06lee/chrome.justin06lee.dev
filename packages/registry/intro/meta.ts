import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "intro",
  type: "registry:ui",
  description:
    "a full-screen timed multi-step intro/splash overlay: motion staggered enter/exit between steps, auto-advance, an optional skip button, and an optional localStorage gate so it plays only once. dark-only; pass steps as react nodes.",
  dependencies: ["motion"],
  registryDependencies: ["utils"],
  files: [{ source: "intro.tsx", target: "intro.tsx" }],
  props: [
    { name: "steps", type: "ReactNode[]", required: true, description: "each entry is rendered as one full-screen step, in order." },
    { name: "stepDuration", type: "number", default: "2200", description: "how long each step stays before auto-advancing, in ms." },
    { name: "onComplete", type: "() => void", description: "called once after the last step finishes (or on skip)." },
    { name: "skippable", type: "boolean", default: "true", description: "whether to show the skip button." },
    { name: "skipLabel", type: "string", default: "'skip'", description: "label for the skip button." },
    { name: "persistKey", type: "string", description: "when set, plays only once and remembers via localStorage." },
    { name: "className", type: "string", description: "extra classes for the overlay." },
  ],
});
