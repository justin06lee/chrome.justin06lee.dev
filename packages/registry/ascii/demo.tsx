"use client";

import { Ascii } from "./ascii";
import { Chrome } from "../chrome/chrome";
import { CAT_ASCII } from "../not-found/cat-ascii";

export default function AsciiDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-12">
      <Ascii label="ascii cat">{CAT_ASCII[0] ?? ""}</Ascii>
      <Chrome as="div">
        <Ascii label="chrome-foiled ascii cat">{CAT_ASCII[3] ?? ""}</Ascii>
      </Chrome>
    </div>
  );
}
