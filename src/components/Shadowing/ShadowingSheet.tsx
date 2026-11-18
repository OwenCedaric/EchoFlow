import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { SubtitleCue } from '../../types/subtitle';
import { THEME } from '../../constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ShadowingSheetProps {
  visible: boolean;
  cue: SubtitleCue | null;
  onClose: () => void;
}

interface ScoredWord {
  word: string;
  score: number; // 0-100
  status: 'green' | 'yellow' | 'red';
}

export const ShadowingSheet: React.FC<ShadowingSheetProps> = ({
  visible,
  cue,
  onClose,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<{
    overallScore: number;
    scoredWords: ScoredWord[];
    tip: string;
  } | null>(null);

  if (!cue) return null;

  const handlePlayOriginal = (rate: number = 0.9) => {
    Speech.stop();
    Speech.speak(cue.textEn, {
      language: 'en-US',
      rate,
      pitch: 1.0,
    });
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      // Stop recording and run AI evaluation simulation
      setIsRecording(false);
      setIsEvaluating(true);

      setTimeout(() => {
        setIsEvaluating(false);

        // Score words based on length and syllable complexity
        const scored: ScoredWord[] = cue.words
          .filter((w) => w.isClickable)
          .map((w, index) => {
            // Realistic simulation with mostly green/yellow
            const randomScore = index % 3 === 2 ? 68 : 88 + ((index * 7) % 11);
            let status: 'green' | 'yellow' | 'red' = 'green';
            if (randomScore < 70) status = 'red';
            else if (randomScore < 85) status = 'yellow';

            return {
              word: w.cleanWord,
              score: randomScore,
              status,
            };
          });

        const overall = Math.round(
          scored.reduce((acc, curr) => acc + curr.score, 0) / (scored.length || 1)
        );

        setEvalResult({
          overallScore: overall,
          scoredWords: scored,
          tip: '注意词尾辅音的爆破音，保持语调自然上扬。',
        });
      }, 1200);
    } else {
      // Start recording
      setEvalResult(null);
      setIsRecording(true);
    }
  };

  const getWordColor = (status: 'green' | 'yellow' | 'red') => {
    switch (status) {
      case 'green':
        return '#34D399'; // Emerald green
      case 'yellow':
        return '#FBBF24'; // Amber yellow
      case 'red':
        return '#F87171'; // Coral red
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity activeOpacity={1} style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheetContainer}>
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleWithIcon}>
              <Ionicons name="mic" size={20} color={THEME.colors.primary} />
              <Text style={styles.sheetTitle}>口语跟读与 AI 纠音</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color={THEME.colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Target Sentence Box */}
          <View style={styles.targetSentenceBox}>
            <Text style={styles.sentenceEn}>{cue.textEn}</Text>
            {cue.textZh && <Text style={styles.sentenceZh}>{cue.textZh}</Text>}

            {/* Play controls for listening to native audio */}
            <View style={styles.listenButtonsRow}>
              <TouchableOpacity
                onPress={() => handlePlayOriginal(1.0)}
                style={styles.listenButton}
              >
                <Ionicons name="volume-high" size={16} color={THEME.colors.primary} />
                <Text style={styles.listenButtonText}>标准原速 1.0x</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handlePlayOriginal(0.75)}
                style={styles.listenButton}
              >
                <Ionicons name="play-back" size={16} color={THEME.colors.secondary} />
                <Text style={styles.listenButtonText}>慢速精听 0.75x</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* AI Pronunciation Evaluation Results */}
          {isEvaluating && (
            <View style={styles.evaluatingBox}>
              <ActivityIndicator size="small" color={THEME.colors.primary} />
              <Text style={styles.evaluatingText}>AI 语音识别与发音评测中...</Text>
            </View>
          )}

          {evalResult && (
            <View style={styles.resultBox}>
              <View style={styles.scoreRow}>
                <View style={styles.scoreCircle}>
                  <Text style={styles.scoreNumber}>{evalResult.overallScore}</Text>
                  <Text style={styles.scoreLabel}>综合得分</Text>
                </View>
                <View style={styles.scoreSummary}>
                  <Text style={styles.scoreFeedbackTitle}>
                    {evalResult.overallScore >= 80 ? '发音极佳，继续保持！' : '表现不错，局部稍作精进'}
                  </Text>
                  <Text style={styles.scoreTip}>{evalResult.tip}</Text>
                </View>
              </View>

              {/* Word by word breakdown with color coding */}
              <View style={styles.wordScoreRow}>
                {evalResult.scoredWords.map((item, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.wordScoreChip,
                      { borderColor: getWordColor(item.status) },
                    ]}
                  >
                    <Text
                      style={[
                        styles.wordScoreText,
                        { color: getWordColor(item.status) },
                      ]}
                    >
                      {item.word}
                    </Text>
                    <Text style={styles.wordScoreNumber}>{item.score}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Big Recording Button */}
          <View style={styles.recordSection}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleToggleRecord}
              style={[
                styles.recordCircle,
                isRecording && styles.recordCircleActive,
              ]}
            >
              <Ionicons
                name={isRecording ? 'stop' : 'mic'}
                size={34}
                color={isRecording ? '#FFFFFF' : '#0F1115'}
              />
            </TouchableOpacity>
            <Text style={styles.recordPrompt}>
              {isRecording
                ? '正在拾音中，点击停止录音并评测'
                : evalResult
                ? '点击再次录音跟读'
                : '点击麦克风开始朗读跟读'}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheetContainer: {
    maxHeight: SCREEN_HEIGHT * 0.75,
    backgroundColor: THEME.colors.surfaceCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  dragHandleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.colors.borderLight,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sheetTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetSentenceBox: {
    backgroundColor: THEME.colors.surfaceElevated,
    borderRadius: THEME.spacing.radiusMd,
    padding: 16,
    marginBottom: 16,
  },
  sentenceEn: {
    color: THEME.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  sentenceZh: {
    color: THEME.colors.textInactiveCueZh,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  listenButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  listenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.spacing.radiusFull,
  },
  listenButtonText: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  evaluatingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  evaluatingText: {
    color: THEME.colors.textMuted,
    fontSize: 14,
  },
  resultBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: THEME.spacing.radiusMd,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  scoreCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    borderWidth: 2,
    borderColor: '#34D399',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreNumber: {
    color: '#34D399',
    fontSize: 20,
    fontWeight: '800',
  },
  scoreLabel: {
    color: '#34D399',
    fontSize: 9,
    fontWeight: '600',
    marginTop: -2,
  },
  scoreSummary: {
    flex: 1,
  },
  scoreFeedbackTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  scoreTip: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  wordScoreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wordScoreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: THEME.colors.surfaceElevated,
    borderWidth: 1,
  },
  wordScoreText: {
    fontSize: 13,
    fontWeight: '700',
  },
  wordScoreNumber: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  recordSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  recordCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  recordCircleActive: {
    backgroundColor: THEME.colors.danger,
    shadowColor: THEME.colors.danger,
  },
  recordPrompt: {
    color: THEME.colors.textMuted,
    fontSize: 13,
    marginTop: 12,
    fontWeight: '500',
  },
});
