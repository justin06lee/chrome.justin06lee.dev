import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "docket",
  type: "registry:ui",
  description:
    "work order / docket — mono header with a reference, label-value rows, a slot for a stamp, and an optional tear-off stub below a perforation. detail-list renders the same pairs, but a docket is the document around them: numbered, marked, and torn. the notches are opaque circles in the page colour rather than a mask, because masking the card to cut real holes also masks the border.",
  registryDependencies: ["utils"],
  files: [{ source: "docket.tsx", target: "docket.tsx" }],
  props: [
    { name: "reference", type: "ReactNode", description: "printed in the header, e.g. 'OJ-0042'. set in mono." },
    { name: "kind", type: "ReactNode", description: "small caps line opposite the reference — the document's kind." },
    { name: "mark", type: "ReactNode", description: "top-right slot in the body; a Stamp is the intended occupant." },
    { name: "title", type: "ReactNode" },
    { name: "rows", type: "DocketRow[]", description: "{ label, value }[] rendered as a real <dl>." },
    { name: "children", type: "ReactNode", description: "body content under the rows." },
    { name: "stub", type: "ReactNode", description: "content below the perforation; omit and no tear edge is drawn." },
    {
      name: "notchColor",
      type: "string",
      default: "'#000000'",
      description: "colour showing through the notches — has to match whatever the docket sits on.",
    },
    { name: "className", type: "string" },
  ],
});
