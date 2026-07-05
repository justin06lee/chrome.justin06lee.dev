"use client";

import { useState } from "react";
import { Editor, type EditorSize } from "./editor";
import { Prose } from "../prose/prose";

const INITIAL = `# markdown editor

select any text on the left and a **→ preview** button appears — click it and the
matching block on the right scrolls into view and both sides highlight.

## the other direction

click any block in the preview. the editor scrolls to it and lays a gray streak
over the matching lines.

\`\`\`ts
<Editor value={md} onChange={setMd} renderMarkdown={render} />
\`\`\`

- the streak tracks the textarea's own scroll
- editor and preview share one source of line numbers
- \`size\` presets: sm · md · lg · xl · 2xl · screen (default, fills the viewport)
`;

const SIZES: EditorSize[] = ["sm", "md", "lg", "xl", "2xl", "screen"];

export default function EditorDemo() {
  const [md, setMd] = useState(INITIAL);
  const [size, setSize] = useState<EditorSize>("lg");
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center gap-1 font-mono text-[11px]">
        <span className="mr-2 uppercase tracking-[0.18em] text-white/40">size</span>
        {SIZES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSize(s)}
            className={
              "border px-2 py-1 transition-colors " +
              (s === size
                ? "border-white text-white"
                : "border-white/20 text-white/60 hover:border-white/50")
            }
          >
            {s}
          </button>
        ))}
      </div>
      <Editor
        value={md}
        onChange={setMd}
        size={size}
        className="border border-white/10"
        renderMarkdown={(source, { highlightLine }) => (
          <Prose lineSync highlightLine={highlightLine}>
            {source}
          </Prose>
        )}
      />
    </div>
  );
}
