import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "lane-bar",
  type: "registry:ui",
  description:
    "multi-lane sibling of now-playing-bar: several activities running in parallel, each with a live elapsed timer and its own action slot, all driven by one shared tick.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [{ source: "lane-bar.tsx", target: "lane-bar.tsx" }],
  props: [
    {
      name: "lanes",
      type: "Lane[]",
      required: true,
      description: "{ id, title, subtitle?, startedAt?, accent?, actions? }[] — activities running in parallel, top to bottom. a lane without startedAt reads as paused.",
    },
    { name: "onLaneClick", type: "(id: string) => void", description: "click handler for a lane row; omit to make rows inert." },
    { name: "actions", type: "ReactNode", description: "right-side slot on the header row, applying to every lane." },
    { name: "label", type: "ReactNode", default: "'lanes'", description: "mono label on the header row; the lane count is appended." },
    { name: "emptyLabel", type: "ReactNode", default: "'nothing running'", description: "copy shown when lanes is empty." },
    { name: "visible", type: "boolean", default: "true", description: "hide the bar and tear down the shared timer." },
    { name: "position", type: "'fixed' | 'sticky'", default: "'fixed'", description: "pin to the viewport or to the scroll container." },
    { name: "className", type: "string" },
  ],
});
