import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "stat-tile",
  type: "registry:ui",
  description:
    "big-number kpi tile — mono uppercase label, one headline figure with an optional unit, a delta chip that turns red only when the change is the bad one, plus footnote, icon and a slot for an inline sparkline. server-renderable; opts into count-up when animated.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils", "count-up"],
  files: [{ source: "stat-tile.tsx", target: "stat-tile.tsx" }],
  props: [
    { name: "label", type: "ReactNode", required: true, description: "mono uppercase kicker above the number." },
    { name: "value", type: "number | string", required: true, description: "headline figure; strings render as-is (already formatted, \"—\", etc.)." },
    { name: "unit", type: "string", description: "small trailing qualifier next to the number, e.g. \"h\"." },
    { name: "format", type: "(n: number) => string", description: "formatter for numeric value and delta; overrides decimals. pairing it with animate requires the tile to render inside a client component (functions can't cross the server boundary)." },
    { name: "decimals", type: "number", default: "0", description: "fixed decimal places for numeric value/delta." },
    { name: "animate", type: "boolean", default: "false", description: "tween the number up from 0 when it scrolls into view, via count-up." },
    { name: "duration", type: "number", default: "1", description: "tween length in seconds when animate is set." },
    { name: "delta", type: "number", description: "signed change since the comparison period; the sign picks the direction icon." },
    { name: "deltaLabel", type: "ReactNode", description: "trailing context for the delta chip, e.g. \"vs last month\"." },
    { name: "invertDelta", type: "boolean", default: "false", description: "flip which sign is bad, for figures where less is better." },
    { name: "footnote", type: "ReactNode", description: "muted line under the tile — provenance, caveats, sample size." },
    { name: "icon", type: "ReactNode", description: "decorative slot pinned to the top-right, typically a 14px lucide icon." },
    { name: "children", type: "ReactNode", description: "rendered between the number and the footnote — a sparkline fits here." },
    { name: "className", type: "string" },
  ],
});
