"use client";

import { useState } from "react";
import { SyncedEditor } from "./synced-editor";
import { Prose } from "../prose/prose";

const INITIAL = `# synced editor

select any text on the left and a **→ preview** button appears — click it and the
matching block on the right scrolls into view and both sides highlight.

## try the other direction

click any block over here in the preview. the editor scrolls to it and lays a gray
streak over the matching lines.

\`\`\`ts
// code blocks sync too — click this one
const sync = useLineSync({ value });
\`\`\`

- the streak tracks the textarea's own scroll
- line math is the same source on both sides
`;

export default function SyncedEditorDemo() {
  const [md, setMd] = useState(INITIAL);
  return (
    <div className="h-[460px] w-full border border-white/10">
      <SyncedEditor
        value={md}
        onChange={setMd}
        renderMarkdown={(source, { highlightLine }) => (
          <Prose lineSync highlightLine={highlightLine}>
            {source}
          </Prose>
        )}
      />
    </div>
  );
}
