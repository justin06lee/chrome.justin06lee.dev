"use client";

import { useState } from "react";
import { TrackList, type Track } from "./track-list";

const TRACKS: Track[] = [
  { id: "1", title: "an ending (ascent)", artist: "brian eno", duration: 264 },
  { id: "2", title: "weightless", artist: "marconi union", duration: 488 },
  { id: "3", title: "avril 14th", artist: "aphex twin", duration: 125 },
  { id: "4", title: "reckoner", artist: "radiohead", duration: 290 },
  { id: "5", title: "unavailable in your region", artist: "—", duration: 201, unavailable: true },
];

const RECENT: Track[] = [
  { id: "a", title: "sæglópur", artist: "sigur rós", meta: "4m ago" },
  { id: "b", title: "svefn-g-englar", artist: "sigur rós", meta: "14m ago" },
  { id: "c", title: "flim", artist: "aphex twin", meta: "18m ago" },
];

export default function TrackListDemo() {
  const [activeId, setActiveId] = useState("2");
  const [playing, setPlaying] = useState(true);

  return (
    <div className="flex w-full max-w-lg flex-col gap-8">
      <TrackList
        label="queue"
        tracks={TRACKS}
        activeId={activeId}
        playing={playing}
        onSelect={(track) => {
          if (track.id === activeId) setPlaying((p) => !p);
          else {
            setActiveId(track.id);
            setPlaying(true);
          }
        }}
      />

      <p className="text-[13px] text-white/40">
        click a row to make it current; click the current row to pause its meter.
      </p>

      <TrackList label="recently played" tracks={RECENT} numbered={false} />

      <TrackList label="empty" tracks={[]} />
    </div>
  );
}
