"use client";

import { useState } from "react";
import { Desk } from "./desk";
import { Prose } from "../prose/prose";
import type { Asset } from "../asset-sidebar/asset-sidebar";

const swatch = (label: string, bg: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="320" height="180" fill="${bg}"/><text x="160" y="98" font-family="monospace" font-size="20" fill="#111" text-anchor="middle">${label}</text></svg>`,
  )}`;

const INITIAL = `# the desk

a full markdown workbench. select text on the left and a **→ preview** button
appears; click a block on the right and the editor scrolls to it.

## images

drag a row from the sidebar into the editor, or click insert. press **new
drawing** in the toolbar to open a floating paint window.

\`\`\`ts
<Desk value={md} onChange={setMd} renderMarkdown={render} />
\`\`\`

- toolbar: edit / preview / split + format buttons
- sidebar: insert, delete, drop-to-upload
- drawing windows: brush, eraser, undo/redo, zoom/pan
`;

let nextId = 100;

export default function DeskDemo() {
  const [md, setMd] = useState(INITIAL);
  const [assets, setAssets] = useState<Asset[]>([
    { id: "1", url: swatch("diagram", "#efede7"), name: "system-diagram.png", markdownPath: "/images/system-diagram.png" },
    { id: "2", url: swatch("hero", "#d7e3f0"), name: "hero-shot.png", markdownPath: "/images/hero-shot.png" },
  ]);

  return (
    <div className="w-full">
      <Desk
        title="the desk"
        subtitle="guides / the-desk"
        value={md}
        onChange={setMd}
        size="xl"
        assets={assets}
        onDeleteAsset={(asset) => setAssets((current) => current.filter((a) => a.id !== asset.id))}
        onUploadAssets={(files) =>
          setAssets((current) => [
            ...files.map((file) => ({
              id: `${(nextId += 1)}`,
              url: URL.createObjectURL(file),
              name: file.name,
              markdownPath: `/images/${file.name}`,
            })),
            ...current,
          ])
        }
        onSaveDrawing={({ dataUrl, darkDataUrl }) => {
          const id = `${(nextId += 1)}`;
          const name = `drawing-${id}.png`;
          setAssets((current) => [
            { id, url: darkDataUrl ?? dataUrl, name, markdownPath: `/images/${name}` },
            ...current,
          ]);
        }}
        renderMarkdown={(source, { highlightLine }) => (
          <Prose lineSync highlightLine={highlightLine}>
            {source}
          </Prose>
        )}
      />
    </div>
  );
}
