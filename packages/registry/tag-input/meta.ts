import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "tag-input",
  type: "registry:ui",
  description:
    "chip input — enter or comma adds a tag, backspace removes the last, suggestions append on click. dedupes and trims.",
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
