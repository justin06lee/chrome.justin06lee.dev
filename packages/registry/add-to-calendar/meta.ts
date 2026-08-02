import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "add-to-calendar",
  type: "registry:ui",
  description:
    "\"add to calendar\" for a confirmed booking: google, outlook, office 365 and yahoo as links, plus a generated .ics for everything else. the ics is built in-component (rfc 5545 folding and escaping included) so it works with no backend; icsHref overrides it when the server owns the canonical file. exports buildIcs and calendarUrl.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [{ source: "add-to-calendar.tsx", target: "add-to-calendar.tsx" }],
  props: [
    {
      name: "event",
      type: "CalendarEventInput",
      required: true,
      description: "{ title, start, end, description?, location?, url?, uid? } — start/end are epoch ms.",
    },
    {
      name: "targets",
      type: "CalendarTarget[]",
      default: "['google', 'outlook', 'office', 'ics']",
      description: "which destinations to offer, in order. 'yahoo' is also available.",
    },
    {
      name: "icsHref",
      type: "string",
      description:
        "serve the .ics from your own route instead of the generated blob — use it once an invite has been emailed and the uid has to match.",
    },
    { name: "filename", type: "string", default: "'invite.ics'" },
    { name: "label", type: "ReactNode", default: "'add to calendar'" },
    { name: "variant", type: "'menu' | 'inline'", default: "'menu'", description: "'inline' lays the targets out as a row of buttons." },
    { name: "className", type: "string" },
  ],
});
