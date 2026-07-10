"use client";

import { Ascii } from "./ascii";
import { Chrome } from "../chrome/chrome";

export default function AsciiDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-12">
      <Ascii src="/ascii/ascii1.txt" label="ascii cat" />
      <Chrome as="div">
        <Ascii src="/ascii/ascii4.txt" label="chrome-foiled ascii cat" />
      </Chrome>
    </div>
  );
}
