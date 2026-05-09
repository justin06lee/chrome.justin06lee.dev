import { CopyButton } from "./copy-button";

export default function CopyButtonDemo() {
  return (
    <div className="flex items-center gap-3 border border-white/10 px-4 py-3 bg-white/[0.02]">
      <code className="font-mono text-[13px]">bunx @justin06lee/chrome@latest init</code>
      <CopyButton
        text="bunx @justin06lee/chrome@latest init"
        className="border-l border-white/15 pl-3"
      />
    </div>
  );
}
