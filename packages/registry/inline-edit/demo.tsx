"use client";

import { useState } from "react";
import { InlineEdit } from "./inline-edit";

export default function InlineEditDemo() {
  const [name, setName] = useState("untitled");
  const [locked] = useState("cannot change me");

  // Commits that update local state.
  async function commitName(next: string) {
    await new Promise((r) => setTimeout(r, 400));
    setName(next);
  }

  // Always rejects — the field should roll back to the previous value.
  async function commitLocked() {
    await new Promise((r) => setTimeout(r, 400));
    throw new Error("rejected");
  }

  return (
    <div className="flex w-full max-w-xs flex-col gap-4 p-4">
      <label className="flex flex-col gap-1">
        <span className="text-xs lowercase text-white/40">editable — saves</span>
        <InlineEdit value={name} onCommit={commitName} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs lowercase text-white/40">always fails — rolls back</span>
        <InlineEdit value={locked} onCommit={commitLocked} />
      </label>
    </div>
  );
}
