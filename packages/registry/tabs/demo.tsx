"use client";

import { useState } from "react";
import { Tabs } from "./tabs";

type Tab = "projects" | "hobbies" | "in-development";

const COPY: Record<Tab, string> = {
  projects: "things i've shipped.",
  hobbies: "things i do for fun.",
  "in-development": "things still cooking.",
};

export default function TabsDemo() {
  const [tab, setTab] = useState<Tab>("projects");
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Tabs
        value={tab}
        onValueChange={setTab}
        items={[
          { value: "projects", label: "projects" },
          { value: "hobbies", label: "hobbies" },
          { value: "in-development", label: "in development" },
        ]}
      />
      <div role="tabpanel" className="text-sm text-white/70">
        {COPY[tab]}
      </div>
    </div>
  );
}
