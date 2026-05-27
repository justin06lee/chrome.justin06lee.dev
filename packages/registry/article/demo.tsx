"use client";

import { Article } from "./article";
import { Prose } from "../prose/prose";

const BODY = `## introduction

the **article** layout pairs a header (title, date, tags, optional banner and
back link) with a body slot. drop \`prose\` inside for markdown.

- staggered fade-ins on mount
- lowercase, thin borders, dark-only

## usage

\`\`\`tsx
<Article title="my post" date="2026-05-24" tags={["dev"]}>
  <Prose>{markdown}</Prose>
</Article>
\`\`\`
`;

export default function ArticleDemo() {
  return (
    <Article
      title="building a component registry"
      date="2026-05-24"
      tags={["next", "react", "tailwind"]}
      backHref="#"
      backLabel="back to articles"
    >
      <Prose>{BODY}</Prose>
    </Article>
  );
}
