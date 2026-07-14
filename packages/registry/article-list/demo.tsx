"use client";

import { ArticleList, type ArticlePreview } from "./article-list";

// Inline SVG data-uri banners so the demo is self-contained. With a real
// animated GIF / WebP banner you'd see the defer-until-hover + grayscale-to-color
// swap; static stills here just show the frozen-frame treatment.
function banner(label: string, from: string, to: string): string {
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
    title: "Deferring GIF banners until hover",
    excerpt:
      "Freeze the first frame of an animated banner to a still PNG, then swap to the real GIF only when the user hovers.",
    bannerUrl: banner("canvas", "#1e3a8a", "#9333ea"),
    tags: ["canvas", "performance", "react"],
    publishedAt: "2026-05-12",
  },
  {
    slug: "grayscale-on-hover",
    title: "Grayscale-to-color on hover",
    excerpt:
      "A small CSS transition that makes a card feel alive: muted and grayscale at rest, full color on hover.",
    bannerUrl: banner("css", "#0f766e", "#22d3ee"),
    tags: ["css", "tailwind"],
    publishedAt: "2026-04-03",
  },
  {
    slug: "search-and-filter",
    title: "Client-side search and tag filters",
    excerpt:
      "Wire a search box and clickable tag chips over a list with nothing more than useMemo.",
    bannerUrl: banner("filter", "#7c2d12", "#f59e0b"),
    tags: ["react", "ux"],
    publishedAt: "2026-02-21",
  },
  {
    slug: "framework-agnostic-cards",
    title: "Framework-agnostic cards",
    excerpt:
      "Plain anchors and img tags keep this list portable — drop it into any router by setting basePath.",
    tags: ["html", "ux"],
    publishedAt: "2026-01-09",
  },
];

export default function ArticleListDemo() {
  return (
    <div className="mx-auto w-full max-w-6xl p-4">
      <ArticleList articles={ARTICLES} basePath="#" />
    </div>
  );
}
