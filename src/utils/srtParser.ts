import { SubtitleCue } from '../types/subtitle';
import { tokenizeSentence } from './wordTokenizer';

/**
 * Converts timestamp string (SRT: 00:01:23,456 or VTT: 01:23.456) to seconds (float).
 */
export function parseTimestampToSeconds(timestamp: string): number {
  const clean = timestamp.trim().replace(',', '.');
  const parts = clean.split(':');

  if (parts.length === 3) {
    const hours = parseFloat(parts[0]);
    const minutes = parseFloat(parts[1]);
    const seconds = parseFloat(parts[2]);
    return hours * 3600 + minutes * 60 + seconds;
  } else if (parts.length === 2) {
    const minutes = parseFloat(parts[0]);
    const seconds = parseFloat(parts[1]);
    return minutes * 60 + seconds;
  }
  return 0;
}

/**
 * Strips HTML tags and clean formatting.
 */
function cleanText(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/\{[^}]+\}/g, '')
    .trim();
}

/**
 * Determines whether a string contains Chinese characters.
 */
export function hasChineseCharacters(text: string): boolean {
  return /[\u4e00-\u9fa5]/.test(text);
}

/**
 * Robust SRT / WebVTT parser.
 * Handles mixed bilingual subtitle blocks, multi-line blocks, and various line endings.
 */
export function parseSrtOrVtt(content: string): SubtitleCue[] {
  if (!content) return [];

  // Normalize line breaks
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Regex to match timestamp lines: e.g. 00:00:01,000 --> 00:00:04,000 or 00:01.000 --> 00:04.000
  const timeRegex = /((?:\d{1,2}:)?\d{2}:\d{2}[.,]\d{3})\s*-->\s*((?:\d{1,2}:)?\d{2}:\d{2}[.,]\d{3})/;

  // Split by double newline or numbered blocks
  const blocks = normalized.split(/\n\s*\n/);
  const cues: SubtitleCue[] = [];
  let cueId = 1;

  for (const block of blocks) {
    const lines = block
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) continue;

    let timeLineIndex = -1;
    let timeMatch: RegExpMatchArray | null = null;

    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(timeRegex);
      if (match) {
        timeLineIndex = i;
        timeMatch = match;
        break;
      }
    }

    if (timeLineIndex === -1 || !timeMatch) continue;

    const startTime = parseTimestampToSeconds(timeMatch[1]);
    const endTime = parseTimestampToSeconds(timeMatch[2]);

    const textLines = lines.slice(timeLineIndex + 1);
    if (textLines.length === 0) continue;

    let textEn = '';
    let textZh = '';

    // If block has multiple lines, inspect whether one is English and another is Chinese
    for (const rawLine of textLines) {
      const line = cleanText(rawLine);
      if (!line) continue;

      if (hasChineseCharacters(line)) {
        textZh = textZh ? `${textZh} ${line}` : line;
      } else {
        textEn = textEn ? `${textEn} ${line}` : line;
      }
    }

    // Fallback: If only English or only Chinese was detected
    if (!textEn && textZh) {
      textEn = textZh;
      textZh = '';
    }

    if (textEn) {
      cues.push({
        id: cueId++,
        startTime,
        endTime,
        textEn,
        textZh: textZh || undefined,
        words: tokenizeSentence(textEn, cueId),
      });
    }
  }

  // Sort by startTime
  cues.sort((a, b) => a.startTime - b.startTime);
  return cues;
}

/**
 * Finds the active cue index given the current playback time.
 * If playback time is in a gap between subtitles, finds the closest prior cue or returns -1.
 */
export function findActiveCueIndex(cues: SubtitleCue[], currentTime: number): number {
  if (!cues || cues.length === 0) return -1;

  // Exact interval match
  for (let i = 0; i < cues.length; i++) {
    if (currentTime >= cues[i].startTime && currentTime <= cues[i].endTime) {
      return i;
    }
  }

  // If in between cues, find if we are just slightly before or after
  for (let i = 0; i < cues.length; i++) {
    if (currentTime < cues[i].startTime) {
      return Math.max(0, i - 1);
    }
  }

  return cues.length - 1;
}
