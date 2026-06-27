import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "socials",
  type: "registry:ui",
  description:
    "row of social links; pass a links map and only the platforms you supply render. white slide-up tooltip on hover/focus; the email entry copies the address to the clipboard (falls back to mailto). framework-agnostic plain anchors.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [{ source: "socials.tsx", target: "socials.tsx" }],
  props: [
    {
      name: "links",
      type: "Partial<Record<'github' | 'linkedin' | 'x' | 'email' | 'youtube' | 'instagram' | 'website', string>>",
      required: true,
      description: "platform → url (or bare email address for `email`); empty entries are skipped.",
    },
    { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'" },
    { name: "gap", type: "'tight' | 'normal' | 'loose'", default: "'normal'" },
  ],
});
