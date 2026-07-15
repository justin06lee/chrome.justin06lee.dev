import { Kbd } from "./kbd";

export default function KbdDemo() {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-1.5">
        <Kbd>⌘</Kbd>
        <Kbd>k</Kbd>
        <span className="ml-2 text-sm text-white/50">open the palette</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Kbd size="md">⌥</Kbd>
        <Kbd size="md">opt</Kbd>
        <Kbd size="md">⇧</Kbd>
        <Kbd size="md">shift</Kbd>
        <Kbd size="md">esc</Kbd>
        <Kbd size="md">↵</Kbd>
      </div>
    </div>
  );
}
