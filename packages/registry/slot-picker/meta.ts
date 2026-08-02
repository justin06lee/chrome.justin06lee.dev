import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "slot-picker",
  type: "registry:ui",
  description:
    "column or grid of bookable times with a two-step confirm: picking a slot splits the row so the confirm button lands under the cursor that just chose the time, making the commit deliberate and a mis-tap free. one tab stop with arrow-key movement, because a day can hold thirty slots.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [{ source: "slot-picker.tsx", target: "slot-picker.tsx" }],
  props: [
    {
      name: "slots",
      type: "Slot[]",
      required: true,
      description: "{ value, label, disabled?, note? }. value is stable identity — iso string or epoch ms.",
    },
    { name: "value", type: "string | null", required: true, description: "selected slot value." },
    { name: "onChange", type: "(value: string | null) => void", required: true, description: "fires on pick; clicking the selected slot again deselects." },
    {
      name: "onConfirm",
      type: "(value: string) => void",
      description: "commits the selection. when set, the selected row splits and reveals the confirm half in place. omit for a plain single-select grid.",
    },
    { name: "confirmLabel", type: "ReactNode", default: "'confirm'" },
    { name: "columns", type: "number | 'auto'", default: "1", description: "'auto' fills the container at ~7rem per column." },
    { name: "label", type: "ReactNode", description: "mono uppercase caption above the grid." },
    { name: "footnote", type: "ReactNode", description: "muted line under the grid — usually the zone the labels are in." },
    { name: "emptyState", type: "ReactNode", description: "shown in place of the grid when slots is empty." },
    { name: "disabled", type: "boolean", default: "false", description: "disables every slot without emptying the grid." },
    { name: "confirming", type: "boolean", default: "false", description: "pending state for the confirm half." },
    { name: "ariaLabel", type: "string", default: "'available times'" },
    { name: "className", type: "string" },
  ],
});
