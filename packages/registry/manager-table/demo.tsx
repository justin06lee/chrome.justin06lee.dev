"use client";

import * as React from "react";
import { DialogProvider } from "../dialog/dialog";
import { ManagerTable, type ManagerRow } from "./manager-table";

const INITIAL: ManagerRow[] = [
  { id: "1", name: "Deep Work", color: "#5b7a8a" },
  { id: "2", name: "Errands", color: "#7a6b5b" },
  { id: "3", name: "Reading", color: "#6b8a72" },
  { id: "4", name: "Archived Stuff", color: "#7a5b78", archived: true },
];

export default function ManagerTableDemo() {
  const [rows, setRows] = React.useState<ManagerRow[]>(INITIAL);

  return (
    <DialogProvider>
      <div className="w-full max-w-2xl">
        <ManagerTable
          rows={rows}
          onRename={(id, name) =>
            setRows((prev) => prev.map((r) => (r.id === id ? { ...r, name } : r)))
          }
          onRecolor={(id, color) =>
            setRows((prev) => prev.map((r) => (r.id === id ? { ...r, color } : r)))
          }
          onArchive={(id, archived) =>
            setRows((prev) => prev.map((r) => (r.id === id ? { ...r, archived } : r)))
          }
          onDelete={(id) => setRows((prev) => prev.filter((r) => r.id !== id))}
        />
      </div>
    </DialogProvider>
  );
}
