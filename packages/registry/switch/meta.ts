import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "switch",
  type: "registry:ui",
  description:
    "instant on/off toggle with role=\"switch\", for settings that take effect the moment they move — as opposed to checkbox, which states an intent a submit later commits. square track, square knob.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [{ source: "switch.tsx", target: "switch.tsx" }],
  props: [
    { name: "checked", type: "boolean", required: true },
    { name: "onChange", type: "(checked: boolean) => void", required: true },
    { name: "label", type: "ReactNode", description: "text beside the track; clicking it toggles." },
    { name: "description", type: "ReactNode", description: "second line under the label." },
    { name: "labelPosition", type: "'start' | 'end'", default: "'end'", description: "'start' puts the label first and pushes the track to the far edge." },
    { name: "size", type: "'sm' | 'md'", default: "'md'" },
    { name: "disabled", type: "boolean", default: "false" },
    { name: "ariaLabel", type: "string", description: "accessible name when there is no visible label." },
    { name: "className", type: "string" },
  ],
});
