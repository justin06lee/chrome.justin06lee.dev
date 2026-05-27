"use client";

import { useState } from "react";
import { Combobox, type ComboboxOption } from "./combobox";

export default function ComboboxDemo() {
  const [opts, setOpts] = useState<ComboboxOption<string>[]>([
    { value: "deep-work", label: "deep work", color: "#6ee7b7" },
    { value: "reading", label: "reading", color: "#93c5fd" },
    { value: "sleep", label: "sleep", color: "#c4b5fd" },
  ]);
  const [value, setValue] = useState<string | null>("deep-work");

  return (
    <div className="w-56">
      <Combobox
        value={value}
        onChange={setValue}
        options={opts}
        allowClear
        ariaLabel="category"
        placeholder="No category"
        searchPlaceholder="Search categories…"
        onCreate={(q) => {
          const v = q.toLowerCase().replace(/\s+/g, "-") || `cat-${opts.length}`;
          setOpts((o) => [...o, { value: v, label: q || "new", color: "#ffffff" }]);
          setValue(v);
        }}
      />
    </div>
  );
}
