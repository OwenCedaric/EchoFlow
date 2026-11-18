import { SubtitleWord } from '../types/subtitle';

/**
 * Tokenizes an English sentence into clickable word tokens while preserving
 * whitespace and punctuation positions for natural reading flow.
 */
export function tokenizeSentence(sentence: string, cueId: number): SubtitleWord[] {
  if (!sentence) return [];

  // Match words (including contractions like don't, it's, father-in-law) or whitespace/punctuation
  const regex = /([a-zA-Z0-9]+(?:'[a-zA-Z]+)?(?:-[a-zA-Z]+)?)|([^a-zA-Z0-9\s]+)|(\s+)/g;
  const words: SubtitleWord[] = [];
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = regex.exec(sentence)) !== null) {
    const raw = match[0];
    const isWord = Boolean(match[1]);
    const cleanWord = isWord ? match[1].toLowerCase().replace(/[^a-zA-Z'-]/g, '') : '';

    words.push({
      id: `${cueId}-${index++}`,
      raw,
      cleanWord,
      isClickable: isWord && cleanWord.length > 0,
    });
  }

  return words;
}
