import { SubtitleCue } from './subtitle';

export interface Lesson {
  id: string;
  title: string;
  speaker: string;
  description: string;
  videoUrl: string;
  duration: number; // in seconds
  thumbnailUrl: string;
  subtitles: SubtitleCue[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}
