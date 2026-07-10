"use client";

import { useState } from "react";
import type { UsageExample } from "./_examples";
import {
  ArticleList,
  type ArticlePreview,
} from "../../../../../packages/registry/article-list/article-list";
import { Breadcrumb, crumbsFromPath } from "../../../../../packages/registry/breadcrumb/breadcrumb";
import {
  CalendarNav,
  type CalendarView,
} from "../../../../../packages/registry/calendar-nav/calendar-nav";
import { Ascii } from "../../../../../packages/registry/ascii/ascii";
import { Chrome } from "../../../../../packages/registry/chrome/chrome";
import { NotFound } from "../../../../../packages/registry/not-found/not-found";
import { CAT_ASCII } from "../../../../../packages/registry/not-found/cat-ascii";
import { CountUp } from "../../../../../packages/registry/count-up/count-up";
import { FadeIn, staggerDelay } from "../../../../../packages/registry/fade-in/fade-in";
import { Gallery, type GalleryItem } from "../../../../../packages/registry/gallery/gallery";
import {
  ImageCropper,
  type CropValue,
} from "../../../../../packages/registry/image-cropper/image-cropper";
import { SpriteScrubber } from "../../../../../packages/registry/sprite-scrubber/sprite-scrubber";
import { Intro } from "../../../../../packages/registry/intro/intro";

// --- deterministic inline assets --------------------------------------------

/** Gradient SVG data uri so examples stay self-contained (no network fetches). */
function swatch(label: string, from: string, to: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
    </linearGradient></defs>
    <rect width="600" height="300" fill="url(#g)"/>
    <text x="50%" y="50%" fill="#ffffff" font-family="monospace" font-size="36"
      text-anchor="middle" dominant-baseline="middle">${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const ARTICLES: ArticlePreview[] = [
  {
    slug: "deferring-gif-banners",
    title: "deferring gif banners",
    excerpt: "freeze the first frame to a still, swap to the animated original on hover.",
    bannerUrl: swatch("canvas", "#1e3a8a", "#9333ea"),
    tags: ["canvas", "react"],
    publishedAt: "2026-05-12",
  },
  {
    slug: "search-and-filter",
    title: "client-side search and filters",
    excerpt: "a search box and clickable tag chips over a list with nothing more than useMemo.",
    bannerUrl: swatch("filter", "#0f766e", "#22d3ee"),
    tags: ["react", "ux"],
    publishedAt: "2026-02-21",
  },
];

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "chrome-ui",
    title: "chrome-ui registry",
    description: "dark-only, shadcn-style component registry distributed over the CLI.",
    year: 2026,
    tech: ["Next.js", "TypeScript"],
    repo: "https://github.com/justin06lee/chrome.justin06lee.dev",
    pinned: true,
  },
  {
    id: "donut",
    title: "ascii donut",
    description: "a spinning torus rendered with characters, ported to a React canvas.",
    year: 2024,
    tech: ["React", "Canvas"],
    live: "https://justin06lee.dev",
  },
];

