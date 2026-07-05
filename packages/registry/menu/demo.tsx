"use client";

import { useState } from "react";
import { ListFilter } from "lucide-react";
import { Menu } from "./menu";

type Sort = "newest" | "oldest" | "az" | "za";
const LABELS: Record<Sort, string> = {
  newest: "Newest",
  oldest: "Oldest",
  az: "A–Z",
  za: "Z–A",
};

export default function MenuDemo() {
  const [sort, setSort] = useState<Sort>("newest");
  return (
    <Menu
      trigger={
        <>
          <ListFilter className="size-4" />
          <span>Sort: {LABELS[sort]}</span>
        </>
      }
      label="Sort by"
      items={(Object.keys(LABELS) as Sort[]).map((k) => ({
        label: LABELS[k],
        selected: sort === k,
        onSelect: () => setSort(k),
      }))}
    />
  );
}
