import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "socials",
  type: "registry:ui",
  description:
    "row of social links from a links map — only supplied platforms render. tooltip on hover; the email entry copies to clipboard.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [{ source: "socials.tsx", target: "socials.tsx" }],
  props: [
    {
      name: "links",
      type: "Partial<Record<'github' | 'linkedin' | 'x' | 'email' | 'youtube' | 'instagram' | 'website', string>>",
      required: true,
      description: "platform to url (or bare email address for `email`); empty entries are skipped.",
    },
    { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'" },
    { name: "gap", type: "'tight' | 'normal' | 'loose'", default: "'normal'" },
  ],
});
