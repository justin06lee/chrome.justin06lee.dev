import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "ascii",
  type: "registry:ui",
  description:
    "seamless ascii-art renderer — point src at a .txt file (or pass a string child) and it renders on a fixed character grid, no ligatures, no spacing drift. wrap it in chrome to foil every glyph.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [{ source: "ascii.tsx", target: "ascii.tsx" }],
  props: [
    { name: "src", type: "string", description: "url/path of a .txt file holding the art; fetched once and rendered exactly." },
    { name: "children", type: "string", description: "inline art; with src, shows until the file loads." },
    { name: "label", type: "string", description: "accessible name (role=\"img\"); omit for decorative art." },
    { name: "size", type: "number", default: "12", description: "font size in px." },
    { name: "lineHeight", type: "number", default: "1.15", description: "line-height multiplier." },
    { name: "className", type: "string" },
  ],
});
