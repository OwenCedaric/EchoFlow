import { create } from 'zustand';
import { PlaybackRate } from '../types/player';
import { SubtitleMode, SubtitleCue } from '../types/subtitle';
import { findActiveCueIndex } from '../utils/srtParser';

interface PlayerState {
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  playbackRate: PlaybackRate;
  subtitleMode: SubtitleMode;
  activeCueIndex: number;
  isLoopingCue: boolean;
  loopCueIndex: number | null;
  wasPlayingBeforeLookup: boolean;
  seekTargetTime: number | null;

  // Actions
  setPlaying: (playing: boolean) => void;
  setBuffering: (buffering: boolean) => void;
  setCurrentTime: (time: number, cues: SubtitleCue[]) => void;
  setDuration: (duration: number) => void;
  setPlaybackRate: (rate: PlaybackRate) => void;
  cyclePlaybackRate: () => void;
  setSubtitleMode: (mode: SubtitleMode) => void;
  cycleSubtitleMode: () => void;
  setActiveCueIndex: (index: number) => void;
  toggleLoopCue: (cueIndex?: number) => void;
  clearLoop: () => void;
  requestSeek: (time: number) => void;
  clearSeekTarget: () => void;
  pauseForLookup: () => void;
  resumeAfterLookup: () => void;
  resetPlayer: () => void;
}

const RATES: PlaybackRate[] = [0.5, 0.75, 1.0, 1.25];
const SUBTITLE_MODES: SubtitleMode[] = ['bilingual', 'en_only', 'zh_only', 'hidden'];

export const usePlayerStore = create<PlayerState>((set, get) => ({
  isPlaying: false,
  isBuffering: false,
  currentTime: 0,
  duration: 0,
  playbackRate: 1.0,
  subtitleMode: 'bilingual',
  activeCueIndex: -1,
  isLoopingCue: false,
  loopCueIndex: null,
  wasPlayingBeforeLookup: false,
  seekTargetTime: null,

  setPlaying: (playing) => set({ isPlaying: playing }),
  setBuffering: (buffering) => set({ isBuffering: buffering }),

  setCurrentTime: (time, cues) => {
    const { isLoopingCue, loopCueIndex, requestSeek } = get();

    // Check single sentence loop condition
    if (isLoopingCue && loopCueIndex !== null && cues[loopCueIndex]) {
      const cue = cues[loopCueIndex];
      // If currentTime has reached or surpassed the loop cue end time
      if (time >= cue.endTime) {
        requestSeek(cue.startTime);
        return;
      }
    }

    const nextActiveIndex = findActiveCueIndex(cues, time);
    set({
      currentTime: time,
      activeCueIndex: nextActiveIndex,
    });
  },

  setDuration: (duration) => set({ duration }),

  setPlaybackRate: (playbackRate) => set({ playbackRate }),

  cyclePlaybackRate: () => {
    const current = get().playbackRate;
    const currentIndex = RATES.indexOf(current);
    const nextRate = RATES[(currentIndex + 1) % RATES.length];
    set({ playbackRate: nextRate });
  },

  setSubtitleMode: (subtitleMode) => set({ subtitleMode }),

  cycleSubtitleMode: () => {
    const current = get().subtitleMode;
    const currentIndex = SUBTITLE_MODES.indexOf(current);
    const nextMode = SUBTITLE_MODES[(currentIndex + 1) % SUBTITLE_MODES.length];
    set({ subtitleMode: nextMode });
  },

  setActiveCueIndex: (activeCueIndex) => set({ activeCueIndex }),

  toggleLoopCue: (cueIndex) => {
    const current = get();
    const targetIndex = cueIndex !== undefined ? cueIndex : current.activeCueIndex;

    if (current.isLoopingCue && current.loopCueIndex === targetIndex) {
      // Toggle off
      set({ isLoopingCue: false, loopCueIndex: null });
    } else {
      // Toggle on for targetIndex
      set({ isLoopingCue: true, loopCueIndex: targetIndex });
    }
  },

  clearLoop: () => set({ isLoopingCue: false, loopCueIndex: null }),

  requestSeek: (time) => set({ seekTargetTime: time }),

  clearSeekTarget: () => set({ seekTargetTime: null }),

  pauseForLookup: () => {
    const { isPlaying } = get();
    set({
      wasPlayingBeforeLookup: isPlaying,
      isPlaying: false,
    });
  },

  resumeAfterLookup: () => {
    const { wasPlayingBeforeLookup } = get();
    if (wasPlayingBeforeLookup) {
      set({
        isPlaying: true,
        wasPlayingBeforeLookup: false,
      });
    }
  },

  resetPlayer: () =>
    set({
      isPlaying: false,
      isBuffering: false,
      currentTime: 0,
      duration: 0,
      activeCueIndex: -1,
      isLoopingCue: false,
      loopCueIndex: null,
      seekTargetTime: null,
    }),
}));
