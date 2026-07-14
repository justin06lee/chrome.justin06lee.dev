import { Button } from "../../../../packages/registry/button/button";
import { Chrome } from "../../../../packages/registry/chrome/chrome";

export function Nav() {
  return (
    <nav aria-label="main navigation" className="flex items-center px-7 py-3.5 border-b border-white/10 text-[13px]">
      <Button
        variant="link"
        href="/"
        className="font-bold tracking-tight items-baseline hover:no-underline"
      >
        <Chrome className="italic font-serif">chrome</Chrome>
        <span className="ml-px font-mono text-white/35 not-italic">.justin06lee.dev</span>
      </Button>
      <div className="ml-auto flex items-center gap-[22px]">
        <Button
          variant="link"
          href="/docs"
          className="text-white/65 hover:text-white hover:no-underline"
        >
          docs
        </Button>
        <Button
          variant="link"
          href="/components"
          className="text-white/65 hover:text-white hover:no-underline"
        >
          components
        </Button>
        <Button
          variant="link"
          href="/examples"
          className="text-white/65 hover:text-white hover:no-underline"
        >
          examples
        </Button>
        {/* Points at the profile until the registry repo is public. */}
        <Button
          variant="link"
          href="https://github.com/justin06lee"
          className="text-white/65 hover:text-white hover:no-underline"
        >
          github
        </Button>
      </div>
    </nav>
  );
}
