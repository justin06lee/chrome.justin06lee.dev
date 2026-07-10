"use client";

import { useState, type ReactNode } from "react";
import { ArrowRight, Copy, Github, ListFilter, Menu as MenuIcon } from "lucide-react";
import { Button } from "../../../../../packages/registry/button/button";
import {
  Accordion,
  AccordionItem,
} from "../../../../../packages/registry/accordion/accordion";
import { Article } from "../../../../../packages/registry/article/article";
import { Badge } from "../../../../../packages/registry/badge/badge";
import { Calendar } from "../../../../../packages/registry/calendar/calendar";
import { Heatmap } from "../../../../../packages/registry/heatmap/heatmap";
import { Timeline } from "../../../../../packages/registry/timeline/timeline";
import { Combobox, type ComboboxOption } from "../../../../../packages/registry/combobox/combobox";
import {
  Card,
  CardHeader,
  CardTitle,
  CardMeta,
  CardBody,
  CardActions,
} from "../../../../../packages/registry/card/card";
import { Chrome } from "../../../../../packages/registry/chrome/chrome";
import { CopyButton } from "../../../../../packages/registry/copy-button/copy-button";
import { DialogProvider, useDialog } from "../../../../../packages/registry/dialog/dialog";
import { Donut } from "../../../../../packages/registry/donut/donut";
import { Input } from "../../../../../packages/registry/input/input";
import { Menu } from "../../../../../packages/registry/menu/menu";
import { Navbar } from "../../../../../packages/registry/navbar/navbar";
import { Prose } from "../../../../../packages/registry/prose/prose";
import { Rainbow } from "../../../../../packages/registry/rainbow/rainbow";
import { Range } from "../../../../../packages/registry/range/range";
import { Scramble } from "../../../../../packages/registry/scramble/scramble";
import { Segmented } from "../../../../../packages/registry/segmented/segmented";
import Select from "../../../../../packages/registry/select/select";
import { Showcase } from "../../../../../packages/registry/showcase/showcase";
import { Stack } from "../../../../../packages/registry/stack/stack";
import { Tabs } from "../../../../../packages/registry/tabs/tabs";
import { Textarea } from "../../../../../packages/registry/textarea/textarea";
import { Tilt } from "../../../../../packages/registry/tilt/tilt";
import { Toc, type TocHeading } from "../../../../../packages/registry/toc/toc";
import { Tooltip } from "../../../../../packages/registry/tooltip/tooltip";

/** One usage example: a label, the code to copy, and a live render of it. */
export type UsageExample = {
  label: string;
  code: string;
  render: ReactNode;
};

// --- stateful examples need their own little wrapper components ------------

function SelectExample() {
  const [value, setValue] = useState<"a" | "b" | "c">("a");
  return (
    <div className="w-44">
      <Select
        value={value}
        onChange={setValue}
        ariaLabel="example"
        options={[
          { value: "a", label: "alpha" },
          { value: "b", label: "beta" },
          { value: "c", label: "gamma" },
        ]}
      />
    </div>
  );
}

function DialogTrigger() {
  const { confirm } = useDialog();
  return (
    <Button variant="outline" onClick={() => confirm({ title: "delete this?", danger: true })}>
      open dialog
    </Button>
  );
}

function DialogExample() {
  return (
    <DialogProvider>
      <DialogTrigger />
    </DialogProvider>
  );
}

function CalendarExample() {
  const [month, setMonth] = useState("2026-05");
  const [selected, setSelected] = useState<string | null>("2026-05-24");
  return (
    <Calendar
      month={month}
      onMonthChange={setMonth}
      selected={selected}
      onSelect={setSelected}
      today="2026-05-24"
    />
  );
}

function heatmapValues(year: number): Record<string, number> {
  const out: Record<string, number> = {};
  for (let m = 1; m <= 12; m++) {
    const last = new Date(Date.UTC(year, m, 0)).getUTCDate();
    for (let d = 1; d <= last; d++) {
      const seed = (m * 31 + d * 17) % 11;
      out[`${year}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`] =
        seed < 4 ? 0 : (seed - 3) * 25;
    }
  }
  return out;
}

