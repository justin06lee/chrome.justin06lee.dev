import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "clock",
  type: "registry:ui",
  description:
    "live clock — thin-stroke analog face, tabular-nums digital readout, or both. any iana time zone via intl, optional sweep second hand. ssr-safe: renders a stable midnight form until mounted.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [{ source: "clock.tsx", target: "clock.tsx" }],
  props: [
    {
      name: "variant",
      type: "'analog' | 'digital' | 'both'",
      default: "'analog'",
      description: "'both' stacks the face over the readout.",
    },
    {
      name: "timeZone",
      type: "string",
      description: "iana zone, e.g. \"Asia/Seoul\". omit for the viewer's local zone.",
    },
    { name: "showSeconds", type: "boolean", default: "true", description: "second hand and :ss in the readout." },
    { name: "hour12", type: "boolean", default: "false", description: "12-hour readout with an am/pm suffix." },
    { name: "size", type: "number", default: "160", description: "analog face edge in px; the digital readout is sized by className." },
    { name: "ticks", type: "boolean", default: "true", description: "hour tick marks around the face." },
    {
      name: "sweep",
      type: "boolean",
      default: "false",
      description: "sweep the second hand continuously instead of stepping. costs a raf loop; ignored under prefers-reduced-motion.",
    },
    { name: "showZone", type: "boolean", default: "false", description: "zone abbreviation under the readout, e.g. \"KST\"." },
    { name: "accent", type: "string", description: "css color for the second hand. defaults to the muted white step." },
    { name: "className", type: "string" },
  ],
});
