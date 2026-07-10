import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "not-found",
  type: "registry:ui",
  description:
    "the justin06lee.dev 404 block: a random ascii cat fades in above a big mono headline, a muted excuse, and footer links. ten cats ship embedded.",
  dependencies: ["motion"],
  registryDependencies: ["ascii", "utils"],
  files: [
    { source: "not-found.tsx", target: "not-found.tsx" },
    { source: "cat-ascii.ts", target: "cat-ascii.ts" },
  ],
  props: [
    { name: "title", type: "string", default: "'404'", description: "big mono headline." },
    { name: "message", type: "string", default: "'this page wandered off…'", description: "muted line under the headline." },
    { name: "links", type: "{ label: string; href: string }[]", default: "[{ label: 'home', href: '/' }]", description: "footer links (plain anchors)." },
    { name: "cat", type: "number", description: "fix the cat (0-9) instead of picking randomly on mount." },
    { name: "className", type: "string" },
  ],
});
