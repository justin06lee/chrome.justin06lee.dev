import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "transport",
  type: "registry:ui",
  description:
    "playback controls — skip, play/pause, shuffle and repeat. every control appears only when handed a callback, so the same component covers a full player and a listen-only page with nothing but a play button. repeat cycles off → all → one and announces the mode it moves to.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [{ source: "transport.tsx", target: "transport.tsx" }],
  props: [
    { name: "playing", type: "boolean", required: true },
    { name: "onPlayPause", type: "() => void", required: true },
    { name: "onPrevious", type: "() => void", description: "omit and the button doesn't render." },
    { name: "onNext", type: "() => void", description: "omit and the button doesn't render." },
    { name: "shuffle", type: "boolean", description: "pass with onShuffleChange to show the toggle." },
    { name: "onShuffleChange", type: "(next: boolean) => void" },
    { name: "repeat", type: "'off' | 'all' | 'one'", default: "'off'", description: "pass with onRepeatChange to show the toggle." },
    { name: "onRepeatChange", type: "(next: RepeatMode) => void" },
    { name: "loading", type: "boolean", default: "false", description: "spinner in place of the play glyph — buffering, or waiting on a remote." },
    { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'" },
    { name: "disabled", type: "boolean", default: "false" },
    { name: "className", type: "string" },
  ],
});
