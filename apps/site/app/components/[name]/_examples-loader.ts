"use client";

import type { UsageExample } from "./_examples";

type ExampleModule = Record<string, UsageExample[]>;
type ModuleLoader = () => Promise<ExampleModule>;

// Which example module each component's usage examples live in. Keeping this
// as name lists (instead of importing the maps) lets each module stay in its
// own lazy chunk — a detail page only downloads the chunk it needs.
const CHUNKS: Array<[ModuleLoader, string[]]> = [
  [
    () => import("./_examples").then((m) => m.BASE_EXAMPLES),
    [
      "accordion",
      "article",
      "badge",
      "button",
      "calendar",
      "card",
      "chrome",
      "combobox",
      "copy-button",
      "dialog",
      "donut",
      "heatmap",
      "input",
      "menu",
      "navbar",
      "prose",
      "rainbow",
      "range",
      "scramble",
      "segmented",
      "select",
      "showcase",
      "stack",
      "tabs",
      "textarea",
      "timeline",
      "toc",
      "tooltip",
    ],
  ],
  [
    () => import("./_examples-forms").then((m) => m.FORM_EXAMPLES),
    [
      "checkbox",
      "code-block",
      "collapsible-prose",
      "color-swatch",
      "inline-edit",
      "login-form",
      "pfp",
      "tag-input",
    ],
  ],
  [
    () => import("./_examples-content").then((m) => m.CONTENT_EXAMPLES),
    [
      "article-list",
      "ascii",
      "not-found",
      "breadcrumb",
      "calendar-nav",
      "count-up",
      "fade-in",
      "gallery",
      "image-cropper",
      "intro",
      "sprite-scrubber",
    ],
  ],
  [
    () => import("./_examples-editor").then((m) => m.EDITOR_EXAMPLES),
    [
      "asset-sidebar",
      "desk",
      "drawing-window",
      "editor",
      "editor-toolbar",
      "manager-table",
      "now-playing-bar",
      "sheet",
      "socials",
    ],
  ],
];

/** Load the usage examples for one component, pulling in only its chunk. */
export function loadUsageExamples(name: string): Promise<UsageExample[]> {
  const chunk = CHUNKS.find(([, names]) => names.includes(name));
  if (!chunk) return Promise.resolve([]);
  return chunk[0]().then((examples) => examples[name] ?? []);
}
