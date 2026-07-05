import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "code-block",
  type: "registry:ui",
  description:
    "syntax-highlighted code box with a built-in copy button. monochrome prism theme tuned for a black background.",
  dependencies: ["prism-react-renderer"],
  registryDependencies: ["utils"],
  files: [{ source: "code-block.tsx", target: "code-block.tsx" }],
  props: [
    { name: "code", type: "string", required: true, description: "source to render; trailing newline trimmed." },
    { name: "language", type: "string", default: '"tsx"', description: "prism language id." },
    { name: "copyable", type: "boolean", default: "true", description: "show the top-right copy button." },
    { name: "resetMs", type: "number", default: "2000", description: "ms before the copy label reverts." },
  ],
});
