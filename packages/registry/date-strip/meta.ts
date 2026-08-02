import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "date-strip",
  type: "registry:ui",
  description:
    "horizontal run of days — the linear counterpart to calendar's month grid, for when the next opening matters more than which week it's in. availability is a dot, not a number; a known count of zero disables the day while an absent count leaves it alone, so a loading strip never claims the week is empty.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [{ source: "date-strip.tsx", target: "date-strip.tsx" }],
  props: [
    {
      name: "days",
      type: "StripDay[]",
      required: true,
      description:
        "{ value, label, weekday?, count?, disabled?, today? }. count 0 disables the day; undefined means unknown.",
    },
    { name: "value", type: "string | null", required: true },
    { name: "onChange", type: "(value: string) => void", required: true },
    { name: "label", type: "ReactNode", description: "mono uppercase caption above the strip, usually the month." },
    { name: "arrows", type: "boolean", default: "true", description: "scroll arrows; they hide themselves when nothing overflows." },
    { name: "showCount", type: "boolean", default: "true", description: "render availability as a dot under the number." },
    { name: "ariaLabel", type: "string", default: "'pick a day'" },
    { name: "className", type: "string" },
  ],
});
