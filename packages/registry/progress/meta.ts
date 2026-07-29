import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "progress",
  type: "registry:ui",
  description:
    "linear progress bar — square, three track heights, bare or outlined. determinate from value/max, or an indeterminate sweep for unknown durations. honors prefers-reduced-motion.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [{ source: "progress.tsx", target: "progress.tsx" }],
  props: [
    { name: "value", type: "number", default: "0", description: "current amount; ignored when indeterminate." },
    { name: "max", type: "number", default: "100", description: "upper bound for value." },
    {
      name: "indeterminate",
      type: "boolean",
      default: "false",
      description: "unknown-duration state: a sliver sweeps the track and no value is reported to assistive tech.",
    },
    { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", description: "track height: 2px, 4px, 8px." },
    { name: "accent", type: "string", default: "'#fff'", description: "css color for the filled bar." },
    { name: "label", type: "ReactNode", description: "caption above the track, set in the mono group-label style." },
    { name: "showValue", type: "boolean", default: "false", description: "show the percentage opposite the label." },
    { name: "bordered", type: "boolean", default: "false", description: "outline the track instead of tinting it. only sensible at size 'lg'." },
    { name: "valueText", type: "string", description: "custom value text, e.g. \"3 of 8\". overrides the percentage and sets aria-valuetext." },
    { name: "ariaLabel", type: "string" },
    { name: "className", type: "string" },
  ],
});
