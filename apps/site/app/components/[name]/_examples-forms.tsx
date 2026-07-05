"use client";

import { useState } from "react";
import type { UsageExample } from "./_examples";
import { Checkbox } from "../../../../../packages/registry/checkbox/checkbox";
import {
  CategoryPicker,
  type CategoryItem,
} from "../../../../../packages/registry/category-picker/category-picker";
import { InlineEdit } from "../../../../../packages/registry/inline-edit/inline-edit";
import { LoginForm } from "../../../../../packages/registry/login-form/login-form";
import { TagInput } from "../../../../../packages/registry/tag-input/tag-input";
import {
  ColorSwatch,
  ColorSwatchPicker,
  CATEGORY_PALETTE,
} from "../../../../../packages/registry/color-swatch/color-swatch";
import { CodeBlock } from "../../../../../packages/registry/code-block/code-block";
import { CollapsibleProse } from "../../../../../packages/registry/collapsible-prose/collapsible-prose";
import { Prose } from "../../../../../packages/registry/prose/prose";
import { Pfp } from "../../../../../packages/registry/pfp/pfp";

// --- stateful examples need their own little wrapper components ------------

function CheckboxControlledExample() {
  const [checked, setChecked] = useState(true);
  return (
    <Checkbox
      label={checked ? "subscribed" : "not subscribed"}
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
    />
  );
}

function CategoryPickerExample() {
  const [value, setValue] = useState<string | null>("deep-work");
  const items: CategoryItem[] = [
    { id: "deep-work", label: "deep work", color: "#5b7a8a" },
    { id: "reading", label: "reading", color: "#6b8a72" },
    { id: "sleep", label: "sleep", color: "#5b5b8a" },
  ];
  return (
    <div className="w-56">
      <CategoryPicker value={value} onChange={setValue} items={items} ariaLabel="category" />
    </div>
  );
}

function CategoryPickerCreateExample() {
  const [items, setItems] = useState<CategoryItem[]>([
    { id: "deep-work", label: "deep work", color: "#5b7a8a" },
    { id: "reading", label: "reading", color: "#6b8a72" },
  ]);
  const [value, setValue] = useState<string | null>(null);
  return (
    <div className="w-56">
      <CategoryPicker
        value={value}
        onChange={setValue}
        items={items}
        ariaLabel="category"
        allowClear
        onCreate={(label) => {
          const id = label.toLowerCase().replace(/\s+/g, "-") || `cat-${items.length}`;
          const color = CATEGORY_PALETTE[items.length % CATEGORY_PALETTE.length]!.hex;
          setItems((prev) => [...prev, { id, label: label || "new", color }]);
          setValue(id);
        }}
      />
    </div>
  );
}

function InlineEditExample() {
  const [name, setName] = useState("untitled note");
  return (
    <div className="w-56">
      <InlineEdit
        value={name}
        onCommit={async (next) => {
          await new Promise((r) => setTimeout(r, 400));
          setName(next);
        }}
      />
    </div>
  );
}

function InlineEditRollbackExample() {
  const [value] = useState("cannot change me");
  return (
    <div className="w-56">
      <InlineEdit
        value={value}
        onCommit={async () => {
          await new Promise((r) => setTimeout(r, 400));
          throw new Error("rejected");
        }}
      />
    </div>
  );
}

function LoginFormExample() {
  return (
    <div className="w-full max-w-xs">
      <LoginForm
        onSubmit={async ({ password }) => {
          await new Promise((r) => setTimeout(r, 600));
          if (password === "limit") return { rateLimited: true };
          if (password !== "secret") return { error: "wrong password." };
        }}
      />
    </div>
  );
}

function LoginFormFieldsExample() {
  return (
    <div className="w-full max-w-xs">
      <LoginForm
        title="welcome back"
        submitLabel="continue"
        loadingLabel="checking..."
        fields={[
          { name: "email", label: "email", type: "email", autoComplete: "email" },
          {
            name: "password",
            label: "password",
            type: "password",
            autoComplete: "current-password",
          },
        ]}
        onSubmit={async () => {
          await new Promise((r) => setTimeout(r, 600));
          return { error: "incorrect credentials." };
        }}
      />
    </div>
  );
}

function TagInputExample() {
  const [tags, setTags] = useState<string[]>(["react", "typescript"]);
  return (
    <div className="w-full max-w-sm">
      <TagInput value={tags} onChange={setTags} />
    </div>
  );
}

function TagInputSuggestionsExample() {
  const [tags, setTags] = useState<string[]>(["react"]);
  return (
    <div className="w-full max-w-sm">
      <TagInput
        value={tags}
        onChange={setTags}
        suggestions={["next.js", "tailwind", "node", "postgres", "bun"]}
      />
    </div>
  );
}

