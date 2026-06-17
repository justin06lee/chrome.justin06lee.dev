"use client";

import { useState } from "react";
import { Editor } from "./editor";
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
`;

export default function EditorDemo() {
  const [md, setMd] = useState(INITIAL);
  return (
    <div className="h-[460px] w-full border border-white/10">
      <Editor
        value={md}
        onChange={setMd}
        className="h-full"
        renderMarkdown={(source, { highlightLine }) => (
          <Prose lineSync highlightLine={highlightLine}>
            {source}
          </Prose>
        )}
      />
    </div>
  );
}
