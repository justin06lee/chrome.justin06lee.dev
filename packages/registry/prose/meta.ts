import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "prose",
  type: "registry:ui",
  description:
    "markdown renderer with the justin06lee.dev prose styling — GFM, KaTeX math, heading slugs, and syntax-highlighted code blocks (via code-block). dark-only. pass markdown as the string child.",
  dependencies: [
    "react-markdown",
    "remark-gfm",
    "remark-math",
    "rehype-katex",
    "rehype-slug",
    "katex",
  ],
  registryDependencies: ["code-block"],
  files: [{ source: "prose.tsx", target: "prose.tsx" }],
  props: [
    { name: "children", type: "string", required: true, description: "markdown source." },
    { name: "imageBaseUrl", type: "string", description: "prefix for relative image srcs." },
    {
      name: "lineSync",
      type: "boolean",
      default: "false",
      description:
        "stamp each top-level block with data-source-line for editor↔preview scroll/highlight sync. zero overhead when off.",
    },
    {
      name: "highlightLine",
      type: "number | null",
      default: "null",
      description:
        "1-based source line whose block is marked with data-sync-highlight. requires lineSync.",
    },
  ],
});
