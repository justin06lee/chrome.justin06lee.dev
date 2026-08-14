import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "chat-log",
  type: "registry:ui",
  description:
    "an append-only stream of messages that follows the newest one — unless the reader has scrolled up to read something, in which case it holds still and offers a jump back. track-list and article-list render a collection that happens to be ordered; this is a *stream*, and its whole contract is what happens when content arrives while you're looking at it, which is a behaviour neither of those has and neither should grow. groups consecutive messages from one sender, marks the viewer's own, and announces additions via role=log.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [{ source: "chat-log.tsx", target: "chat-log.tsx" }],
  props: [
    {
      name: "messages",
      type: "ChatMessage[]",
      required: true,
      description:
        "id, name, body, createdAt (epoch ms), and an optional mine flag that emphasises the viewer's own messages.",
    },
    {
      name: "empty",
      type: "ReactNode",
      description: "shown in place of the list when there is nothing yet.",
    },
    {
      name: "groupWithinMs",
      type: "number",
      default: "120000",
      description:
        "consecutive messages from one person inside this window share a single name line. 0 disables grouping.",
    },
    { name: "ariaLabel", type: "string", default: "'chat'" },
    { name: "className", type: "string" },
  ],
});
