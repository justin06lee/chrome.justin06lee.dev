"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Prose } from "./prose";
import { CodeBlock } from "../code-block/code-block";

const MD = `# heading

prose renders **markdown** with the justin06lee.dev styling — links, lists, and
\`inline code\`.

- gfm tables and lists
- math via katex: $e^{i\\pi} + 1 = 0$

\`\`\`ts
const cn = (...x: string[]) => x.join(" ");
\`\`\`

> blockquotes, too.
`;

export default function ProseDemo() {
  const [view, setView] = useState<"rendered" | "markdown">("rendered");

  return (
    <div className="w-full max-w-xl text-left">
      <div className="mb-3 flex items-center gap-2 font-mono text-[11px]">
        {(["rendered", "markdown"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={cn(
              "border px-2 py-1 transition-colors",
              view === v
                ? "border-white/50 text-white"
                : "border-white/20 text-white/60 hover:border-white/50 hover:text-white",
            )}
          >
            {v}
          </button>
        ))}
      </div>
      {view === "rendered" ? (
        <Prose>{MD}</Prose>
      ) : (
        <CodeBlock code={MD} language="markdown" />
      )}
    </div>
  );
}
