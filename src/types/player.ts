export type PlaybackRate = 0.5 | 0.75 | 1.0 | 1.25;

export interface PlayerStatus {
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number; // in seconds
  duration: number; // in seconds
  rate: PlaybackRate;
  isLoopingCue: boolean;
  loopCueIndex: number | null;
}
