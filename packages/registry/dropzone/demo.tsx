"use client";

import { useState } from "react";
import { Dropzone, type DropzoneFile, type DropzoneRejection } from "./dropzone";
import { Callout } from "../callout/callout";

const MAX_SIZE = 5 * 1024 * 1024;

const REASONS: Record<DropzoneRejection["reason"], string> = {
  type: "wrong format",
  size: "over 5 mb",
  count: "too many files",
};

export default function DropzoneDemo() {
  const [files, setFiles] = useState<DropzoneFile[]>([
    { id: "seed", name: "brief-v2.pdf", size: 284_100 },
  ]);
  const [problem, setProblem] = useState<string | null>(null);

  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Dropzone
        accept=".pdf,.md,.txt,image/*"
        maxSize={MAX_SIZE}
        maxFiles={4}
        hint="pdf, markdown, text or images — up to 5 mb each"
        files={files}
        onRemove={(id) => setFiles((current) => current.filter((f) => f.id !== id))}
        onFiles={(dropped) => {
          setProblem(null);
          setFiles((current) => [
            ...current,
            ...dropped.map((file) => ({
              id: `${file.name}-${file.size}`,
              name: file.name,
              size: file.size,
            })),
          ]);
        }}
        onReject={(rejections) =>
          setProblem(
            rejections
              .map((r) => `${r.file.name}: ${REASONS[r.reason]}`)
              .join(", "),
          )
        }
      />

      {problem ? (
        <Callout variant="danger" title="not accepted">
          {problem}
        </Callout>
      ) : null}
    </div>
  );
}
