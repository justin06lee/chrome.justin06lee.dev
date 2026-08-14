import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "lyrics",
  type: "registry:ui",
  description:
    "time-synced lyrics with the current line lit and the rest receding. shares playhead's clock, so lines advance between polls; auto-scroll centres the active line and stands down for eight seconds after you scroll by hand. ships parseLrc() for .lrc sheets, and renders unsynced lyrics as a plain sheet.",
  dependencies: [],
  registryDependencies: ["utils", "playhead"],
  files: [{ source: "lyrics.tsx", target: "lyrics.tsx" }],
  props: [
    { name: "lines", type: "LyricLine[]", required: true, description: "{ time?: number; text: string }[] — time in seconds; omit it on every line for an unsynced sheet. parseLrc() builds these from .lrc." },
    { name: "position", type: "number", default: "0", description: "last known playback position in seconds." },
    { name: "startedAt", type: "number | Date", description: "wall-clock ms at which position was true — the line then advances on its own." },
    { name: "playing", type: "boolean", default: "true" },
    { name: "onSeek", type: "(seconds: number) => void", description: "click a line to jump to its timestamp." },
    { name: "autoScroll", type: "boolean", default: "true", description: "scroll the active line into view." },
    { name: "height", type: "number | 'auto'", default: "280", description: "height of the scroll box in px." },
    { name: "align", type: "'left' | 'center'", default: "'left'" },
    { name: "empty", type: "ReactNode", description: "rendered when lines is empty." },
    { name: "className", type: "string" },
  ],
});
