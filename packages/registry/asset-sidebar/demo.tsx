"use client";

import { AssetSidebar, type Asset } from "./asset-sidebar";

const swatch = (label: string, bg: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="320" height="180" fill="${bg}"/><text x="160" y="98" font-family="monospace" font-size="20" fill="#111" text-anchor="middle">${label}</text></svg>`,
  )}`;

const assets: Asset[] = [
  {
    id: "1",
    url: swatch("diagram", "#efede7"),
    name: "system-diagram.png",
    markdownPath: "/images/system-diagram.png",
  },
  {
    id: "2",
    url: swatch("hero", "#d7e3f0"),
    name: "hero-shot.jpg",
    markdownPath: "/images/hero-shot.jpg",
  },
  {
    id: "3",
    url: swatch("logo", "#f0e0d7"),
    name: "logo-mark.svg",
    markdownPath: "/images/logo-mark.svg",
  },
];

export default function AssetSidebarDemo() {
  return (
    <div className="h-[28rem] w-72">
      <AssetSidebar
        assets={assets}
        description="drag into the editor or click insert."
        onInsert={() => {}}
        onDelete={() => {}}
      />
    </div>
  );
}
