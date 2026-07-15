import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "kbd",
  type: "registry:ui",
  description:
    "a macos-style keycap: mono glyph on a faint raised cap with a heavier bottom edge. compose combos by placing several side by side.",
  registryDependencies: ["utils"],
  files: [{ source: "kbd.tsx", target: "kbd.tsx" }],
  props: [
    { name: "size", type: "'sm' | 'md'", default: "'sm'", description: "keycap size." },
    { name: "className", type: "string" },
    { name: "children", type: "ReactNode", required: true, description: "the key glyph or label." },
  ],
});
