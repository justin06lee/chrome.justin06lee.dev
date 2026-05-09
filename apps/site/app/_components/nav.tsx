import Link from "next/link";
import { Chrome } from "../../../../packages/registry/chrome/chrome";

export function Nav() {
  return (
    <nav className="flex items-center px-7 py-3.5 border-b border-white/10 text-[13px]">
      <Link href="/" className="font-bold tracking-tight inline-flex items-baseline">
        <Chrome className="italic font-serif">chrome</Chrome>
        <span className="ml-px font-mono text-white/35 not-italic">.justin06lee.dev</span>
      </Link>
      <div className="ml-auto flex items-center gap-[22px] text-white/65">
        <Link href="/docs" className="hover:text-white">docs</Link>
        <Link href="/components" className="hover:text-white">components</Link>
        <Link href="/examples" className="hover:text-white">examples</Link>
        <a href="https://github.com/justin06lee/chrome.justin06lee.dev" className="hover:text-white">github</a>
      </div>
    </nav>
  );
}
