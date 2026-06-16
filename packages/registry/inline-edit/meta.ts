import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "inline-edit",
  type: "registry:ui",
  description:
    "blur-to-save editable field. holds a local draft, commits onblur and enter, shows a pending state, rolls back on error, escape cancels. behavior split into a headless useInlineEdit hook.",
  registryDependencies: ["utils"],
  files: [
    // Styled component first so the docs source view shows it (page reads files[0]).
    { source: "inline-edit.tsx", target: "inline-edit.tsx" },
    { source: "use-inline-edit.ts", target: "use-inline-edit.ts", type: "registry:hook" },
  ],
  props: [
    { name: "value", type: "string", description: "controlled source of truth, owned by the caller." },
    {
      name: "onCommit",
      type: "(next: string) => void | Promise<void>",
      description: "commit handler (onblur / enter). throw to roll back to the previous value.",
    },
    { name: "trim", type: "boolean", default: "true", description: "trim the draft before comparing / committing." },
  ],
});
