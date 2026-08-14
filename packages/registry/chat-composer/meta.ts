import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "chat-composer",
  type: "registry:ui",
  description:
    "the line you type into, under a chat-log. split from the log rather than bundled with it because the two have different reasons to re-render — the log repaints on every arriving message, the composer only on your own keystrokes — and because a read-only room is a real state: render the log without this and there is nothing to disable or explain. owns the draft and nothing else; onSend may be async, and a rejected send hands the sentence back rather than losing it, because losing a typed sentence to a dropped request is the one failure a chat box must not have.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [{ source: "chat-composer.tsx", target: "chat-composer.tsx" }],
  props: [
    {
      name: "onSend",
      type: "(body: string) => void | Promise<void>",
      required: true,
      description:
        "called with the trimmed draft. reject (or throw) and the draft is restored alongside an inline error.",
    },
    { name: "placeholder", type: "string", default: "'say something'" },
    {
      name: "maxLength",
      type: "number",
      default: "500",
      description:
        "hard input cap. a live count appears once the draft passes 80% of it.",
    },
    { name: "disabled", type: "boolean", default: "false" },
    {
      name: "disabledHint",
      type: "ReactNode",
      description:
        "explains the disabled state where the reader is looking — shown in place of the input when disabled.",
    },
    { name: "ariaLabel", type: "string", default: "'message'" },
    { name: "className", type: "string" },
  ],
});
