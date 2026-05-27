"use client";

import { Prose } from "./prose";

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
  return (
    <div className="w-full max-w-xl text-left">
      <Prose>{MD}</Prose>
    </div>
  );
}
