import { describe, it } from 'node:test';
import assert from 'node:assert';
import { parseTimestampToSeconds, parseSrtOrVtt, findActiveCueIndex } from '../srtParser';
import { tokenizeSentence } from '../wordTokenizer';
import { lookupDictionaryWord } from '../../constants/dictionaryData';

describe('SRT & VTT Parser', () => {
  it('should parse timestamps in various formats', () => {
    assert.strictEqual(parseTimestampToSeconds('00:01:23,456'), 83.456);
    assert.strictEqual(parseTimestampToSeconds('00:01:23.456'), 83.456);
    assert.strictEqual(parseTimestampToSeconds('01:23.500'), 83.5);
    assert.strictEqual(parseTimestampToSeconds('00:00.000'), 0);
  });

  it('should parse bilingual SRT blocks accurately', () => {
    const srt = `
1
00:00:01,000 --> 00:00:04,500
Connecting the dots.
串联起生命中的点点滴滴。

2
00:00:05,000 --> 00:00:08,200
You have to trust in something.
你必须有所坚信。
`;
    const cues = parseSrtOrVtt(srt);
    assert.strictEqual(cues.length, 2);
    assert.strictEqual(cues[0].startTime, 1);
    assert.strictEqual(cues[0].endTime, 4.5);
    assert.strictEqual(cues[0].textEn, 'Connecting the dots.');
    assert.strictEqual(cues[0].textZh, '串联起生命中的点点滴滴。');
    assert.strictEqual(cues[1].textEn, 'You have to trust in something.');
    assert.strictEqual(cues[1].textZh, '你必须有所坚信。');
  });

  it('should clean HTML tags in subtitles', () => {
    const srt = `
1
00:00:01,000 --> 00:00:03,000
<b>Stay hungry</b>, <i>stay foolish</i>.
保持饥饿，保持愚蠢。
`;
    const cues = parseSrtOrVtt(srt);
    assert.strictEqual(cues[0].textEn, 'Stay hungry, stay foolish.');
  });

  it('should find active cue index based on current playback time', () => {
    const srt = `
1
00:00:01,000 --> 00:00:04,000
First sentence.

2
00:00:05,000 --> 00:00:08,000
Second sentence.
`;
    const cues = parseSrtOrVtt(srt);
    assert.strictEqual(findActiveCueIndex(cues, 0.5), 0); // Before first cue
    assert.strictEqual(findActiveCueIndex(cues, 2.5), 0); // Inside first cue
    assert.strictEqual(findActiveCueIndex(cues, 4.5), 0); // Gap between first and second cue
    assert.strictEqual(findActiveCueIndex(cues, 6.2), 1); // Inside second cue
    assert.strictEqual(findActiveCueIndex(cues, 10.0), 1); // Beyond second cue
  });
});

describe('Word Tokenizer', () => {
  it('should split sentences into clickable words and preserve punctuation', () => {
    const sentence = "I didn't graduate from college, but I learned calligraphy.";
    const tokens = tokenizeSentence(sentence, 1);

    const wordsOnly = tokens.filter((t) => t.isClickable).map((t) => t.cleanWord);
    assert.ok(wordsOnly.includes("didn't"));
    assert.ok(wordsOnly.includes('graduate'));
    assert.ok(wordsOnly.includes('calligraphy'));
  });

  it('should handle hyphenated compound words like sans-serif', () => {
    const sentence = 'serif and sans-serif typefaces';
    const tokens = tokenizeSentence(sentence, 2);
    const wordsOnly = tokens.filter((t) => t.isClickable).map((t) => t.cleanWord);
    assert.ok(wordsOnly.includes('sans-serif'));
    assert.ok(wordsOnly.includes('typefaces'));
  });
});

describe('Dictionary Context Lookup', () => {
  it('should find predefined vocabulary definitions with context meaning', () => {
    const result = lookupDictionaryWord('connecting', 'The first story is about connecting the dots.');
    assert.strictEqual(result.word, 'connecting');
    assert.ok(result.contextMeaning);
    assert.ok(result.phonetic.includes('/'));
  });

  it('should provide intelligent fallback for unknown words', () => {
    const result = lookupDictionaryWord('serendipity', 'Life has serendipity.');
    assert.strictEqual(result.word, 'serendipity');
    assert.strictEqual(result.partOfSpeech, 'vocabulary word');
  });
});
