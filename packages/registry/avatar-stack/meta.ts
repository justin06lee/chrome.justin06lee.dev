import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "avatar-stack",
  type: "registry:ui",
  description:
    "overlapping square tiles for \"who else is here\" — initials when there's no image, a name pill on hover, and an overflow counter as the last tile rather than a line of text. pass total when people is a fetched slice and it counts the ones you never loaded. pfp is the single 3d-tilt portrait; this is the crowd.",
  dependencies: [],
  registryDependencies: ["utils", "tooltip"],
  files: [{ source: "avatar-stack.tsx", target: "avatar-stack.tsx" }],
  props: [
    { name: "people", type: "Person[]", required: true, description: "{ id, name, src?, href? }[]" },
    { name: "max", type: "number", default: "5", description: "how many tiles before the overflow counter." },
    { name: "total", type: "number", description: "true headcount when people is only a slice." },
    { name: "size", type: "'xs' | 'sm' | 'md'", default: "'sm'" },
    { name: "tooltip", type: "boolean", default: "true", description: "name pill on hover and keyboard focus." },
    { name: "onSelect", type: "(person: Person) => void" },
    { name: "linkComponent", type: "React.ElementType", description: "anchor component for internal hrefs (e.g. next/link)." },
    { name: "ariaLabel", type: "string", description: "screen-reader summary. defaults to 'N people'." },
    { name: "className", type: "string" },
  ],
});
