import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "timezone-select",
  type: "registry:ui",
  description:
    "searchable iana timezone picker that shows what time it actually is in each zone, sorted by utc offset. combobox covers searchable select in general; this is the case where the label alone can't answer the question — you're choosing \"the one where it's 4pm now\". clock starts null and fills in after mount so ssr and hydration agree.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [{ source: "timezone-select.tsx", target: "timezone-select.tsx" }],
  props: [
    { name: "value", type: "string", required: true, description: "iana zone name, e.g. \"America/Los_Angeles\"." },
    { name: "onChange", type: "(zone: string) => void", required: true },
    {
      name: "zones",
      type: "string[]",
      description:
        "zones to offer. defaults to Intl.supportedValuesOf(\"timeZone\"), falling back to ~45 curated zones where that's unavailable.",
    },
    { name: "label", type: "ReactNode", description: "mono uppercase caption above the trigger." },
    { name: "placeholder", type: "string", default: "'search zones…'" },
    { name: "liveSeconds", type: "boolean", default: "false", description: "tick the clock every second instead of every 30." },
    { name: "disabled", type: "boolean", default: "false" },
    { name: "ariaLabel", type: "string", default: "'time zone'" },
    { name: "className", type: "string" },
  ],
});
