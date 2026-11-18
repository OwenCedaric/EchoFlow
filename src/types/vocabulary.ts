export interface WordDefinition {
  word: string;
  phonetic: string;
  audioUrl?: string;
  partOfSpeech: string;
  definitions: string[];
  contextMeaning?: string; // Meaning specifically fitted to the video sentence context
  sampleSentenceEn?: string;
  sampleSentenceZh?: string;
}

export interface SavedVocabularyItem {
  id: string;
  word: string;
  phonetic: string;
  definition: string;
  contextSentenceEn: string;
  contextSentenceZh?: string;
  videoTitle: string;
  videoTimestamp: number;
  savedAt: number;
}
