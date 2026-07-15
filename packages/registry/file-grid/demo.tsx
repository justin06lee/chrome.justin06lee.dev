"use client";

import { useState } from "react";
import { FileGrid, type FileGridFile } from "./file-grid";

const FILES: FileGridFile[] = [
  { id: "1", name: "quarterly-report.pdf", meta: "pdf · 1.2 mb", href: "#" },
  { id: "2", name: "system-diagram.png", meta: "png · 340 kb", href: "#" },
  { id: "3", name: "field-notes.md", meta: "md · 8 kb", href: "#" },
];

export default function FileGridDemo() {
  const [files, setFiles] = useState(FILES);
  return (
    <FileGrid
      files={files}
      onDelete={async (file) => {
        // fake api latency so the pending state is visible
        await new Promise((resolve) => setTimeout(resolve, 600));
        setFiles((prev) => prev.filter((f) => f.id !== file.id));
      }}
    />
  );
}
