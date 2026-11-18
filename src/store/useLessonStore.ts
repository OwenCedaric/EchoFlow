import { create } from 'zustand';
import { Lesson } from '../types/lesson';
import { MOCK_LESSONS } from '../constants/mockLessons';
import { parseSrtOrVtt } from '../utils/srtParser';

interface LessonState {
  lessons: Lesson[];
  currentLesson: Lesson;

  // Actions
  selectLesson: (lessonId: string) => void;
  importCustomLesson: (params: {
    title: string;
    videoUrl: string;
    srtContent?: string;
  }) => Lesson;
}

export const useLessonStore = create<LessonState>((set, get) => ({
  lessons: MOCK_LESSONS,
  currentLesson: MOCK_LESSONS[0],

  selectLesson: (lessonId) => {
    const found = get().lessons.find((l) => l.id === lessonId);
    if (found) {
      set({ currentLesson: found });
    }
  },

  importCustomLesson: ({ title, videoUrl, srtContent }) => {
    const subtitles = srtContent ? parseSrtOrVtt(srtContent) : [];

    const newLesson: Lesson = {
      id: `custom-${Date.now()}`,
      title: title || 'Imported Video Lesson',
      speaker: 'YouTube Import',
      description: 'Custom imported video lesson with synced audio-visual content.',
      videoUrl,
      duration: 120,
      thumbnailUrl:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop',
      difficulty: 'Intermediate',
      subtitles,
    };

    set({
      lessons: [newLesson, ...get().lessons],
      currentLesson: newLesson,
    });

    return newLesson;
  },
}));
