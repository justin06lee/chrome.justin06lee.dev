import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "chrome",
  type: "registry:ui",
  description: "shimmering chrome holographic foil text effect.",
  files: [{ source: "chrome.tsx", target: "chrome.tsx" }],
  props: [
    { name: "as", type: "ElementType", default: "'span'" },
    { name: "children", type: "ReactNode", required: true },
  ],
});
