"use client";

import { useState } from "react";
import type { UsageExample } from "./_examples";
import { Button } from "../../../../../packages/registry/button/button";
import { DialogProvider } from "../../../../../packages/registry/dialog/dialog";
import { Prose } from "../../../../../packages/registry/prose/prose";
import { Editor, type EditorSize } from "../../../../../packages/registry/editor/editor";
import { Desk } from "../../../../../packages/registry/desk/desk";
import { EditorToolbar } from "../../../../../packages/registry/editor-toolbar/editor-toolbar";
import { DrawingWindow } from "../../../../../packages/registry/drawing-window/drawing-window";
import {
  AssetSidebar,
  type Asset,
} from "../../../../../packages/registry/asset-sidebar/asset-sidebar";
import { Sheet, type SheetSide } from "../../../../../packages/registry/sheet/sheet";
import { Socials } from "../../../../../packages/registry/socials/socials";
import {
  ManagerTable,
  type ManagerRow,
} from "../../../../../packages/registry/manager-table/manager-table";
import { NowPlayingBar } from "../../../../../packages/registry/now-playing-bar/now-playing-bar";

// --- shared bits ------------------------------------------------------------

// Inline SVG data URIs so asset thumbnails need no network.
const swatch = (label: string, bg: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="320" height="180" fill="${bg}"/><text x="160" y="98" font-family="monospace" font-size="20" fill="#111" text-anchor="middle">${label}</text></svg>`,
  )}`;

const SAMPLE_ASSETS: Asset[] = [
  {
    id: "1",
    url: swatch("diagram", "#efede7"),
    name: "system-diagram.png",
    markdownPath: "/images/system-diagram.png",
  },
  {
    id: "2",
    url: swatch("hero", "#d7e3f0"),
    name: "hero-shot.jpg",
    markdownPath: "/images/hero-shot.jpg",
  },
];

// Monotonic id for demo uploads/drawings (module scope, like the desk demo).
let nextId = 100;

// --- stateful examples need their own little wrapper components ------------

const EDITOR_INITIAL =
  "# markdown editor\n\nselect text on the left and a **preview** button appears.\nclick a block on the right and the editor scrolls to it.\n\n- two-way line sync\n- bring your own renderer";

function EditorExample() {
  const [md, setMd] = useState(EDITOR_INITIAL);
  return (
    <div className="w-full">
      <Editor
        value={md}
        onChange={setMd}
        size="sm"
        className="border border-white/10"
        renderMarkdown={(source, { highlightLine }) => (
          <Prose lineSync highlightLine={highlightLine}>
            {source}
          </Prose>
        )}
      />
    </div>
  );
}

function EditorSizesExample() {
  const [md, setMd] = useState("# sized\n\npick a height preset above.");
  const [size, setSize] = useState<EditorSize>("sm");
  const sizes: EditorSize[] = ["sm", "md", "lg"];
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center gap-1 font-mono text-[11px]">
        <span className="mr-2 uppercase tracking-[0.18em] text-white/40">size</span>
        {sizes.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSize(s)}
            className={
              "border px-2 py-1 transition-colors " +
              (s === size
                ? "border-white text-white"
                : "border-white/20 text-white/60 hover:border-white/50")
            }
          >
            {s}
          </button>
        ))}
      </div>
      <Editor
        value={md}
        onChange={setMd}
        size={size}
        className="border border-white/10"
        renderMarkdown={(source, { highlightLine }) => (
          <Prose lineSync highlightLine={highlightLine}>
            {source}
          </Prose>
        )}
      />
    </div>
  );
}

const DESK_INITIAL =
  "# the desk\n\na full markdown workbench: toolbar, image sidebar, and a\nsplit editor with a two-way synced preview.\n\n- click insert on a sidebar image\n- press **new drawing** in the toolbar";

function DeskExample() {
  const [md, setMd] = useState(DESK_INITIAL);
  return (
    <div className="w-full">
      <Desk
        title="the desk"
        subtitle="guides / the-desk"
        value={md}
        onChange={setMd}
        size="md"
        assets={SAMPLE_ASSETS}
        renderMarkdown={(source, { highlightLine }) => (
          <Prose lineSync highlightLine={highlightLine}>
            {source}
          </Prose>
        )}
      />
    </div>
  );
}

