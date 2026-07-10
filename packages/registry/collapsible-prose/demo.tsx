"use client";

import { CollapsibleProse } from "./collapsible-prose";
import { Prose } from "../prose/prose";

const MD = `a short intro paragraph renders flat, above the first collapsible
section. everything after a \`##\` heading folds into its own \`<details>\`.

## getting started

each section toggles independently. click a heading to collapse it.

- the chevron rotates on open
- ids are slugged for deep links

## how it works

content is split on every level-two heading. the body of each section is
handed to your \`renderMarkdown\` function — here, the \`prose\` component.

\`\`\`tsx
<CollapsibleProse renderMarkdown={(md) => <Prose>{md}</Prose>}>
  {markdown}
</CollapsibleProse>
\`\`\`

## notes

pure native \`<details>\` — no javascript state, deep-linkable headings.
`;

export default function CollapsibleProseDemo() {
  return (
    <div className="w-full max-w-xl text-left">
      <CollapsibleProse renderMarkdown={(md) => <Prose>{md}</Prose>}>
        {MD}
      </CollapsibleProse>
    </div>
  );
}
