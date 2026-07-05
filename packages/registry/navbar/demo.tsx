"use client";

import { Navbar } from "./navbar";

export default function NavbarDemo() {
  return (
    // The real Navbar is position:fixed; the `relative` override (tailwind-merge
    // wins on the position utility) pins it inside this demo frame instead.
    <div className="relative h-32 w-full overflow-hidden border border-white/10">
      <Navbar
        className="relative"
        brand={<span className="text-sm text-white">justin06lee.dev</span>}
        links={[
          { label: "calendar", href: "#" },
          { label: "articles", href: "#" },
          { label: "gallery", href: "#" },
        ]}
      />
      <div className="flex h-full items-center justify-center text-xs text-white/40">
        resize narrow for the hamburger
      </div>
    </div>
  );
}