function DeskFullExample() {
  const [md, setMd] = useState("# drafts\n\nsave with the button or cmd/ctrl+s.\ndrop images on the sidebar to upload; drawings land there too.");
  const [assets, setAssets] = useState<Asset[]>(SAMPLE_ASSETS);
  const [status, setStatus] = useState("unsaved");
  return (
    <div className="w-full">
      <p className="mb-2 font-mono text-xs text-white/40">status: {status}</p>
      <Desk
        title="drafts"
        subtitle="workspace / drafts"
        value={md}
        onChange={(next) => {
          setMd(next);
          setStatus("unsaved");
        }}
        size="md"
        assets={assets}
        onSave={() => setStatus("saved")}
        onDeleteAsset={(asset) =>
          setAssets((current) => current.filter((a) => a.id !== asset.id))
        }
        onUploadAssets={(files) =>
          setAssets((current) => [
            ...files.map((file) => ({
              id: `${(nextId += 1)}`,
              url: URL.createObjectURL(file),
              name: file.name,
              markdownPath: `/images/${file.name}`,
            })),
            ...current,
          ])
        }
        onSaveDrawing={({ dataUrl, darkDataUrl }) => {
          const id = `${(nextId += 1)}`;
          const name = `drawing-${id}.png`;
          setAssets((current) => [
            { id, url: darkDataUrl ?? dataUrl, name, markdownPath: `/images/${name}` },
            ...current,
          ]);
        }}
        drawingDarkMapping
        renderMarkdown={(source, { highlightLine }) => (
          <Prose lineSync highlightLine={highlightLine}>
            {source}
          </Prose>
        )}
      />
    </div>
  );
}

function EditorToolbarExample() {
  const [mode, setMode] = useState("split");
  const [lastFormat, setLastFormat] = useState<string | null>(null);
  return (
    <div className="w-full border border-white/10 bg-white/[0.02]">
      <EditorToolbar
        title="getting started"
        subtitle="guides / getting-started"
        mode={mode}
        onModeChange={setMode}
        onFormat={(action) => setLastFormat(action.label)}
        status={lastFormat ? `inserted ${lastFormat.toLowerCase()}` : "save: cmd/ctrl+s"}
        actions={
          <button
            type="button"
            className="bg-white px-4 py-1.5 text-sm font-medium text-black transition-colors hover:bg-white/90"
          >
            save
          </button>
        }
      />
      <div className="px-4 py-6 text-center text-sm text-white/40">
        mode: <span className="text-white/70">{mode}</span>
      </div>
    </div>
  );
}

function EditorToolbarDrawingExample() {
  const [saved, setSaved] = useState(0);
  return (
    <div className="w-full border border-white/10 bg-white/[0.02]">
      <EditorToolbar
        title="sketchbook"
        enableDrawing
        onSaveDrawing={() => setSaved((n) => n + 1)}
        status="open several windows; each is numbered"
      />
      <div className="px-4 py-6 text-center text-sm text-white/40">
        drawings saved: <span className="text-white/70">{saved}</span>
      </div>
    </div>
  );
}

