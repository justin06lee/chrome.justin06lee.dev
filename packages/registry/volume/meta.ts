import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "volume",
  type: "registry:ui",
  description:
    "level-reflecting icon that mutes, plus a filled slider. range is the general-purpose slider; this is the specific case — muting keeps the value untouched so unmuting restores exactly where you were, and the track can collapse to just the icon until hovered.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [{ source: "volume.tsx", target: "volume.tsx" }],
  props: [
    { name: "value", type: "number", required: true, description: "level, 0–1." },
    { name: "onChange", type: "(value: number) => void", required: true },
    { name: "muted", type: "boolean", default: "false", description: "pass with onMutedChange and the icon becomes a mute toggle." },
    { name: "onMutedChange", type: "(muted: boolean) => void" },
    { name: "collapsible", type: "boolean", default: "false", description: "collapse the slider until the control is hovered or focused." },
    { name: "width", type: "number", default: "80", description: "track width in px when open." },
    { name: "size", type: "'sm' | 'md'", default: "'md'" },
    { name: "disabled", type: "boolean", default: "false" },
    { name: "className", type: "string" },
  ],
});
