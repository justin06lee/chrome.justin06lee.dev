"use client";

import { Gallery, type GalleryItem } from "./gallery";

const ITEMS: GalleryItem[] = [
  {
    id: "chrome-ui",
    title: "chrome-ui registry",
    link: "https://chrome.justin06lee.dev",
    description:
      "A dark-only, shadcn-style component registry distributed over the CLI.",
    year: 2026,
    tech: ["Next.js", "TypeScript", "Tailwind"],
    repo: "https://github.com/justin06lee/chrome.justin06lee.dev",
    live: "https://chrome.justin06lee.dev",
    notes: "The registry you are reading right now.",
    pinned: true,
  },
  {
    id: "portfolio",
    title: "Personal site",
    link: "https://justin06lee.dev",
    description:
      "Statically generated portfolio with a searchable project gallery.",
    year: 2025,
    tech: ["Next.js", "TypeScript", "Motion"],
    live: "https://justin06lee.dev",
  },
  {
    id: "donut",
    title: "ASCII donut",
    description:
      "A spinning torus rendered with characters, ported to a React canvas.",
    year: 2024,
    tech: ["React", "Canvas", "Math"],
    repo: "https://github.com/justin06lee/donut",
  },
  {
    id: "prose",
    title: "Prose renderer",
    description:
      "Markdown-to-React renderer with line-sync for split-pane editors.",
    year: 2025,
    tech: ["TypeScript", "Markdown"],
  },
  {
    id: "synth",
    title: "Web synth toy",
    description:
      "A tiny subtractive synthesizer driven by the Web Audio API.",
    year: 2023,
    tech: ["Web Audio", "React"],
    notes: "Mostly an excuse to learn oscillators.",
  },
];

export default function GalleryDemo() {
  return (
    <Gallery
      title="Things I've built"
      items={ITEMS}
      initialSort="newest"
    />
  );
}
