import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "article",
  type: "registry:ui",
  description:
    "article reading layout — back link, banner, title, date + tags, then a body slot with staggered fade-ins. pair with prose for the markdown body.",
  dependencies: ["motion", "lucide-react"],
  registryDependencies: ["utils"],
  files: [{ source: "article.tsx", target: "article.tsx" }],
  props: [
    { name: "title", type: "string", required: true },
    { name: "date", type: "string", description: "ISO string or pre-formatted label." },
    { name: "tags", type: "string[]" },
    { name: "banner", type: "string", description: "banner image URL." },
    { name: "backHref", type: "string", description: "renders a back link." },
    { name: "children", type: "ReactNode", description: "body — typically <Prose>{markdown}</Prose>." },
  ],
});