function TagInputStrictExample() {
  const [tags, setTags] = useState<string[]>([]);
  return (
    <div className="w-full max-w-sm">
      <TagInput
        value={tags}
        onChange={setTags}
        allowFreeText={false}
        placeholder="pick from suggestions"
        suggestions={["design", "engineering", "research"]}
      />
    </div>
  );
}

function ColorSwatchPickerExample() {
  const [value, setValue] = useState<string | null>(CATEGORY_PALETTE[0]!.hex);
  return (
    <div className="flex flex-col items-center gap-3">
      <ColorSwatchPicker value={value} onChange={setValue} ariaLabel="pick a color" />
      <div className="flex items-center gap-2 font-mono text-xs text-white/50">
        <ColorSwatch color={value ?? "#000000"} />
        {CATEGORY_PALETTE.find((c) => c.hex === value)?.name ?? "none"}
      </div>
    </div>
  );
}

// --- static sample data ------------------------------------------------------

const CODE_SAMPLE = `export function Hello({ name }: { name: string }) {
  // a tiny greeting
  return <p>hi {name}</p>;
}`;

const BASH_SAMPLE = `bunx @justin06lee/chrome init
bunx @justin06lee/chrome add code-block`;

const PROSE_MD = `an intro paragraph renders flat, above the sections.

## getting started

each \`##\` heading becomes its own collapsible section.

## notes

pure native details — no javascript state.`;

const svg = (inner: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">${inner}</svg>`,
  )}`;

const PFP_GRADIENT = svg(
  `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a78bfa"/><stop offset="1" stop-color="#60a5fa"/></linearGradient></defs>` +
    `<rect width="64" height="64" fill="url(#g)"/>` +
    `<text x="32" y="42" font-family="monospace" font-size="28" fill="white" text-anchor="middle">j</text>`,
);

const PFP_DOT = svg(
  `<rect width="64" height="64" fill="#111"/><circle cx="32" cy="32" r="18" fill="#6ee7b7"/>`,
);

// --- the example table -----------------------------------------------------

