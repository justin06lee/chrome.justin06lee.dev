import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "ascii",
  type: "registry:ui",
  description:
    "seamless ascii-art renderer — a mono pre locked to a fixed character grid (no ligatures, tight leading) so art never breaks. wrap it in chrome to foil every glyph.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [{ source: "ascii.tsx", target: "ascii.tsx" }],
  props: [
    { name: "children", type: "string", required: true, description: "the ascii art, exactly as authored." },
    { name: "label", type: "string", description: "accessible name (role=\"img\"); omit for decorative art." },
    { name: "size", type: "number", default: "12", description: "font size in px." },
    { name: "lineHeight", type: "number", default: "1.15", description: "line-height multiplier." },
    { name: "className", type: "string" },
  ],
});
