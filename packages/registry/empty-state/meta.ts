import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "empty-state",
  type: "registry:ui",
  description:
    "the \"nothing here\" panel — icon, title, reason, and the action that would fix it. dashed border by default, matching the library's existing signal for a slot that could hold something but doesn't. server-renderable.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [{ source: "empty-state.tsx", target: "empty-state.tsx" }],
  props: [
    { name: "title", type: "ReactNode", required: true, description: "one lowercase line saying what isn't here." },
    { name: "description", type: "ReactNode", description: "why it's empty, or what to do about it." },
    { name: "icon", type: "ReactNode", description: "decorative mark above the title — a lucide icon, ascii, anything." },
    { name: "action", type: "ReactNode", description: "primary action, usually a Button." },
    { name: "secondaryAction", type: "ReactNode", description: "quieter escape hatch beside the action." },
    { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'" },
    { name: "bordered", type: "boolean", default: "true", description: "draw the dashed container; off when the parent already has a border." },
    { name: "className", type: "string" },
  ],
});
