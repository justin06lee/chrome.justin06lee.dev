import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "card",
  type: "registry:ui",
  description:
    "compositional bordered card: Card shell plus CardHeader / CardTitle / CardMeta / CardBody / CardActions slots.",
  registryDependencies: ["utils"],
  files: [{ source: "card.tsx", target: "card.tsx" }],
  props: [
    { name: "Card.background", type: "string", description: "CSS background on the shell. transparent by default." },
    { name: "CardTitle.href", type: "string", description: "renders the title as a link; external URLs open in a new tab." },
    { name: "className", type: "string", description: "available on every slot for overrides." },
  ],
});
