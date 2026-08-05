import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "track-list",
  type: "registry:ui",
  description:
    "queue, history or tracklist — title / artist / duration rows with the current one marked by a live sound-bars meter in place of its number, so nothing reflows when playback moves. each row is one real control: a link with href, a button with onSelect, inert otherwise.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils", "sound-bars", "album-art"],
  files: [{ source: "track-list.tsx", target: "track-list.tsx" }],
  props: [
    {
      name: "tracks",
      type: "Track[]",
      required: true,
      description:
        "{ id, title, artist?, duration?, art?, href?, meta?, unavailable? }[] — duration in seconds.",
    },
    { name: "activeId", type: "string", description: "the current track; gets the meter in place of its index." },
    { name: "playing", type: "boolean", default: "true", description: "whether the active track is actually sounding." },
    { name: "onSelect", type: "(track: Track) => void" },
    { name: "art", type: "boolean", default: "false", description: "show a cover thumbnail per row instead of a position number." },
    { name: "numbered", type: "boolean", default: "true", description: "number the rows; ignored when art is on." },
    { name: "linkComponent", type: "React.ElementType", description: "anchor component for internal hrefs (e.g. next/link)." },
    { name: "label", type: "ReactNode", description: "mono uppercase caption above the list." },
    { name: "empty", type: "ReactNode", description: "rendered in place of the rows when tracks is empty." },
    { name: "className", type: "string" },
  ],
});
