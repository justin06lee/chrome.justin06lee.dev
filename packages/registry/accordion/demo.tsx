import { Accordion, AccordionItem } from "./accordion";

export default function AccordionDemo() {
  return (
    <div className="w-full max-w-md">
      <Accordion>
        <AccordionItem title="what is this?" name="demo" defaultOpen>
          a collapsible row built on native &lt;details&gt; — no javascript state.
        </AccordionItem>
        <AccordionItem title="how does exclusivity work?" name="demo">
          siblings sharing a name auto-close each other, browser-handled.
        </AccordionItem>
        <AccordionItem title="can i nest content?" name="demo">
          yes — any children render in the open panel.
        </AccordionItem>
      </Accordion>
    </div>
  );
}