function DrawingWindowExample({ darkMapping }: { darkMapping?: boolean }) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="outline" onClick={() => setOpen(true)}>
        open drawing
      </Button>
      {saved ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={saved} alt="saved drawing" className="max-h-32 border border-white/15" />
      ) : (
        <p className="text-xs text-white/40">draw, then save to preview here.</p>
      )}
      {open ? (
        <DrawingWindow
          title="drawing #1"
          subtitle="example"
          darkMapping={darkMapping}
          onClose={() => setOpen(false)}
          onSave={({ dataUrl, darkDataUrl }) => {
            setSaved(darkDataUrl ?? dataUrl);
            setOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}

function AssetSidebarUploadExample() {
  const [assets, setAssets] = useState<Asset[]>(SAMPLE_ASSETS);
  return (
    <div className="h-80 w-72">
      <AssetSidebar
        assets={assets}
        description="drag into the editor or click insert."
        onInsert={() => {}}
        onDelete={(asset) =>
          setAssets((current) => current.filter((a) => a.id !== asset.id))
        }
        onUpload={(files) =>
          setAssets((current) => [
            ...files.map((file) => ({
              id: `${(nextId += 1)}`,
              url: URL.createObjectURL(file),
              name: file.name,
              markdownPath: `/images/${file.name}`,
            })),
            ...current,
          ])
        }
      />
    </div>
  );
}

function SheetExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        open sheet
      </Button>
      <Sheet open={open} onClose={() => setOpen(false)} title="settings">
        <div className="flex flex-col items-start gap-2">
          <a href="#" className="text-sm text-white underline-offset-4 hover:underline">
            profile
          </a>
          <a href="#" className="text-sm text-white underline-offset-4 hover:underline">
            preferences
          </a>
          <a href="#" className="text-sm text-white underline-offset-4 hover:underline">
            sign out
          </a>
        </div>
      </Sheet>
    </>
  );
}

function SheetSidesExample() {
  const [side, setSide] = useState<SheetSide | null>(null);
  const sides: SheetSide[] = ["left", "right", "top", "bottom"];
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {sides.map((s) => (
        <Button key={s} variant="outline" onClick={() => setSide(s)}>
          {s}
        </Button>
      ))}
      <Sheet
        open={side !== null}
        onClose={() => setSide(null)}
        side={side ?? "right"}
        title={side ?? "sheet"}
      >
        <p className="text-sm text-white/60">slides in from the {side} edge.</p>
      </Sheet>
    </div>
  );
}

const MANAGER_INITIAL: ManagerRow[] = [
  { id: "1", name: "Deep Work", color: "#5b7a8a" },
  { id: "2", name: "Errands", color: "#7a6b5b" },
  { id: "3", name: "Archived Stuff", color: "#7a5b78", archived: true },
];

function ManagerTableExample({ palette }: { palette?: string[] }) {
  const [rows, setRows] = useState<ManagerRow[]>(MANAGER_INITIAL);
  return (
    <DialogProvider>
      <div className="w-full max-w-xl">
        <ManagerTable
          rows={rows}
          palette={palette}
          onRename={(id, name) =>
            setRows((prev) => prev.map((r) => (r.id === id ? { ...r, name } : r)))
          }
          onRecolor={(id, color) =>
            setRows((prev) => prev.map((r) => (r.id === id ? { ...r, color } : r)))
          }
          onArchive={(id, archived) =>
            setRows((prev) => prev.map((r) => (r.id === id ? { ...r, archived } : r)))
          }
          onDelete={(id) => setRows((prev) => prev.filter((r) => r.id !== id))}
        />
      </div>
    </DialogProvider>
  );
}

function NowPlayingBarExample() {
  const [startedAt, setStartedAt] = useState<number | undefined>(undefined);
  const running = startedAt !== undefined;
  return (
    <div className="relative flex h-[180px] w-full flex-col overflow-hidden border border-white/10 bg-black">
      <div className="flex flex-1 items-center justify-center">
        <Button
          variant={running ? "outline" : "solid"}
          onClick={() => setStartedAt(running ? undefined : Date.now())}
        >
          {running ? "Stop" : "Start"}
        </Button>
      </div>
      <NowPlayingBar
        position="sticky"
        title="Deep work"
        subtitle="focus session"
        accent="#6ee7b7"
        startedAt={startedAt}
        actions={
          running ? (
            <Button size="sm" variant="outline" onClick={() => setStartedAt(undefined)}>
              Stop
            </Button>
          ) : null
        }
      />
    </div>
  );
}

// --- the example table -----------------------------------------------------

