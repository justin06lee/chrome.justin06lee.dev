import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "prose",
  type: "registry:ui",
  description:
    "markdown renderer with the justin06lee.dev prose styling — GFM, KaTeX math, heading slugs, and copy-on-hover code blocks. dark-only. pass markdown as the string child.",
  dependencies: [
    "react-markdown",
    "remark-gfm",
    "remark-math",
    "rehype-katex",
    "rehype-slug",
    "katex",
    "lucide-react",
  ],
  registryDependencies: [],
  files: [{ source: "prose.tsx", target: "prose.tsx" }],
  props: [
    { name: "children", type: "string", required: true, description: "markdown source." },
    { name: "imageBaseUrl", type: "string", description: "prefix for relative image srcs." },
  ],
});
