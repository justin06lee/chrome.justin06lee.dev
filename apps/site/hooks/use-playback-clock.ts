// Bridges the @/hooks/use-playback-clock alias (used by registry component
// source — playhead, lyrics) to the canonical hook in packages/registry.
export { usePlaybackClock, formatPlaybackTime } from "../../../packages/registry/playhead/use-playback-clock";
export type { PlaybackClockOptions } from "../../../packages/registry/playhead/use-playback-clock";
