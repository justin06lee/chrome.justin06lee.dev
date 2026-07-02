"use client";

import { useState } from "react";
import { EditorToolbar } from "./editor-toolbar";

export default function Demo() {
  const [mode, setMode] = useState("split");
  const [lastFormat, setLastFormat] = useState<string | null>(null);
  const [savedDrawings, setSavedDrawings] = useState(0);

  return (
    <div className="w-full border border-white/10 bg-white/[0.02]">
      <EditorToolbar
        title="getting started"
        subtitle="guides / getting-started"
        mode={mode}
        onModeChange={setMode}
        onFormat={(action) => setLastFormat(action.label)}
        status={lastFormat ? `inserted ${lastFormat.toLowerCase()}` : "save: cmd/ctrl+s"}
        enableDrawing
        onSaveDrawing={() => setSavedDrawings((n) => n + 1)}
        actions={
          <button
            type="button"
            className="bg-white px-4 py-1.5 text-sm font-medium text-black transition-colors hover:bg-white/90"
          >
            save
          </button>
        }
      />
      <div className="px-4 py-10 text-center text-sm text-white/40">
        mode: <span className="text-white/70">{mode}</span> · drawings saved:{" "}
        <span className="text-white/70">{savedDrawings}</span>
        <p className="mt-2 text-xs text-white/30">
          click “new drawing” to open windows — open several; each is numbered and can be
          dragged and brought to front.
        </p>
      </div>
    </div>
  );
}
