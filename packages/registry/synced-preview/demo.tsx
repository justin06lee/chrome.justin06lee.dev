"use client";

import { useCallback, useRef, useState } from "react";
import {
  SyncedPreview,
  type PreviewBlockSelection,
  type SyncedPreviewHandle,
} from "./synced-preview";
import { Prose } from "../prose/prose";

const INITIAL = `# synced preview

click anywhere in the editor — the matching block on the right scrolls into
view and lights up. click a block on the right and the editor jumps to it.

## how it works

the preview renders markdown with \`lineSync\`, which stamps each top-level
block with its source line. the pane maps editor lines to blocks and back.

- top-level blocks carry \`data-source-line\`
- the synced block carries \`data-sync-highlight\`

## try it

edit this text, then click around. the two panes stay aligned by source line.
`;

// 1-based line index of the caret inside a textarea
function caretLine(el: HTMLTextAreaElement): number {
  return el.value.slice(0, el.selectionStart).split("\n").length;
}

export default function SyncedPreviewDemo() {
  const [content, setContent] = useState(INITIAL);
  const previewRef = useRef<SyncedPreviewHandle>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // editor → preview: align the block for the caret line to the caret's height.
  // The pane highlights it (it self-manages the highlight from this call).
  const syncFromEditor = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    previewRef.current?.alignLineToScreenY(
      caretLine(el),
      el.getBoundingClientRect().top + 24,
    );
  }, []);

  // preview → editor: move the caret to the clicked block's start line
  const onSelectBlock = useCallback((sel: PreviewBlockSelection) => {
    const el = editorRef.current;
    if (!el) return;
    const offset =
      el.value.split("\n").slice(0, sel.startLine - 1).join("\n").length +
      (sel.startLine > 1 ? 1 : 0);
    el.focus();
    el.setSelectionRange(offset, offset);
  }, []);

  return (
    <div className="grid h-[28rem] w-full max-w-4xl grid-cols-2 border border-white/10 text-left">
      <textarea
        ref={editorRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onClick={syncFromEditor}
        onKeyUp={syncFromEditor}
        spellCheck={false}
        className="min-h-0 resize-none border-r border-white/10 bg-black p-4 font-mono text-[13px] leading-6 text-white/85 focus:outline-none"
      />
      <SyncedPreview
        ref={previewRef}
        content={content}
        onSelectBlock={onSelectBlock}
        renderMarkdown={(md, { highlightLine: hl }) => (
          <Prose lineSync highlightLine={hl}>
            {md}
          </Prose>
        )}
        className="h-full"
      />
    </div>
  );
}