function ComboboxExample() {
  const [opts, setOpts] = useState<ComboboxOption<string>[]>([
    { value: "deep-work", label: "deep work", color: "#6ee7b7" },
    { value: "reading", label: "reading", color: "#93c5fd" },
  ]);
  const [value, setValue] = useState<string | null>("deep-work");
  return (
    <div className="w-52">
      <Combobox
        value={value}
        onChange={setValue}
        options={opts}
        allowClear
        placeholder="No category"
        onCreate={(q) => {
          const v = q.toLowerCase().replace(/\s+/g, "-") || `c${opts.length}`;
          setOpts((o) => [...o, { value: v, label: q || "new", color: "#fff" }]);
          setValue(v);
        }}
      />
    </div>
  );
}

function SegmentedExample() {
  const [v, setV] = useState<"day" | "month" | "year">("day");
  return (
    <Segmented
      value={v}
      onChange={setV}
      options={[
        { value: "day", label: "day" },
        { value: "month", label: "month" },
        { value: "year", label: "year" },
      ]}
    />
  );
}

function SegmentedCompactExample() {
  const [mode, setMode] = useState<"now" | "backfill">("now");
  return (
    <Segmented
      size="compact"
      value={mode}
      onChange={setMode}
      options={[
        { value: "now", label: "Now" },
        { value: "backfill", label: "Backfill" },
      ]}
    />
  );
}

function TextareaExample() {
  const [v, setV] = useState("");
  return (
    <Textarea
      className="w-64"
      placeholder="write something…"
      value={v}
      onChange={(e) => setV(e.target.value)}
    />
  );
}

function RangeExample() {
  const [v, setV] = useState(40);
  return (
    <div className="flex w-56 flex-col gap-2">
      <Range value={v} onChange={setV} ariaLabel="example" />
      <div className="text-center font-mono text-xs text-white/50">{v}</div>
    </div>
  );
}

function RangeSteppedExample() {
  const [v, setV] = useState(4);
  return (
    <div className="flex w-56 flex-col gap-2">
      <Range value={v} onChange={setV} min={0} max={10} step={2} ariaLabel="stepped example" />
      <div className="text-center font-mono text-xs text-white/50">{v}</div>
    </div>
  );
}

function MenuExample() {
  const opts = ["Newest", "Oldest", "A–Z", "Z–A"];
  const [sel, setSel] = useState("Newest");
  return (
    <Menu
      trigger={
        <>
          <ListFilter className="size-4" />
          <span>Sort: {sel}</span>
        </>
      }
      label="Sort by"
      items={opts.map((o) => ({ label: o, selected: sel === o, onSelect: () => setSel(o) }))}
    />
  );
}

function TabsExample() {
  const [tab, setTab] = useState<"projects" | "hobbies" | "in-dev">("projects");
  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      items={[
        { value: "projects", label: "projects" },
        { value: "hobbies", label: "hobbies" },
        { value: "in-dev", label: "in development" },
      ]}
    />
  );
}

function BadgeFilterExample() {
  const tags = ["react", "next", "tailwind"];
  const [on, setOn] = useState<string[]>(["react"]);
  const toggle = (t: string) =>
    setOn((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <Badge key={t} variant="ghost" active={on.includes(t)} onClick={() => toggle(t)}>
          {t}
        </Badge>
      ))}
    </div>
  );
}

function StackCard({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-2">
        <div className="h-px w-full bg-white/15" />
        <div className="h-px w-2/3 bg-white/15" />
      </div>
      <p className="text-sm font-medium text-white">{children}</p>
    </div>
  );
}


function DialogPlainTrigger() {
  const { confirm } = useDialog();
  return (
    <Button
      variant="outline"
      onClick={() => confirm({ title: "publish article?", message: "it goes live immediately." })}
    >
      open dialog
    </Button>
  );
}

function DialogPlainExample() {
  return (
    <DialogProvider>
      <DialogPlainTrigger />
    </DialogProvider>
  );
}

function HeatmapClickExample() {
  const [day, setDay] = useState<string | null>(null);
  return (
    <div className="w-full space-y-2">
      <Heatmap values={heatmapValues(2026)} year={2026} levels={3} onSelectDay={setDay} />
      <div className="font-mono text-[11px] text-white/45">{day ? `selected: ${day}` : "click a day"}</div>
    </div>
  );
}

function ComboboxPlainExample() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <div className="w-52">
      <Combobox
        value={value}
        onChange={setValue}
        placeholder="pick one"
        options={[
          { value: "a", label: "alpha" },
          { value: "b", label: "beta" },
        ]}
      />
    </div>
  );
}

