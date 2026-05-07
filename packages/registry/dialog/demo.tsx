"use client";
import { DialogProvider, useDialog } from "./dialog";

function Inner() {
  const { confirm } = useDialog();
  return (
    <button
      onClick={async () => {
        const ok = await confirm({ title: "delete this?", danger: true });
        console.log("user said:", ok);
      }}
      className="border border-white/40 px-3 py-1 text-xs hover:bg-white/10"
    >
      open dialog
    </button>
  );
}

export default function DialogDemo() {
  return (
    <DialogProvider>
      <Inner />
    </DialogProvider>
  );
}
