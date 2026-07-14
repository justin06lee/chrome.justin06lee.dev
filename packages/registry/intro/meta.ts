import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "intro",
  type: "registry:ui",
  description:
    "full-screen intro overlay: a hero holds on top while lines take turns in a fixed slot beneath it, then the whole scene fades out. skippable, with a play-once localStorage gate.",
  dependencies: ["motion"],
  registryDependencies: ["utils"],
  files: [{ source: "intro.tsx", target: "intro.tsx" }],
  props: [
    { name: "lines", type: "ReactNode[]", required: true, description: "lines shown one at a time in a fixed slot under the hero, in order." },
    { name: "hero", type: "ReactNode", description: "optional visual rendered above the lines for the whole intro (e.g. ascii art)." },
    { name: "speed", type: "number", default: "1", description: "playback speed multiplier — 2 plays the sequence twice as fast." },
    { name: "onComplete", type: "() => void", description: "called once after the overlay finishes fading out (also on skip)." },
    { name: "skippable", type: "boolean", default: "true", description: "whether to show the skip button." },
    { name: "skipLabel", type: "string", default: "'skip'", description: "label for the skip button." },
    { name: "persistKey", type: "string", description: "when set, plays only once and remembers via localStorage." },
    { name: "className", type: "string", description: "extra classes for the overlay." },
  ],
});
