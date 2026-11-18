export interface SubtitleWord {
  id: string;
  raw: string; // The token including punctuation
  cleanWord: string; // The word without punctuation, lowercase or capitalized for dictionary lookup
  isClickable: boolean;
}

export interface SubtitleCue {
  id: number;
  startTime: number; // in seconds
  endTime: number; // in seconds
  textEn: string;
  textZh?: string;
  words: SubtitleWord[];
}

export type SubtitleMode = 'bilingual' | 'en_only' | 'zh_only' | 'hidden';
