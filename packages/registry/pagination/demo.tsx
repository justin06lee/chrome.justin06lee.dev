"use client";

import { useState } from "react";
import { Pagination } from "./pagination";
import { Checkbox } from "../checkbox/checkbox";

export default function PaginationDemo() {
  const [page, setPage] = useState(1);
  const [compact, setCompact] = useState(false);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-5">
      <Checkbox
        label="compact"
        checked={compact}
        onChange={(e) => setCompact(e.target.checked)}
      />

      <Pagination page={page} pageCount={20} onChange={setPage} compact={compact} />

      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
        showing page {page} of 20
      </p>
    </div>
  );
}
