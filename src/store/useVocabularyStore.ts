import { create } from 'zustand';
import { WordDefinition, SavedVocabularyItem } from '../types/vocabulary';
import { SubtitleCue } from '../types/subtitle';
import { lookupDictionaryWord } from '../constants/dictionaryData';

interface VocabularyState {
  activeLookup: WordDefinition | null;
  activeContextCue: SubtitleCue | null;
  activeVideoTitle: string;
  savedWords: SavedVocabularyItem[];

  // Actions
  openLookup: (rawWord: string, contextCue: SubtitleCue | null, videoTitle: string) => void;
  closeLookup: () => void;
  saveCurrentWord: () => void;
  removeSavedWord: (id: string) => void;
  isWordSaved: (word: string) => boolean;
}

export const useVocabularyStore = create<VocabularyState>((set, get) => ({
  activeLookup: null,
  activeContextCue: null,
  activeVideoTitle: '',
  savedWords: [],

  openLookup: (rawWord, contextCue, videoTitle) => {
    const definition = lookupDictionaryWord(rawWord, contextCue?.textEn);
    set({
      activeLookup: definition,
      activeContextCue: contextCue,
      activeVideoTitle: videoTitle,
    });
  },

  closeLookup: () => {
    set({
      activeLookup: null,
      activeContextCue: null,
    });
  },

  saveCurrentWord: () => {
    const { activeLookup, activeContextCue, activeVideoTitle, savedWords } = get();
    if (!activeLookup) return;

    const exists = savedWords.some(
      (item) => item.word.toLowerCase() === activeLookup.word.toLowerCase()
    );

    if (exists) {
      // Remove if already exists (toggle)
      set({
        savedWords: savedWords.filter(
          (item) => item.word.toLowerCase() !== activeLookup.word.toLowerCase()
        ),
      });
      return;
    }

    const newItem: SavedVocabularyItem = {
      id: `${activeLookup.word}-${Date.now()}`,
      word: activeLookup.word,
      phonetic: activeLookup.phonetic,
      definition: activeLookup.contextMeaning || activeLookup.definitions[0] || '',
      contextSentenceEn: activeContextCue?.textEn || activeLookup.sampleSentenceEn || '',
      contextSentenceZh: activeContextCue?.textZh || activeLookup.sampleSentenceZh || '',
      videoTitle: activeVideoTitle || 'EchoFlow Clip',
      videoTimestamp: activeContextCue?.startTime || 0,
      savedAt: Date.now(),
    };

    set({ savedWords: [newItem, ...savedWords] });
  },

  removeSavedWord: (id) => {
    set({
      savedWords: get().savedWords.filter((w) => w.id !== id),
    });
  },

  isWordSaved: (word) => {
    return get().savedWords.some(
      (item) => item.word.toLowerCase() === word.toLowerCase()
    );
  },
}));
