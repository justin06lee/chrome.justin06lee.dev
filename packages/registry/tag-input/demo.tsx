"use client";

import * as React from "react";
import { TagInput } from "./tag-input";

export default function TagInputDemo() {
  const [tags, setTags] = React.useState<string[]>(["react", "typescript"]);

  return (
    <div className="w-full max-w-sm">
      <TagInput
        value={tags}
        onChange={setTags}
        suggestions={["next.js", "tailwind", "node", "postgres", "vite", "bun"]}
      />
    </div>
  );
}