/** Self-contained toc demo: real sections with the listed ids live in a
 *  scrollable mini page next to the toc, so scroll-spy and anchors work. */
function TocExample({ label, headings }: { label?: string; headings: TocHeading[] }) {
  return (
    <div className="flex w-full max-w-md gap-8 text-left">
      <Toc label={label} headings={headings} className="!static w-32 shrink-0" />
      <div className="h-44 flex-1 overflow-y-auto border border-white/10 bg-white/[0.01] px-4">
        {headings.map((h) => (
          <section key={h.id} id={h.id} className="min-h-36 scroll-mt-2 py-4">
            <h4 className="mb-1 text-sm text-white">{h.text}</h4>
            <p className="text-xs leading-5 text-white/40">
              scroll or click a toc link — the active row follows this section.
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}

const bannerSvg =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="160"><rect width="640" height="160" fill="#1a1a1a"/><text x="320" y="88" font-family="monospace" font-size="18" fill="#555" text-anchor="middle">banner.png</text></svg>',
  );

// --- the example table -----------------------------------------------------

export const BASE_EXAMPLES: Record<string, UsageExample[]> = {
  button: [
    {
      label: "Variants",
      code: '<Button variant="solid">solid</Button>\n<Button variant="outline">outline</Button>\n<Button variant="ghost">ghost</Button>\n<Button variant="dashed">dashed</Button>',
      render: (
        <div className="flex flex-wrap gap-3">
          <Button variant="solid">solid</Button>
          <Button variant="outline">outline</Button>
          <Button variant="ghost">ghost</Button>
          <Button variant="dashed">dashed</Button>
        </div>
      ),
    },
    {
      label: "With icon",
      code: '<Button icon={Menu}>menu</Button>\n<Button icon={Github} label="GitHub" />',
      render: (
        <div className="flex flex-wrap gap-3">
          <Button icon={MenuIcon}>menu</Button>
          <Button icon={Github} label="GitHub" />
        </div>
      ),
    },
    {
      label: "As link",
      code: '<Button href="https://github.com" variant="solid" iconRight={ArrowRight}>\n  visit github\n</Button>',
      render: (
        <Button href="https://github.com" variant="solid" iconRight={ArrowRight}>
          visit github
        </Button>
      ),
    },
    {
      label: "Copy to clipboard",
      code: '<Button icon={Copy} copy="hi@example.com" copyFeedback="copied!">\n  copy email\n</Button>',
      render: (
        <Button icon={Copy} copy="hi@example.com" copyFeedback="copied!">
          copy email
        </Button>
      ),
    },
  ],
  chrome: [
    {
      label: "Basic",
      code: "<Chrome>chrome.</Chrome>",
      render: <Chrome className="text-3xl font-bold">chrome.</Chrome>,
    },
    {
      label: "As a heading",
      code: '<Chrome as="h2" className="text-4xl font-bold italic font-serif">\n  title\n</Chrome>',
      render: (
        <Chrome as="h2" className="text-4xl font-bold italic font-serif">
          title
        </Chrome>
      ),
    },
    {
      label: "Wraps nested text",
      code: "<Chrome>\n  plain <strong>and bold</strong> text\n</Chrome>",
      render: (
        <Chrome className="text-2xl">
          plain <strong>and bold</strong> text
        </Chrome>
      ),
    },
  ],
  "copy-button": [
    {
      label: "Basic",
      code: '<CopyButton text="bunx @justin06lee/chrome init" />',
      render: <CopyButton text="bunx @justin06lee/chrome init" />,
    },
    {
      label: "Custom labels",
      code: '<CopyButton\n  text="value"\n  labels={{ idle: "grab", copied: "got it", error: "nope" }}\n/>',
      render: (
        <CopyButton text="value" labels={{ idle: "grab", copied: "got it", error: "nope" }} />
      ),
    },
  ],
  dialog: [
    {
      label: "Promise-based confirm",
      code:
        "const { confirm } = useDialog();\n\n" +
        "const ok = await confirm({\n  title: \"delete this?\",\n  danger: true,\n});",
      render: <DialogExample />,
    },
    {
      label: "With message",
      code:
        "const ok = await confirm({\n" +
        '  title: "publish article?",\n  message: "it goes live immediately.",\n});',
      render: <DialogPlainExample />,
    },
  ],
  donut: [
    {
      label: "Basic",
      code: "<Donut />",
      render: <Donut width={40} height={20} />,
    },
    {
      label: "Custom size & speed",
      code: "<Donut width={48} height={22} speed={1.6} />",
      render: <Donut width={48} height={22} speed={1.6} />,
    },
    {
      label: "Chrome ascii",
      code: "<Chrome as=\"div\">\n  {/* isolate={false} lets the chrome foil paint through */}\n  <Donut width={48} height={22} isolate={false} />\n</Chrome>",
      render: (
        <Chrome as="div">
          <Donut width={48} height={22} isolate={false} />
        </Chrome>
      ),
    },
  ],
  input: [
    {
      label: "Basic",
      code: '<Input placeholder="type something..." />',
      render: <Input placeholder="type something..." className="w-56" />,
    },
    {
      label: "Disabled",
      code: '<Input placeholder="locked" disabled />',
      render: <Input placeholder="locked" disabled className="w-56" />,
    },
  ],
  rainbow: [
    {
      label: "Basic",
      code: "<Rainbow>rainbow text</Rainbow>",
      render: <Rainbow className="text-2xl font-mono">rainbow text</Rainbow>,
    },
    {
      label: "Faster cycle",
      code: "<Rainbow duration={1.5} stagger={0.1}>fast</Rainbow>",
      render: (
        <Rainbow duration={1.5} stagger={0.1} className="text-2xl font-mono">
          fast
        </Rainbow>
      ),
    },
  ],
  scramble: [
    {
      label: "Basic",
      code: "<Scramble>hover to scramble</Scramble>",
      render: <Scramble as="div" className="font-mono text-xl">hover to scramble</Scramble>,
    },
    {
      label: "Slower frames",
      code: "<Scramble speed={70}>slow scramble</Scramble>",
      render: (
        <Scramble as="div" speed={70} className="font-mono text-xl">
          slow scramble
        </Scramble>
      ),
    },
  ],
  select: [
    {
      label: "Controlled",
      code:
        "const [value, setValue] = useState(\"a\");\n\n" +
        "<Select\n  value={value}\n  onChange={setValue}\n  options={[\n" +
        "    { value: \"a\", label: \"alpha\" },\n    { value: \"b\", label: \"beta\" },\n  ]}\n/>",
      render: <SelectExample />,
    },
  ],
  showcase: [
    {
      label: "Background variants",
      code: '<Showcase background="grid">\n  {children}\n</Showcase>',
      render: (
        <Showcase background="grid" className="w-full">
          <span className="text-sm text-white/60">framed content</span>
        </Showcase>
      ),
    },
    {
      label: "Label, source & note",
      code:
        '<Showcase label="button" source="button.tsx" note="hover for the tooltip">\n  {children}\n</Showcase>',
      render: (
        <Showcase label="button" source="button.tsx" note="hover for the tooltip" className="w-full">
          <span className="text-sm text-white/60">framed content</span>
        </Showcase>
      ),
    },
  ],
  stack: [
    {
      label: "Basic",
      code: "<Stack>\n  {/* front card content */}\n</Stack>",
      render: (
        <Stack>
          <StackCard>stacked paper card</StackCard>
        </Stack>
      ),
    },
    {
      label: "More layers",
      code: "<Stack layers={3}>\n  {/* front card content */}\n</Stack>",
      render: (
        <Stack layers={3}>
          <StackCard>three layers</StackCard>
        </Stack>
      ),
    },
  ],
  tilt: [
    {
      label: "Basic",
      code: '<Tilt className="size-32">\n  {children}\n</Tilt>',
      render: (
        <Tilt className="size-32 flex items-center justify-center">
          <span className="font-mono text-xs uppercase tracking-widest text-white/60">
            hover
          </span>
        </Tilt>
      ),
    },
    {
      label: "Steeper, no shine",
      code: '<Tilt rotate={22} shine={false} className="size-32">\n  {children}\n</Tilt>',
      render: (
        <Tilt rotate={22} shine={false} className="size-32 flex items-center justify-center">
          <span className="font-mono text-xs uppercase tracking-widest text-white/60">
            hover
          </span>
        </Tilt>
      ),
    },
  ],
  card: [
    {
      label: "Full card",
      code:
        "<Card>\n" +
        "  <CardHeader>\n" +
        '    <CardTitle href="https://example.com">chrome registry</CardTitle>\n' +
        "    <CardMeta>2026</CardMeta>\n" +
        "  </CardHeader>\n" +
        "  <CardBody>own-the-code components.</CardBody>\n" +
        "  <CardActions>\n" +
        '    <a href="#" className="text-sm underline-offset-4 hover:underline">view code</a>\n' +
        "  </CardActions>\n" +
        "</Card>",
      render: (
        <Card className="w-64">
          <CardHeader>
            <CardTitle href="https://example.com">chrome registry</CardTitle>
            <CardMeta>2026</CardMeta>
          </CardHeader>
          <CardBody>own-the-code components.</CardBody>
          <CardActions>
            <a href="#" className="text-sm underline-offset-4 hover:underline">
              view code
            </a>
          </CardActions>
        </Card>
      ),
    },
    {
      label: "Title + body only",
      code:
        "<Card>\n" +
        "  <CardTitle>just the essentials</CardTitle>\n" +
        "  <CardBody>drop the slots you don't need.</CardBody>\n" +
        "</Card>",
      render: (
        <Card className="w-64">
          <CardTitle>just the essentials</CardTitle>
          <CardBody>drop the slots you don&apos;t need.</CardBody>
        </Card>
      ),
    },
  ],
  tabs: [
    {
      label: "Controlled",
      code:
        'const [tab, setTab] = useState("projects");\n\n' +
        "<Tabs\n  value={tab}\n  onValueChange={setTab}\n  items={[\n" +
        '    { value: "projects", label: "projects" },\n' +
        '    { value: "hobbies", label: "hobbies" },\n' +
        "  ]}\n/>",
      render: <TabsExample />,
    },
  ],
  navbar: [
    {
      label: "Brand + links",
      code:
        "<Navbar\n" +
        '  brand={<span className="text-sm">justin06lee.dev</span>}\n' +
        "  links={[\n" +
        '    { label: "calendar", href: "/calendar" },\n' +
        '    { label: "articles", href: "/articles" },\n' +
        "  ]}\n/>",
      render: (
        // Real Navbar is fixed; `relative` (tailwind-merge wins) pins it to this cell.
        <div className="relative h-24 w-full overflow-hidden border border-white/10">
          <Navbar
            className="relative"
            brand={<span className="text-sm text-white">justin06lee.dev</span>}
            links={[
              { label: "calendar", href: "#" },
              { label: "articles", href: "#" },
              { label: "gallery", href: "#" },
            ]}
          />
        </div>
      ),
    },
  ],
  badge: [
    {
      label: "Variants",
      code:
        "<Badge>outline</Badge>\n" +
        '<Badge variant="solid">solid</Badge>\n' +
        '<Badge variant="ghost">ghost</Badge>',
      render: (
        <div className="flex flex-wrap gap-2">
          <Badge>outline</Badge>
          <Badge variant="solid">solid</Badge>
          <Badge variant="ghost">ghost</Badge>
        </div>
      ),
    },
    {
      label: "Filter chips",
      code:
        'const [on, setOn] = useState(["react"]);\n\n' +
        "<Badge\n  variant=\"ghost\"\n  active={on.includes(t)}\n  onClick={() => toggle(t)}\n>\n  {t}\n</Badge>",
      render: <BadgeFilterExample />,
    },
  ],
  tooltip: [
    {
      label: "On hover / focus",
      code:
        '<Tooltip label="slides up">\n' +
        '  <button aria-label="action">hover me</button>\n' +
        "</Tooltip>",
      render: (
        <Tooltip label="slides up">
          <button
            type="button"
            aria-label="action"
            className="border border-white/20 px-3 py-1.5 text-sm hover:bg-white/5"
          >
            hover me
          </button>
        </Tooltip>
      ),
    },
    {
      label: "Bottom side",
      code:
        '<Tooltip label="slides down" side="bottom">\n' +
        '  <button aria-label="action">below</button>\n' +
        "</Tooltip>",
      render: (
        <Tooltip label="slides down" side="bottom">
          <button
            type="button"
            aria-label="action"
            className="border border-white/20 px-3 py-1.5 text-sm hover:bg-white/5"
          >
            below
          </button>
        </Tooltip>
      ),
    },
  ],
  textarea: [
    {
      label: "Basic",
      code: '<Textarea placeholder="write something…" rows={4} />',
      render: <TextareaExample />,
    },
    {
      label: "Rows & background",
      code: '<Textarea rows={2} background="rgba(255,255,255,0.04)"\n  placeholder="two rows, tinted" />',
      render: (
        <Textarea
          rows={2}
          background="rgba(255,255,255,0.04)"
          placeholder="two rows, tinted"
          className="w-64"
        />
      ),
    },
  ],
  calendar: [
    {
      label: "Date picker",
      code:
        'const [month, setMonth] = useState("2026-05");\n' +
        "const [selected, setSelected] = useState(null);\n\n" +
        "<Calendar\n  month={month}\n  onMonthChange={setMonth}\n  selected={selected}\n  onSelect={setSelected}\n  today={todayISO}\n/>",
      render: <CalendarExample />,
    },
    {
      label: "renderDay dots",
      code:
        '<Calendar\n  month="2026-05"\n  today="2026-05-24"\n  renderDay={(date) =>\n' +
        '    events[date] ? <Dot /> : null\n  }\n/>',
      render: (
        <Calendar
          month="2026-05"
          today="2026-05-24"
          renderDay={(date) =>
            ["2026-05-06", "2026-05-14", "2026-05-24"].includes(date) ? (
              <span className="mx-auto mt-0.5 block size-1 rounded-full bg-white/70" />
            ) : null
          }
        />
      ),
    },
  ],
  heatmap: [
    {
      label: "Year activity",
      code:
        "<Heatmap\n  values={byDay}  // { '2026-05-24': 120, … }\n  year={2026}\n  today={todayISO}\n/>",
      render: (
        <div className="w-full">
          <Heatmap values={heatmapValues(2026)} year={2026} today="2026-05-24" />
        </div>
      ),
    },
    {
      label: "Clickable days",
      code: "<Heatmap\n  values={byDay}\n  year={2026}\n  levels={3}\n  onSelectDay={(date) => setDay(date)}\n/>",
      render: <HeatmapClickExample />,
    },
  ],
  timeline: [
    {
      label: "Day schedule",
      code:
        "<Timeline\n  showNow\n  events={[\n" +
        '    { startMin: 480, endMin: 570, label: "deep work", color: "#6ee7b7" },\n' +
        '    { startMin: 780, endMin: 870, label: "reading", color: "#c4b5fd" },\n' +
        "  ]}\n/>",
      render: (
        <div className="h-[360px] w-full max-w-md overflow-y-auto">
          <Timeline
            showNow
            events={[
              { startMin: 8 * 60, endMin: 9 * 60 + 30, label: "deep work", color: "#6ee7b7" },
              { startMin: 13 * 60, endMin: 14 * 60 + 30, label: "reading", color: "#c4b5fd" },
            ]}
          />
        </div>
      ),
    },
  ],
  segmented: [
    {
      label: "View switch",
      code:
        'const [v, setV] = useState("day");\n\n' +
        "<Segmented\n  value={v}\n  onChange={setV}\n  options={[\n" +
        '    { value: "day", label: "day" },\n' +
        '    { value: "month", label: "month" },\n' +
        "  ]}\n/>",
      render: <SegmentedExample />,
    },
    {
      label: "Compact (mode toggle)",
      code:
        '<Segmented size="compact" value={mode} onChange={setMode}\n' +
        '  options={[{ value: "now", label: "Now" }, { value: "backfill", label: "Backfill" }]} />',
      render: <SegmentedCompactExample />,
    },
  ],
  combobox: [
    {
      label: "Searchable + create",
      code:
        "<Combobox\n  value={value}\n  onChange={setValue}\n  options={opts}\n  allowClear\n" +
        "  onCreate={(q) => addCategory(q)}\n/>",
      render: <ComboboxExample />,
    },
    {
      label: "Plain options",
      code:
        "<Combobox value={value} onChange={setValue}\n" +
        '  options={[{ value: "a", label: "alpha" }, { value: "b", label: "beta" }]} />',
      render: <ComboboxPlainExample />,
    },
  ],
  article: [
    {
      label: "With prose body",
      code:
        '<Article\n  title="my post"\n  date="2026-05-24"\n  tags={["dev"]}\n  backHref="/articles"\n>\n' +
        "  <Prose>{markdown}</Prose>\n</Article>",
      render: (
        <div className="w-full text-left">
          <Article
            title="building a component registry"
            date="2026-05-24"
            tags={["next", "react"]}
            backHref="#"
          >
            <Prose>{"shadcn-style, own-the-code. the header handles **title, date, tags**; the body is yours."}</Prose>
          </Article>
        </div>
      ),
    },
    {
      label: "With banner",
      code:
        '<Article title="my post" date="2026-05-24" banner="/images/banner.png">\n' +
        "  <Prose>{markdown}</Prose>\n</Article>",
      render: (
        <div className="w-full text-left">
          <Article title="with a banner" date="2026-05-24" banner={bannerSvg}>
            <Prose>{"the banner renders above the header."}</Prose>
          </Article>
        </div>
      ),
    },
  ],
  range: [
    {
      label: "Controlled",
      code:
        "const [v, setV] = useState(40);\n\n" +
        "<Range value={v} onChange={setV} />",
      render: <RangeExample />,
    },
    {
      label: "Stepped",
      code: "<Range value={v} onChange={setV} min={0} max={10} step={2} />",
      render: <RangeSteppedExample />,
    },
  ],
  menu: [
    {
      label: "Sort menu",
      code:
        'const [sel, setSel] = useState("Newest");\n\n' +
        "<Menu\n" +
        '  trigger={<><ListFilter /> Sort: {sel}</>}\n' +
        '  label="Sort by"\n' +
        "  items={opts.map((o) => ({\n" +
        "    label: o, selected: sel === o, onSelect: () => setSel(o),\n" +
        "  }))}\n/>",
      render: <MenuExample />,
    },
  ],
  toc: [
    {
      label: "Scroll-spy",
      code:
        "<Toc\n  headings={[\n" +
        '    { id: "intro", text: "introduction" },\n' +
        '    { id: "usage", text: "usage" },\n' +
        "  ]}\n/>",
      render: (
        <TocExample
          headings={[
            { id: "ex-intro", text: "introduction" },
            { id: "ex-usage", text: "usage" },
            { id: "ex-api", text: "api reference" },
          ]}
        />
      ),
    },
    {
      label: "Custom label",
      code: '<Toc label="contents" headings={headings} />',
      render: (
        <TocExample
          label="contents"
          headings={[
            { id: "ex2-setup", text: "setup" },
            { id: "ex2-theming", text: "theming" },
          ]}
        />
      ),
    },
  ],
  prose: [
    {
      label: "Render markdown",
      code: "<Prose>{`# title\n\nsome **markdown** with \\`code\\`.`}</Prose>",
      render: (
        <div className="text-left">
          <Prose>{"# title\n\nsome **markdown** with `code` and a [link](https://example.com).\n\n- list item\n- another"}</Prose>
        </div>
      ),
    },
    {
      label: "Code block + math",
      code: "<Prose>{md}</Prose>",
      render: (
        <div className="text-left">
          <Prose>{"```ts\nconst x = 1;\n```\n\ninline math: $a^2 + b^2 = c^2$"}</Prose>
        </div>
      ),
    },
  ],
  accordion: [
    {
      label: "Exclusive (shared name)",
      code:
        "<Accordion>\n" +
        '  <AccordionItem title="first" name="faq" defaultOpen>\n' +
        "    one open at a time.\n" +
        "  </AccordionItem>\n" +
        '  <AccordionItem title="second" name="faq">\n' +
        "    siblings sharing a name auto-close.\n" +
        "  </AccordionItem>\n" +
        "</Accordion>",
      render: (
        <Accordion className="w-72">
          <AccordionItem title="first" name="faq-ex" defaultOpen>
            one open at a time.
          </AccordionItem>
          <AccordionItem title="second" name="faq-ex">
            siblings sharing a name auto-close.
          </AccordionItem>
          <AccordionItem title="third" name="faq-ex">
            zero javascript — native &lt;details&gt;.
          </AccordionItem>
        </Accordion>
      ),
    },
    {
      label: "Independent items",
      code:
        "<Accordion>\n" +
        '  <AccordionItem title="first" defaultOpen>\n' +
        "    no shared name, so items open independently.\n" +
        "  </AccordionItem>\n" +
        '  <AccordionItem title="second">each keeps its own state.</AccordionItem>\n' +
        "</Accordion>",
      render: (
        <Accordion className="w-72">
          <AccordionItem title="first" defaultOpen>
            no shared name, so items open independently.
          </AccordionItem>
          <AccordionItem title="second">each keeps its own state.</AccordionItem>
        </Accordion>
      ),
    },
  ],
};
