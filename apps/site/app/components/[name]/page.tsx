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
  ascii: () => import("../../../../../packages/registry/ascii/demo"),
  "not-found": () => import("../../../../../packages/registry/not-found/demo"),
  "asset-sidebar": () => import("../../../../../packages/registry/asset-sidebar/demo"),
  badge: () => import("../../../../../packages/registry/badge/demo"),
  button: () => import("../../../../../packages/registry/button/demo"),
  calendar: () => import("../../../../../packages/registry/calendar/demo"),
  card: () => import("../../../../../packages/registry/card/demo"),
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
  "file-card": () => import("../../../../../packages/registry/file-card/demo"),
  "file-grid": () => import("../../../../../packages/registry/file-grid/demo"),
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
  sidebar: () => import("../../../../../packages/registry/sidebar/demo"),
  "command-palette": () => import("../../../../../packages/registry/command-palette/demo"),
  kbd: () => import("../../../../../packages/registry/kbd/demo"),
  showcase: () => import("../../../../../packages/registry/showcase/demo"),
  socials: () => import("../../../../../packages/registry/socials/demo"),
  stack: () => import("../../../../../packages/registry/stack/demo"),
  "editor": () => import("../../../../../packages/registry/editor/demo"),
  tabs: () => import("../../../../../packages/registry/tabs/demo"),
  textarea: () => import("../../../../../packages/registry/textarea/demo"),
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
  "stat-tile": () => import("../../../../../packages/registry/stat-tile/demo"),
  "bar-list": () => import("../../../../../packages/registry/bar-list/demo"),
  sparkline: () => import("../../../../../packages/registry/sparkline/demo"),
  streak: () => import("../../../../../packages/registry/streak/demo"),
  toast: () => import("../../../../../packages/registry/toast/demo"),
  "break-overlay": () => import("../../../../../packages/registry/break-overlay/demo"),
  "lane-bar": () => import("../../../../../packages/registry/lane-bar/demo"),
  clock: () => import("../../../../../packages/registry/clock/demo"),
  "timer-ring": () => import("../../../../../packages/registry/timer-ring/demo"),
  progress: () => import("../../../../../packages/registry/progress/demo"),
  "interval-picker": () => import("../../../../../packages/registry/interval-picker/demo"),
  field: () => import("../../../../../packages/registry/field/demo"),
  "radio-group": () => import("../../../../../packages/registry/radio-group/demo"),
  switch: () => import("../../../../../packages/registry/switch/demo"),
  callout: () => import("../../../../../packages/registry/callout/demo"),
  "empty-state": () => import("../../../../../packages/registry/empty-state/demo"),
  skeleton: () => import("../../../../../packages/registry/skeleton/demo"),
  "detail-list": () => import("../../../../../packages/registry/detail-list/demo"),
  stepper: () => import("../../../../../packages/registry/stepper/demo"),
  "slot-picker": () => import("../../../../../packages/registry/slot-picker/demo"),
  "date-strip": () => import("../../../../../packages/registry/date-strip/demo"),
  "timezone-select": () => import("../../../../../packages/registry/timezone-select/demo"),
  "availability-grid": () => import("../../../../../packages/registry/availability-grid/demo"),
  "add-to-calendar": () => import("../../../../../packages/registry/add-to-calendar/demo"),
  blueprint: () => import("../../../../../packages/registry/blueprint/demo"),
  hazard: () => import("../../../../../packages/registry/hazard/demo"),
  dimension: () => import("../../../../../packages/registry/dimension/demo"),
  grain: () => import("../../../../../packages/registry/grain/demo"),
  "ascii-shader": () => import("../../../../../packages/registry/ascii-shader/demo"),
  marquee: () => import("../../../../../packages/registry/marquee/demo"),
  stamp: () => import("../../../../../packages/registry/stamp/demo"),
  "pencil-rule": () => import("../../../../../packages/registry/pencil-rule/demo"),
  dropzone: () => import("../../../../../packages/registry/dropzone/demo"),
  docket: () => import("../../../../../packages/registry/docket/demo"),
  pagination: () => import("../../../../../packages/registry/pagination/demo"),
  "album-art": () => import("../../../../../packages/registry/album-art/demo"),
  "sound-bars": () => import("../../../../../packages/registry/sound-bars/demo"),
  playhead: () => import("../../../../../packages/registry/playhead/demo"),
  waveform: () => import("../../../../../packages/registry/waveform/demo"),
  spectrum: () => import("../../../../../packages/registry/spectrum/demo"),
  transport: () => import("../../../../../packages/registry/transport/demo"),
  volume: () => import("../../../../../packages/registry/volume/demo"),
  "track-list": () => import("../../../../../packages/registry/track-list/demo"),
  lyrics: () => import("../../../../../packages/registry/lyrics/demo"),
  "live-badge": () => import("../../../../../packages/registry/live-badge/demo"),
  vinyl: () => import("../../../../../packages/registry/vinyl/demo"),
  "avatar-stack": () => import("../../../../../packages/registry/avatar-stack/demo"),
  shelf: () => import("../../../../../packages/registry/shelf/demo"),
};

// Components that need the full wide canvas — size-adjustable ones (editor,
// desk) and grid layouts that cramp at reading width; everything else renders
// at reading width.
const WIDE_PREVIEW = new Set([
  "editor",
  "desk",
  "article-list",
  "gallery",
  "availability-grid",
  "detail-list",
  "spectrum",
  "waveform",
  "shelf",
]);

// Popup-driven components (dropdown panels) need to leak outside the preview
// and example frames instead of getting clipped by them.
const POPUP_PREVIEW = new Set(["menu", "select", "combobox"]);

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
      key={name}
      name={name}
      description={meta.description}
      source={source}
      installCommand={`bunx @justin06lee/chrome@latest add ${name}`}
      title={title}
      barePreview={name === "showcase"}
      wide={WIDE_PREVIEW.has(name)}
      overflowVisible={POPUP_PREVIEW.has(name)}
      props={meta.props}
    >
      {Demo ? <Demo /> : null}
    </ComponentDetail>
  );
}
