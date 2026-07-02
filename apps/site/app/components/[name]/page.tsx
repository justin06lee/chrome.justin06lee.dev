import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ComponentType } from "react";
import type { ComponentMeta } from "chrome-ui-registry-builder";
import { REGISTRY } from "../../../registry-manifest";
import { ComponentDetail } from "./_detail";
import { Chrome } from "../../../../../packages/registry/chrome/chrome";

// Static map of demo imports keyed by component name. Turbopack can't resolve
// a fully dynamic import path through packages/registry/<name>/demo.tsx
// (the parent contains non-component dirs), so we enumerate explicitly.
const DEMOS: Record<string, () => Promise<{ default: ComponentType }>> = {
  accordion: () => import("../../../../../packages/registry/accordion/demo"),
  article: () => import("../../../../../packages/registry/article/demo"),
  "asset-sidebar": () => import("../../../../../packages/registry/asset-sidebar/demo"),
  badge: () => import("../../../../../packages/registry/badge/demo"),
  button: () => import("../../../../../packages/registry/button/demo"),
  calendar: () => import("../../../../../packages/registry/calendar/demo"),
  card: () => import("../../../../../packages/registry/card/demo"),
  "category-picker": () => import("../../../../../packages/registry/category-picker/demo"),
  checkbox: () => import("../../../../../packages/registry/checkbox/demo"),
  chrome: () => import("../../../../../packages/registry/chrome/demo"),
  "code-block": () => import("../../../../../packages/registry/code-block/demo"),
  "collapsible-prose": () => import("../../../../../packages/registry/collapsible-prose/demo"),
  "color-swatch": () => import("../../../../../packages/registry/color-swatch/demo"),
  combobox: () => import("../../../../../packages/registry/combobox/demo"),
  "copy-button": () => import("../../../../../packages/registry/copy-button/demo"),
  desk: () => import("../../../../../packages/registry/desk/demo"),
  dialog: () => import("../../../../../packages/registry/dialog/demo"),
  donut: () => import("../../../../../packages/registry/donut/demo"),
  "drawing-window": () => import("../../../../../packages/registry/drawing-window/demo"),
  "editor-toolbar": () => import("../../../../../packages/registry/editor-toolbar/demo"),
  heatmap: () => import("../../../../../packages/registry/heatmap/demo"),
  "inline-edit": () => import("../../../../../packages/registry/inline-edit/demo"),
  input: () => import("../../../../../packages/registry/input/demo"),
  "login-form": () => import("../../../../../packages/registry/login-form/demo"),
  menu: () => import("../../../../../packages/registry/menu/demo"),
  navbar: () => import("../../../../../packages/registry/navbar/demo"),
  pfp: () => import("../../../../../packages/registry/pfp/demo"),
  prose: () => import("../../../../../packages/registry/prose/demo"),
  rainbow: () => import("../../../../../packages/registry/rainbow/demo"),
  range: () => import("../../../../../packages/registry/range/demo"),
  scramble: () => import("../../../../../packages/registry/scramble/demo"),
  segmented: () => import("../../../../../packages/registry/segmented/demo"),
  select: () => import("../../../../../packages/registry/select/demo"),
  sheet: () => import("../../../../../packages/registry/sheet/demo"),
  showcase: () => import("../../../../../packages/registry/showcase/demo"),
  socials: () => import("../../../../../packages/registry/socials/demo"),
  stack: () => import("../../../../../packages/registry/stack/demo"),
  "editor": () => import("../../../../../packages/registry/editor/demo"),
  tabs: () => import("../../../../../packages/registry/tabs/demo"),
  textarea: () => import("../../../../../packages/registry/textarea/demo"),
  tilt: () => import("../../../../../packages/registry/tilt/demo"),
  timeline: () => import("../../../../../packages/registry/timeline/demo"),
  toc: () => import("../../../../../packages/registry/toc/demo"),
  tooltip: () => import("../../../../../packages/registry/tooltip/demo"),
  "article-list": () => import("../../../../../packages/registry/article-list/demo"),
  breadcrumb: () => import("../../../../../packages/registry/breadcrumb/demo"),
  "calendar-nav": () => import("../../../../../packages/registry/calendar-nav/demo"),
  "count-up": () => import("../../../../../packages/registry/count-up/demo"),
  "fade-in": () => import("../../../../../packages/registry/fade-in/demo"),
  gallery: () => import("../../../../../packages/registry/gallery/demo"),
  "image-cropper": () => import("../../../../../packages/registry/image-cropper/demo"),
  intro: () => import("../../../../../packages/registry/intro/demo"),
  "manager-table": () => import("../../../../../packages/registry/manager-table/demo"),
  "now-playing-bar": () => import("../../../../../packages/registry/now-playing-bar/demo"),
  "sprite-scrubber": () => import("../../../../../packages/registry/sprite-scrubber/demo"),
  "tag-input": () => import("../../../../../packages/registry/tag-input/demo"),
};

export async function generateStaticParams() {
  return REGISTRY.filter((m) => m.type === "registry:ui").map((m) => ({ name: m.name }));
}

export default async function ComponentPage(props: { params: Promise<{ name: string }> }) {
  const { name } = await props.params;
  const meta = REGISTRY.find((m) => m.name === name) as ComponentMeta | undefined;
  if (!meta) notFound();

  const folder = meta.type === "registry:ui"
    ? join(process.cwd(), "..", "..", "packages", "registry", name)
    : join(process.cwd(), "..", "..", "packages", "registry", "_shared", name);
  const sourceFile = meta.files[0]?.source ?? `${name}.tsx`;
  let source: string;
  try {
    source = await readFile(join(folder, sourceFile), "utf8");
  } catch {
    notFound();
  }

  const Demo: ComponentType | null = meta.type === "registry:ui" && DEMOS[name]
    ? (await DEMOS[name]()).default
    : null;

  const title =
    name === "chrome" ? (
      <Chrome
        as="h1"
        className="font-serif italic font-bold tracking-[-0.02em] mb-3 inline-block text-[44px]"
      >
        chrome.
      </Chrome>
    ) : undefined;

  return (
    <ComponentDetail
      name={name}
      description={meta.description}
      source={source}
      installCommand={`bunx @justin06lee/chrome@latest add ${name}`}
      title={title}
      barePreview={name === "showcase"}
    >
      {Demo ? <Demo /> : null}
    </ComponentDetail>
  );
}
