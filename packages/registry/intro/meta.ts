import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "intro",
  type: "registry:ui",
  description:
    "full-screen intro overlay: an optional hero above lines that fade in one by one, hold, then the whole scene fades out. skippable, with a play-once localStorage gate.",
  dependencies: ["motion"],
  registryDependencies: ["utils"],
  files: [{ source: "intro.tsx", target: "intro.tsx" }],
  props: [
    { name: "lines", type: "ReactNode[]", required: true, description: "lines that fade in one by one under the hero and stay visible." },
    { name: "hero", type: "ReactNode", description: "optional visual rendered above the lines (e.g. ascii art)." },
    { name: "holdDuration", type: "number", default: "1400", description: "how long the finished scene holds before fading out, in ms." },
    { name: "onComplete", type: "() => void", description: "called once after the overlay finishes fading out (also on skip)." },
    { name: "skippable", type: "boolean", default: "true", description: "whether to show the skip button." },
    { name: "skipLabel", type: "string", default: "'skip'", description: "label for the skip button." },
    { name: "persistKey", type: "string", description: "when set, plays only once and remembers via localStorage." },
    { name: "className", type: "string", description: "extra classes for the overlay." },
  ],
});
