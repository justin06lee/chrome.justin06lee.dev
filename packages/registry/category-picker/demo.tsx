"use client";

import { useState } from "react";
import { CategoryPicker, type CategoryItem } from "./category-picker";

const PALETTE = ["#5b7a8a", "#7a6b5b", "#6b8a72", "#7a5b78", "#8a7a5b"];

export default function CategoryPickerDemo() {
  const [items, setItems] = useState<CategoryItem[]>([
    { id: "deep-work", label: "deep work", color: "#5b7a8a" },
    { id: "reading", label: "reading", color: "#6b8a72" },
    { id: "sleep", label: "sleep", color: "#5b5b8a" },
  ]);
  const [value, setValue] = useState<string | null>("deep-work");

  return (
    <div className="w-56">
      <CategoryPicker
        value={value}
        onChange={setValue}
        items={items}
        ariaLabel="category"
        allowClear
        onCreate={(label) => {
          const id = label.toLowerCase().replace(/\s+/g, "-") || `cat-${items.length}`;
          const color = PALETTE[items.length % PALETTE.length]!;
          setItems((prev) => [...prev, { id, label: label || "new", color }]);
          setValue(id);
        }}
      />
    </div>
  );
}