// Synthetic sprite sheet: each cell draws its frame number and a rotating hand,
// so scrubbing across is visible. Deterministic — no randomness.
function buildSheet(cols: number, rows: number, frames: number): string {
  const cell = 160;
  let cells = "";
  for (let i = 0; i < frames; i++) {
    const x = (i % cols) * cell;
    const y = Math.floor(i / cols) * cell;
    const cx = x + cell / 2;
    const cy = y + cell / 2;
    const rad = ((i / frames) * 360 - 90) * (Math.PI / 180);
    const r = cell * 0.32;
    const hx = cx + Math.cos(rad) * r;
    const hy = cy + Math.sin(rad) * r;
    const hue = Math.round((i / frames) * 360);
    cells += `<g>
      <rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="#0a0a0a"/>
      <circle cx="${cx}" cy="${cy}" r="${r + 6}" fill="none" stroke="#262626" stroke-width="2"/>
      <line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" stroke="hsl(${hue} 90% 60%)" stroke-width="5" stroke-linecap="round"/>
      <text x="${x + 10}" y="${y + 26}" font-family="monospace" font-size="18" fill="#e5e5e5">${i + 1}</text>
    </g>`;
  }
  const w = cols * cell;
  const h = rows * cell;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${cells}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const SHEET = buildSheet(4, 2, 8);

// --- stateful examples need their own little wrapper components ------------

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function CalendarNavExample() {
  const [view, setView] = useState<CalendarView>("month");
  const [date, setDate] = useState(() => new Date(2026, 5, 24)); // June 24, 2026
  // Arrows step by the active view's unit: ±1 day / ±1 month / ±1 year.
  const step = (dir: -1 | 1) =>
    setDate((d) => {
      const next = new Date(d);
      if (view === "day") next.setDate(d.getDate() + dir);
      else if (view === "month") next.setMonth(d.getMonth() + dir);
      else next.setFullYear(d.getFullYear() + dir);
      return next;
    });
  const month = MONTHS[date.getMonth()] ?? "";
  const label =
    view === "year"
      ? String(date.getFullYear())
      : view === "month"
        ? `${month} ${date.getFullYear()}`
        : `${month} ${date.getDate()}, ${date.getFullYear()}`;
  return (
    <div className="w-full max-w-xl">
      <CalendarNav
        label={label}
        view={view}
        onViewChange={setView}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
        onToday={() => setDate(new Date(2026, 5, 24))}
      />
    </div>
  );
}

function CalendarNavCompactExample() {
  const [view, setView] = useState<CalendarView>("day");
  return (
    <div className="w-full max-w-xl">
      <CalendarNav
        label="June 24, 2026"
        view={view}
        views={["day", "month"]}
        onViewChange={setView}
        todayLabel="now"
      />
    </div>
  );
}

const COUNT_TARGETS = [1280, 4096, 512, 9021];

function CountUpExample() {
  const [i, setI] = useState(0);
  return (
    <div className="flex flex-col items-center gap-3 font-mono">
      <CountUp value={COUNT_TARGETS[i % COUNT_TARGETS.length] ?? 0} className="text-4xl tracking-tight" />
      <button
        type="button"
        onClick={() => setI((n) => n + 1)}
        className="border border-white/15 px-3 py-1 text-xs uppercase tracking-widest text-white/70 hover:text-white"
      >
        next target
      </button>
    </div>
  );
}

function ImageCropperExample({ circle }: { circle?: boolean }) {
  const [crop, setCrop] = useState<CropValue>({
    url: swatch(circle ? "avatar" : "photo", "#1e3a8a", "#9333ea"),
    scale: 1,
    x: 0,
    y: 0,
  });
  return <ImageCropper value={crop} onChange={setCrop} size={200} circle={circle} />;
}

function SpriteScrubberExample() {
  const [frame, setFrame] = useState(0);
  return (
    <div className="flex flex-col items-center gap-3">
      <SpriteScrubber
        src={SHEET}
        frames={8}
        cols={4}
        rows={2}
        aspectRatio="1 / 1"
        onFrameChange={setFrame}
        className="w-48"
        aria-label="sprite scrubber example"
      />
      <span className="font-mono text-xs tabular-nums text-white/50">frame {frame + 1} / 8</span>
    </div>
  );
}

function IntroExample({
  steps,
  stepDuration,
  skipLabel,
  buttonLabel,
}: {
  steps: string[];
  stepDuration: number;
  skipLabel?: string;
  buttonLabel: string;
}) {
  // Remount key so the intro replays from the start each time.
  const [cycle, setCycle] = useState<number | null>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => setCycle((c) => (c ?? 0) + 1)}
        className="border border-white/40 px-3 py-1 text-xs text-white transition hover:bg-white hover:text-black"
      >
        {buttonLabel}
      </button>
      {cycle !== null && (
        // No persistKey, so it replays on every click. onComplete unmounts it.
        <Intro
          key={cycle}
          steps={steps}
          stepDuration={stepDuration}
          skipLabel={skipLabel}
          onComplete={() => setCycle(null)}
        />
      )}
    </>
  );
}

// --- the example table -----------------------------------------------------

