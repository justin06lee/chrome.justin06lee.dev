"use client";
import { useState } from "react";
import Select from "./select";

export default function SelectDemo() {
  const [v, setV] = useState<"a" | "b" | "c">("a");
  return (
    <div className="w-48">
      <Select
        value={v}
        onChange={setV}
        options={[
          { value: "a", label: "alpha" },
          { value: "b", label: "beta" },
          { value: "c", label: "gamma" },
        ]}
        ariaLabel="demo"
      />
    </div>
  );
}