export const EDITOR_EXAMPLES: Record<string, UsageExample[]> = {
  editor: [
    {
      label: "Basic",
      code:
        'const [md, setMd] = useState("# hello");\n\n' +
        "<Editor\n  value={md}\n  onChange={setMd}\n  size=\"sm\"\n" +
        "  renderMarkdown={(source, { highlightLine }) => (\n" +
        "    <Prose lineSync highlightLine={highlightLine}>{source}</Prose>\n" +
        "  )}\n/>",
      render: <EditorExample />,
    },
    {
      label: "Size presets",
      code:
        '// size: "sm" | "md" | "lg" | "xl" | "2xl" | "screen" (default) | "auto"\n' +
        '<Editor value={md} onChange={setMd} size={size} renderMarkdown={render} />',
      render: <EditorSizesExample />,
    },
  ],
  desk: [
    {
      label: "Basic",
      code:
        "<Desk\n  title=\"the desk\"\n  subtitle=\"guides / the-desk\"\n" +
        "  value={md}\n  onChange={setMd}\n  size=\"md\"\n  assets={assets}\n" +
        "  renderMarkdown={(source, { highlightLine }) => (\n" +
        "    <Prose lineSync highlightLine={highlightLine}>{source}</Prose>\n" +
        "  )}\n/>",
      render: <DeskExample />,
    },
    {
      label: "Save, uploads & drawings",
      code:
        "<Desk\n  value={md}\n  onChange={setMd}\n  size=\"md\"\n  assets={assets}\n" +
        "  onSave={(value) => save(value)}          // also cmd/ctrl+s\n" +
        "  onDeleteAsset={(asset) => remove(asset)}\n" +
        "  onUploadAssets={(files) => upload(files)}\n" +
        "  onSaveDrawing={({ darkDataUrl }) => addAsset(darkDataUrl)}\n" +
        "  drawingDarkMapping\n  renderMarkdown={render}\n/>",
      render: <DeskFullExample />,
    },
  ],
  "editor-toolbar": [
    {
      label: "Basic",
      code:
        'const [mode, setMode] = useState("split");\n\n' +
        "<EditorToolbar\n  title=\"getting started\"\n  subtitle=\"guides / getting-started\"\n" +
        "  mode={mode}\n  onModeChange={setMode}\n" +
        "  onFormat={(action) => insertSnippet(action)}\n" +
        '  status="save: cmd/ctrl+s"\n  actions={<button>save</button>}\n/>',
      render: <EditorToolbarExample />,
    },
    {
      label: "With drawing windows",
      code:
        "<EditorToolbar\n  title=\"sketchbook\"\n  enableDrawing\n" +
        "  onSaveDrawing={({ dataUrl }) => addAsset(dataUrl)}\n/>",
      render: <EditorToolbarDrawingExample />,
    },
  ],
  "drawing-window": [
    {
      label: "Basic",
      code:
        "{open ? (\n  <DrawingWindow\n    title=\"drawing #1\"\n" +
        "    onClose={() => setOpen(false)}\n" +
        "    onSave={({ dataUrl }) => saveImage(dataUrl)}\n  />\n) : null}",
      render: <DrawingWindowExample />,
    },
    {
      label: "Dark mapping",
      code:
        "// draw in light colors on white; save emits a dark-remapped variant too\n" +
        "<DrawingWindow\n  darkMapping\n" +
        "  onSave={({ dataUrl, darkDataUrl }) => saveImage(darkDataUrl ?? dataUrl)}\n/>",
      render: <DrawingWindowExample darkMapping />,
    },
  ],
  "asset-sidebar": [
    {
      label: "Basic",
      code:
        "<AssetSidebar\n  assets={assets}\n" +
        '  description="drag into the editor or click insert."\n' +
        "  onInsert={(asset) => insertRef(asset)}\n" +
        "  onDelete={(asset) => remove(asset)}\n/>",
      render: (
        <div className="h-80 w-72">
          <AssetSidebar
            assets={SAMPLE_ASSETS}
            description="drag into the editor or click insert."
            onInsert={() => {}}
            onDelete={() => {}}
          />
        </div>
      ),
    },
    {
      label: "With drop zone",
      code:
        "// passing onUpload shows the drop zone at the bottom\n" +
        "<AssetSidebar\n  assets={assets}\n" +
        "  onInsert={insertRef}\n  onDelete={remove}\n" +
        "  onUpload={(files) => upload(files)}\n/>",
      render: <AssetSidebarUploadExample />,
    },
    {
      label: "Empty",
      code: '<AssetSidebar assets={[]} emptyLabel="nothing uploaded yet." />',
      render: (
        <div className="h-48 w-72">
          <AssetSidebar assets={[]} emptyLabel="nothing uploaded yet." />
        </div>
      ),
    },
  ],
  sheet: [
    {
      label: "Basic",
      code:
        "const [open, setOpen] = useState(false);\n\n" +
        '<Sheet open={open} onClose={() => setOpen(false)} title="settings">\n' +
        "  {children}\n</Sheet>",
      render: <SheetExample />,
    },
    {
      label: "Sides",
      code:
        '<Sheet open={open} onClose={close} side="left" title="left" />\n' +
        '<Sheet open={open} onClose={close} side="top" title="top" />\n' +
        '<Sheet open={open} onClose={close} side="bottom" title="bottom" />',
      render: <SheetSidesExample />,
    },
  ],
  socials: [
    {
      label: "Basic",
      code:
        "<Socials\n  links={{\n" +
        '    github: "https://github.com/justin06lee",\n' +
        '    x: "https://x.com/justin06lee",\n' +
        '    email: "hi@example.com",  // click copies the address\n' +
        '    website: "https://justin06lee.dev",\n' +
        "  }}\n/>",
      render: (
        <Socials
          links={{
            github: "https://github.com/justin06lee",
            x: "https://x.com/justin06lee",
            email: "hi@example.com",
            website: "https://justin06lee.dev",
          }}
        />
      ),
    },
    {
      label: "Sizes & gap",
      code:
        '<Socials size="sm" gap="tight" links={links} />\n' +
        '<Socials size="lg" gap="loose" links={links} />',
      render: (
        <div className="flex flex-col items-center gap-4">
          <Socials
            size="sm"
            gap="tight"
            links={{
              github: "https://github.com/justin06lee",
              youtube: "https://youtube.com/@justin06lee",
              instagram: "https://instagram.com/justin06lee",
            }}
          />
          <Socials
            size="lg"
            gap="loose"
            links={{
              github: "https://github.com/justin06lee",
              youtube: "https://youtube.com/@justin06lee",
              instagram: "https://instagram.com/justin06lee",
            }}
          />
        </div>
      ),
    },
  ],
  "manager-table": [
    {
      label: "Basic",
      code:
        "// needs a <DialogProvider> above it (delete confirms via dialog)\n" +
        "<ManagerTable\n  rows={rows}\n" +
        "  onRename={(id, name) => rename(id, name)}\n" +
        "  onRecolor={(id, color) => recolor(id, color)}\n" +
        "  onArchive={(id, archived) => archive(id, archived)}\n" +
        "  onDelete={(id) => remove(id)}\n/>",
      render: <ManagerTableExample />,
    },
    {
      label: "Custom palette",
      code:
        '<ManagerTable\n  rows={rows}\n  palette={["#6ee7b7", "#93c5fd", "#c4b5fd", "#fda4af"]}\n' +
        "  onRecolor={(id, color) => recolor(id, color)}\n/>",
      render: <ManagerTableExample palette={["#6ee7b7", "#93c5fd", "#c4b5fd", "#fda4af"]} />,
    },
  ],
  "now-playing-bar": [
    {
      label: "Start / stop",
      code:
        "const [startedAt, setStartedAt] = useState<number | undefined>();\n\n" +
        "<NowPlayingBar\n  position=\"sticky\"\n  title=\"Deep work\"\n" +
        '  subtitle="focus session"\n  accent="#6ee7b7"\n  startedAt={startedAt}\n' +
        "  actions={<Button onClick={() => setStartedAt(undefined)}>Stop</Button>}\n/>",
      render: <NowPlayingBarExample />,
    },
    {
      label: "Idle state",
      code: '// no startedAt: shows "Nothing running", no timer\n<NowPlayingBar position="sticky" title="Deep work" />',
      render: (
        <div className="relative w-full overflow-hidden border border-white/10 bg-black">
          <div className="h-16" />
          <NowPlayingBar position="sticky" title="Deep work" />
        </div>
      ),
    },
  ],
};
