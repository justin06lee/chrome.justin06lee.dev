"use client";

import { useState, type ReactNode } from "react";
import { Editor, EditorTextarea } from "./editor";
import { EditorPreview } from "./editor-preview";
import { useLineSync } from "./use-line-sync";
import { Prose } from "../prose/prose";

const render = (source: string, { highlightLine }: { highlightLine: number | null }): ReactNode => (
  <Prose lineSync highlightLine={highlightLine}>
    {source}
  </Prose>
);

const SPLIT_MD = `## separate components

this editor and preview are two different components, in two boxes with a gap
between them — not one widget.

## still in sync

select text → the **→ preview** button scrolls the right box. click a block on
the right → this editor streaks. the engine aligns by viewport position, so they
don't need to be stuck together.
`;

const FULL_MD = `# combined editor

the same engine, packaged as one turnkey \`<Editor />\`.

## how it works

select text on the left → **→ preview**; click a block here → the editor scrolls
and lays a gray streak over the matching lines.

\`\`\`ts
<Editor value={md} onChange={setMd} renderMarkdown={render} />
\`\`\`
`;

// Two separate components wired by one engine — they sync across the gap.
function SplitPieces() {
  const [md, setMd] = useState(SPLIT_MD);
  const sync = useLineSync({ value: md });
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="h-[280px] flex-1 border border-white/10">
        <EditorTextarea sync={sync} value={md} onChange={setMd} className="h-full" />
      </div>
      <div className="h-[280px] flex-1 border border-white/10">
        <EditorPreview
          ref={sync.previewRef}
          content={md}
          onSelectBlock={sync.onPreviewSelectBlock}
          renderMarkdown={render}
          label="separate preview"
          className="h-full"
        />
      </div>
    </div>
  );
}

export default function EditorDemo() {
  const [md, setMd] = useState(FULL_MD);
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="space-y-2">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          two pieces, one engine
        </div>
        <SplitPieces />
      </div>
      <div className="space-y-2">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          combined &lt;Editor /&gt;
        </div>
        <div className="h-[420px] w-full border border-white/10">
          <Editor value={md} onChange={setMd} renderMarkdown={render} className="h-full" />
        </div>
      </div>
    </div>
  );
}
