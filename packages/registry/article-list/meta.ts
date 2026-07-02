import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "article-list",
  type: "registry:ui",
  description:
    "searchable, tag-filterable grid of article cards. each card defers its animated gif/webp banner — showing a frozen, grayscale first frame (rendered to a still png via canvas) until hover, then swapping to the animated original in full color. dark-only; plain <a>/<img> so it stays framework-agnostic.",
  registryDependencies: ["utils", "badge"],
  files: [{ source: "article-list.tsx", target: "article-list.tsx" }],
  props: [
    { name: "articles", type: "ArticlePreview[]", required: true, description: "articles to render as cards." },
    { name: "basePath", type: "string", default: "''", description: "prefix for card hrefs, built as `${basePath}/${slug}`." },
    { name: "defaultQuery", type: "string", default: "''", description: "initial value of the search box." },
    { name: "defaultTag", type: "string", description: "initially selected tag filter." },
    { name: "className", type: "string" },
  ],
});
