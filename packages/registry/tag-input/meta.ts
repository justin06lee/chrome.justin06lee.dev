import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "tag-input",
  type: "registry:ui",
  description:
    "chip/token input. type and press enter or comma to add a tag, backspace on an empty field removes the last, and click a suggestion chip to append it. dedupes and trims. dark-only.",
  dependencies: [],
  registryDependencies: ["utils", "badge"],
  files: [{ source: "tag-input.tsx", target: "tag-input.tsx" }],
  props: [
    { name: "value", type: "string[]", required: true, description: "current tags (controlled)." },
    { name: "onChange", type: "(tags: string[]) => void", required: true },
    { name: "suggestions", type: "string[]", default: "[]", description: "clickable existing-tag chips; present tags are hidden." },
    { name: "placeholder", type: "string", default: '"add a tag…"' },
    { name: "allowFreeText", type: "boolean", default: "true", description: "when false, only suggestions can be added." },
    { name: "className", type: "string" },
  ],
});