export const FORM_EXAMPLES: Record<string, UsageExample[]> = {
  checkbox: [
    {
      label: "Basic",
      code:
        '<Checkbox label="published" defaultChecked />\n' +
        '<Checkbox label="hidden test case" />',
      render: (
        <div className="flex flex-col gap-3">
          <Checkbox label="published" defaultChecked />
          <Checkbox label="hidden test case" />
        </div>
      ),
    },
    {
      label: "Controlled",
      code:
        "const [checked, setChecked] = useState(true);\n\n" +
        "<Checkbox\n" +
        '  label={checked ? "subscribed" : "not subscribed"}\n' +
        "  checked={checked}\n" +
        "  onChange={(e) => setChecked(e.target.checked)}\n" +
        "/>",
      render: <CheckboxControlledExample />,
    },
    {
      label: "Disabled",
      code: '<Checkbox label="locked" disabled />\n<Checkbox label="locked on" disabled defaultChecked />',
      render: (
        <div className="flex flex-col gap-3">
          <Checkbox label="locked" disabled />
          <Checkbox label="locked on" disabled defaultChecked />
        </div>
      ),
    },
  ],
  "category-picker": [
    {
      label: "Basic",
      code:
        "const [value, setValue] = useState(null);\n\n" +
        "<CategoryPicker\n  value={value}\n  onChange={setValue}\n  items={[\n" +
        '    { id: "deep-work", label: "deep work", color: "#5b7a8a" },\n' +
        '    { id: "reading", label: "reading", color: "#6b8a72" },\n' +
        "  ]}\n/>",
      render: <CategoryPickerExample />,
    },
    {
      label: "Clear + create",
      code:
        "<CategoryPicker\n  value={value}\n  onChange={setValue}\n  items={items}\n  allowClear\n" +
        "  onCreate={(label) => addCategory(label)}\n/>",
      render: <CategoryPickerCreateExample />,
    },
  ],
  "inline-edit": [
    {
      label: "Blur to save",
      code:
        'const [name, setName] = useState("untitled note");\n\n' +
        "<InlineEdit\n  value={name}\n  onCommit={async (next) => {\n" +
        "    await save(next); // enter or blur commits\n    setName(next);\n  }}\n/>",
      render: <InlineEditExample />,
    },
    {
      label: "Rolls back on error",
      code:
        "<InlineEdit\n  value={value}\n  onCommit={async () => {\n" +
        '    throw new Error("rejected"); // draft snaps back\n  }}\n/>',
      render: <InlineEditRollbackExample />,
    },
  ],
  "login-form": [
    {
      label: "Basic",
      code:
        "<LoginForm\n  onSubmit={async ({ password }) => {\n" +
        '    if (password === "limit") return { rateLimited: true };\n' +
        '    if (password !== "secret") return { error: "wrong password." };\n' +
        "  }}\n/>",
      render: <LoginFormExample />,
    },
    {
      label: "Custom fields & labels",
      code:
        '<LoginForm\n  title="welcome back"\n  submitLabel="continue"\n  loadingLabel="checking..."\n' +
        "  fields={[\n" +
        '    { name: "email", label: "email", type: "email" },\n' +
        '    { name: "password", label: "password", type: "password" },\n' +
        "  ]}\n  onSubmit={signIn}\n/>",
      render: <LoginFormFieldsExample />,
    },
  ],
  "tag-input": [
    {
      label: "Basic",
      code:
        'const [tags, setTags] = useState(["react", "typescript"]);\n\n' +
        "<TagInput value={tags} onChange={setTags} />",
      render: <TagInputExample />,
    },
    {
      label: "With suggestions",
      code:
        "<TagInput\n  value={tags}\n  onChange={setTags}\n" +
        '  suggestions={["next.js", "tailwind", "node", "postgres", "bun"]}\n/>',
      render: <TagInputSuggestionsExample />,
    },
    {
      label: "Suggestions only",
      code:
        "<TagInput\n  value={tags}\n  onChange={setTags}\n  allowFreeText={false}\n" +
        '  placeholder="pick from suggestions"\n' +
        '  suggestions={["design", "engineering", "research"]}\n/>',
      render: <TagInputStrictExample />,
    },
  ],
  "color-swatch": [
    {
      label: "Swatch chips",
      code:
        '<ColorSwatch color="#5b7a8a" title="slate-blue" />\n' +
        '<ColorSwatch color="#6b8a72" title="sage" />\n' +
        '<ColorSwatch color="#7a5b78" title="plum" />',
      render: (
        <div className="flex items-center gap-2">
          <ColorSwatch color="#5b7a8a" title="slate-blue" />
          <ColorSwatch color="#6b8a72" title="sage" />
          <ColorSwatch color="#7a5b78" title="plum" />
        </div>
      ),
    },
    {
      label: "Palette picker",
      code:
        "const [value, setValue] = useState(CATEGORY_PALETTE[0].hex);\n\n" +
        '<ColorSwatchPicker value={value} onChange={setValue} ariaLabel="pick a color" />',
      render: <ColorSwatchPickerExample />,
    },
  ],
  "code-block": [
    {
      label: "Basic",
      code: '<CodeBlock code={source} language="tsx" />',
      render: (
        <div className="w-full max-w-md">
          <CodeBlock code={CODE_SAMPLE} language="tsx" />
        </div>
      ),
    },
    {
      label: "Bash, no copy button",
      code: '<CodeBlock code={commands} language="bash" copyable={false} />',
      render: (
        <div className="w-full max-w-md">
          <CodeBlock code={BASH_SAMPLE} language="bash" copyable={false} />
        </div>
      ),
    },
  ],
  "collapsible-prose": [
    {
      label: "Basic",
      code:
        "<CollapsibleProse renderMarkdown={(md) => <Prose>{md}</Prose>}>\n" +
        "  {markdown}\n" +
        "</CollapsibleProse>",
      render: (
        <div className="w-full max-w-md text-left">
          <CollapsibleProse renderMarkdown={(md) => <Prose>{md}</Prose>}>
            {PROSE_MD}
          </CollapsibleProse>
        </div>
      ),
    },
    {
      label: "Collapsed by default",
      code:
        "<CollapsibleProse\n  defaultOpen={false}\n  renderMarkdown={(md) => <Prose>{md}</Prose>}\n>\n" +
        "  {markdown}\n" +
        "</CollapsibleProse>",
      render: (
        <div className="w-full max-w-md text-left">
          <CollapsibleProse defaultOpen={false} renderMarkdown={(md) => <Prose>{md}</Prose>}>
            {PROSE_MD}
          </CollapsibleProse>
        </div>
      ),
    },
  ],
  pfp: [
    {
      label: "Basic",
      code: '<Pfp src="/avatar.png" alt="avatar" />',
      render: <Pfp src={PFP_GRADIENT} alt="avatar" />,
    },
    {
      label: "Sized & framed",
      code: '<Pfp src="/avatar.png" alt="avatar" className="size-24" scale={1.2} />',
      render: <Pfp src={PFP_DOT} alt="avatar" className="size-24" scale={1.2} />,
    },
    {
      label: "Framing offsets",
      code: '<Pfp src="/avatar.png" alt="avatar" x={-10} y={8} scale={1.4} />',
      render: <Pfp src={PFP_GRADIENT} alt="avatar" x={-10} y={8} scale={1.4} />,
    },
  ],
};