export const CONTENT_EXAMPLES: Record<string, UsageExample[]> = {
  ascii: [
    {
      label: "Basic",
      code: "<Ascii label=\"ascii cat\">{art}</Ascii>",
      render: <Ascii label="ascii cat">{CAT_ASCII[1] ?? ""}</Ascii>,
    },
    {
      label: "Sized",
      code: '<Ascii size={16} lineHeight={1.05}>{art}</Ascii>',
      render: <Ascii size={16} lineHeight={1.05}>{CAT_ASCII[6] ?? ""}</Ascii>,
    },
    {
      label: "Chrome foil",
      code: '<Chrome as="div">\n  <Ascii>{art}</Ascii>\n</Chrome>',
      render: (
        <Chrome as="div">
          <Ascii>{CAT_ASCII[4] ?? ""}</Ascii>
        </Chrome>
      ),
    },
  ],
  "not-found": [
    {
      label: "Basic",
      code: '<NotFound links={[{ label: "home", href: "/" }]} />',
      render: <NotFound links={[{ label: "home", href: "#" }]} className="py-6" />,
    },
    {
      label: "Custom copy & fixed cat",
      code:
        '<NotFound\n  title="lost?"\n  message="nothing lives at this address."\n  cat={2}\n' +
        '  links={[{ label: "home", href: "/" }, { label: "docs", href: "/docs" }]}\n/>',
      render: (
        <NotFound
          title="lost?"
          message="nothing lives at this address."
          cat={2}
          links={[
            { label: "home", href: "#" },
            { label: "docs", href: "#" },
          ]}
          className="py-6"
        />
      ),
    },
  ],
  "article-list": [
    {
      label: "Basic",
      code:
        "<ArticleList\n" +
        '  basePath="/articles"\n' +
        "  articles={[\n" +
        '    { slug: "deferring-gif-banners", title: "deferring gif banners",\n' +
        '      excerpt: "freeze the first frame…", bannerUrl: banner, tags: ["canvas", "react"],\n' +
        '      publishedAt: "2026-05-12" },\n' +
        "    // …\n" +
        "  ]}\n/>",
      render: (
        <div className="w-full max-w-2xl text-left">
          <ArticleList articles={ARTICLES} basePath="#" />
        </div>
      ),
    },
    {
      label: "Preselected tag",
      code: '<ArticleList articles={articles} defaultTag="react" />',
      render: (
        <div className="w-full max-w-2xl text-left">
          <ArticleList articles={ARTICLES} basePath="#" defaultTag="react" />
        </div>
      ),
    },
  ],
  breadcrumb: [
    {
      label: "Basic",
      code:
        "<Breadcrumb\n  items={[\n" +
        '    { label: "desk", href: "/desk" },\n' +
        '    { label: "articles", href: "/desk/articles" },\n' +
        '    { label: "edit" },\n' +
        "  ]}\n/>",
      render: (
        <Breadcrumb
          items={[
            { label: "desk", href: "#" },
            { label: "articles", href: "#" },
            { label: "edit" },
          ]}
        />
      ),
    },
    {
      label: "From a pathname",
      code:
        '<Breadcrumb\n  homeHref="/"\n  items={crumbsFromPath("/desk/articles/field-notes/edit", {\n' +
        '    basePath: "/desk",\n  })}\n/>',
      render: (
        <Breadcrumb
          homeHref="#"
          items={crumbsFromPath("/desk/articles/field-notes/edit", { basePath: "/desk" })}
        />
      ),
    },
    {
      label: "Custom separator",
      code:
        '<Breadcrumb\n  separator={<span className="text-white/30">/</span>}\n' +
        '  items={[\n    { label: "components", href: "/components" },\n    { label: "breadcrumb" },\n  ]}\n/>',
      render: (
        <Breadcrumb
          separator={<span className="text-white/30">/</span>}
          items={[{ label: "components", href: "#" }, { label: "breadcrumb" }]}
        />
      ),
    },
  ],
  "calendar-nav": [
    {
      label: "Controlled",
      code:
        'const [view, setView] = useState("month");\n' +
        "const [date, setDate] = useState(() => new Date(2026, 5, 24));\n\n" +
        "// arrows step by the active view's unit\n" +
        "const step = (dir) =>\n" +
        "  setDate((d) => {\n" +
        "    const next = new Date(d);\n" +
        '    if (view === "day") next.setDate(d.getDate() + dir);\n' +
        '    else if (view === "month") next.setMonth(d.getMonth() + dir);\n' +
        "    else next.setFullYear(d.getFullYear() + dir);\n" +
        "    return next;\n" +
        "  });\n\n" +
        "<CalendarNav\n  label={label}\n  view={view}\n  onViewChange={setView}\n" +
        "  onPrev={() => step(-1)}\n" +
        "  onNext={() => step(1)}\n" +
        "  onToday={() => setDate(new Date(2026, 5, 24))}\n/>",
      render: <CalendarNavExample />,
    },
    {
      label: "Fewer views, custom today label",
      code:
        '<CalendarNav\n  label="June 24, 2026"\n  view={view}\n  views={["day", "month"]}\n' +
        '  onViewChange={setView}\n  todayLabel="now"\n/>',
      render: <CalendarNavCompactExample />,
    },
  ],
  "count-up": [
    {
      label: "Basic",
      code:
        "const [target, setTarget] = useState(1280);\n\n" +
        '<CountUp value={target} className="text-4xl" />',
      render: <CountUpExample />,
    },
    {
      label: "Decimals + suffix",
      code: '<CountUp value={99.5} decimals={1} suffix="%" duration={1.5} />',
      render: (
        <div className="font-mono text-2xl text-white/80">
          <CountUp value={99.5} decimals={1} suffix="%" duration={1.5} />
        </div>
      ),
    },
    {
      label: "Custom format",
      code: '<CountUp\n  value={1234567}\n  prefix="$"\n  format={(n) => Math.round(n).toLocaleString("en-US")}\n/>',
      render: (
        <div className="font-mono text-2xl text-white/80">
          <CountUp
            value={1234567}
            prefix="$"
            format={(n) => Math.round(n).toLocaleString("en-US")}
          />
        </div>
      ),
    },
  ],
  "fade-in": [
    {
      label: "Basic",
      code: "<FadeIn>\n  fades in on mount\n</FadeIn>",
      render: (
        <FadeIn className="border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
          fades in on mount
        </FadeIn>
      ),
    },
    {
      label: "Staggered list",
      code:
        "{items.map((item, i) => (\n" +
        "  <FadeIn key={item} delay={staggerDelay(i)}>\n    {item}\n  </FadeIn>\n))}",
      render: (
        <div className="w-full max-w-xs space-y-2">
          {["fade in on mount", "staggered by index", "pure css, no motion dep"].map(
            (item, i) => (
              <FadeIn
                key={item}
                delay={staggerDelay(i)}
                className="flex items-center gap-3 border border-white/10 bg-white/5 px-4 py-3"
              >
                <span className="font-mono text-xs tabular-nums text-white/40">
                  0{i + 1}
                </span>
                <span className="text-sm text-white/80">{item}</span>
              </FadeIn>
            ),
          )}
        </div>
      ),
    },
    {
      label: "From the left, slower",
      code: "<FadeIn x={-16} y={0} duration={0.8}>\n  slides in from the left\n</FadeIn>",
      render: (
        <FadeIn
          x={-16}
          y={0}
          duration={0.8}
          className="border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80"
        >
          slides in from the left
        </FadeIn>
      ),
    },
  ],
  gallery: [
    {
      label: "Basic",
      code:
        '<Gallery\n  title="Things I\'ve built"\n  items={[\n' +
        '    { id: "chrome-ui", title: "chrome-ui registry", description: "…",\n' +
        '      year: 2026, tech: ["Next.js", "TypeScript"], repo: "…", pinned: true },\n' +
        "    // …\n" +
        "  ]}\n/>",
      render: (
        <Gallery
          title="Things I've built"
          items={GALLERY_ITEMS}
          chipBase={0}
          chipStep={0}
          className="w-full max-w-2xl p-0 text-left"
        />
      ),
    },
    {
      label: "Custom subtitle + initial sort",
      code:
        '<Gallery\n  title="Projects"\n  subtitle="sorted alphabetically; pinned items stay first."\n' +
        '  initialSort="az"\n  items={items}\n/>',
      render: (
        <Gallery
          title="Projects"
          subtitle="sorted alphabetically; pinned items stay first."
          initialSort="az"
          items={GALLERY_ITEMS}
          chipBase={0}
          chipStep={0}
          className="w-full max-w-2xl p-0 text-left"
        />
      ),
    },
  ],
  "image-cropper": [
    {
      label: "Basic",
      code:
        "const [crop, setCrop] = useState({ url, scale: 1, x: 0, y: 0 });\n\n" +
        "<ImageCropper value={crop} onChange={setCrop} size={200} />",
      render: <ImageCropperExample />,
    },
    {
      label: "Circle guide",
      code: "<ImageCropper value={crop} onChange={setCrop} size={200} circle />",
      render: <ImageCropperExample circle />,
    },
  ],
  "sprite-scrubber": [
    {
      label: "Basic",
      code:
        "<SpriteScrubber\n  src={sheetUrl}\n  frames={8}\n  cols={4}\n  rows={2}\n" +
        '  aspectRatio="1 / 1"\n  className="w-48"\n/>',
      render: (
        <SpriteScrubber
          src={SHEET}
          frames={8}
          cols={4}
          rows={2}
          aspectRatio="1 / 1"
          className="w-48"
          aria-label="sprite scrubber"
        />
      ),
    },
    {
      label: "Frame callback",
      code:
        "<SpriteScrubber\n  src={sheetUrl}\n  frames={8}\n  cols={4}\n  rows={2}\n" +
        '  aspectRatio="1 / 1"\n  onFrameChange={setFrame}\n/>',
      render: <SpriteScrubberExample />,
    },
  ],
  intro: [
    {
      label: "Replay on demand",
      code:
        "// remount via key to replay; onComplete unmounts it\n" +
        "<Intro\n  key={cycle}\n" +
        '  steps={["hi.", "im a registry component.", "welcome."]}\n' +
        "  stepDuration={1500}\n  onComplete={() => setCycle(null)}\n/>",
      render: (
        <IntroExample
          steps={["hi.", "im a registry component.", "welcome."]}
          stepDuration={1500}
          buttonLabel="play intro"
        />
      ),
    },
    {
      label: "Faster steps, custom skip label",
      code:
        '<Intro\n  steps={["one.", "two.", "three."]}\n  stepDuration={900}\n' +
        '  skipLabel="close"\n  onComplete={() => setCycle(null)}\n/>',
      render: (
        <IntroExample
          steps={["one.", "two.", "three."]}
          stepDuration={900}
          skipLabel="close"
          buttonLabel="play fast intro"
        />
      ),
    },
  ],
};
