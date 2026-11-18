import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { useVocabularyStore } from '../../store/useVocabularyStore';
import { usePlayerStore } from '../../store/usePlayerStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const WordDetailSheet: React.FC = () => {
  const activeLookup = useVocabularyStore((s) => s.activeLookup);
  const activeContextCue = useVocabularyStore((s) => s.activeContextCue);
  const closeLookup = useVocabularyStore((s) => s.closeLookup);
  const saveCurrentWord = useVocabularyStore((s) => s.saveCurrentWord);
  const isWordSaved = useVocabularyStore((s) =>
    activeLookup ? s.isWordSaved(activeLookup.word) : false
  );

  const resumeAfterLookup = usePlayerStore((s) => s.resumeAfterLookup);

  if (!activeLookup) return null;

  const handleClose = () => {
    closeLookup();
    resumeAfterLookup();
  };

  const handleSpeak = () => {
    Speech.stop();
    Speech.speak(activeLookup.word, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.9,
    });
  };

  return (
    <Modal
      visible={Boolean(activeLookup)}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        {/* Backdrop: Tap to close & auto-resume video */}
        <TouchableOpacity
          activeOpacity={1}
          style={styles.backdrop}
          onPress={handleClose}
        />

        {/* Half-screen bottom sheet */}
        <View style={styles.sheetContainer}>
          {/* Top handle bar */}
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sheetScrollContent}
          >
            {/* Header: Word, phonetic, TTS speaker, Close */}
            <View style={styles.headerRow}>
              <View style={styles.wordTitleBlock}>
                <Text style={styles.wordText}>{activeLookup.word}</Text>
                <View style={styles.phoneticRow}>
                  <Text style={styles.phoneticText}>{activeLookup.phonetic}</Text>
                  <TouchableOpacity
                    onPress={handleSpeak}
                    style={styles.speakerButton}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="volume-high" size={18} color={THEME.colors.primary} />
                  </TouchableOpacity>
                  <Text style={styles.posBadge}>{activeLookup.partOfSpeech}</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color={THEME.colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Context-aware meaning highlight card */}
            {activeLookup.contextMeaning && (
              <View style={styles.contextMeaningCard}>
                <View style={styles.contextHeader}>
                  <Ionicons name="sparkles" size={15} color={THEME.colors.primary} />
                  <Text style={styles.contextHeaderText}>当前视频语境释义</Text>
                </View>
                <Text style={styles.contextMeaningText}>
                  {activeLookup.contextMeaning}
                </Text>
              </View>
            )}

            {/* General definitions */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>词典核心释义</Text>
              {activeLookup.definitions.map((def, idx) => (
                <View key={idx} style={styles.defItem}>
                  <Text style={styles.defNumber}>{idx + 1}.</Text>
                  <Text style={styles.defText}>{def}</Text>
                </View>
              ))}
            </View>

            {/* Video Context Sentence with highlight */}
            {activeContextCue && (
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>原视频原句语境</Text>
                <View style={styles.contextSentenceContainer}>
                  <Text style={styles.sentenceEn}>{activeContextCue.textEn}</Text>
                  {activeContextCue.textZh && (
                    <Text style={styles.sentenceZh}>{activeContextCue.textZh}</Text>
                  )}
                </View>
              </View>
            )}

            {/* Action Buttons: Add to Vault & Close */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={saveCurrentWord}
                style={[
                  styles.vaultButton,
                  isWordSaved && styles.vaultButtonSaved,
                ]}
              >
                <Ionicons
                  name={isWordSaved ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color={isWordSaved ? '#0F1115' : THEME.colors.primary}
                />
                <Text
                  style={[
                    styles.vaultButtonText,
                    isWordSaved && styles.vaultButtonTextSaved,
                  ]}
                >
                  {isWordSaved ? '已收藏到生词本' : '收藏到生词本 (带语境卡片)'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleClose}
                style={styles.resumePlayButton}
              >
                <Ionicons name="play" size={16} color={THEME.colors.textPrimary} />
                <Text style={styles.resumePlayText}>关闭并继续播放</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheetContainer: {
    maxHeight: SCREEN_HEIGHT * 0.68,
    backgroundColor: THEME.colors.surfaceCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 20,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
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
  sheetScrollContent: {
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  wordTitleBlock: {
    flex: 1,
  },
  wordText: {
    color: THEME.colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  phoneticRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  phoneticText: {
    color: THEME.colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  speakerButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(252, 211, 77, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  posBadge: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    backgroundColor: THEME.colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contextMeaningCard: {
    backgroundColor: 'rgba(252, 211, 77, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(252, 211, 77, 0.25)',
    borderRadius: THEME.spacing.radiusMd,
    padding: 14,
    marginBottom: 16,
  },
  contextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  contextHeaderText: {
    color: THEME.colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  contextMeaningText: {
    color: '#FEF3C7',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  sectionBlock: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  defItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 2,
  },
  defNumber: {
    color: THEME.colors.primary,
    fontWeight: '700',
    marginRight: 6,
  },
  defText: {
    flex: 1,
    color: THEME.colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  contextSentenceContainer: {
    backgroundColor: THEME.colors.surfaceElevated,
    padding: 12,
    borderRadius: THEME.spacing.radiusMd,
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.primary,
  },
  sentenceEn: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  sentenceZh: {
    color: THEME.colors.textInactiveCueZh,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  actionButtonsContainer: {
    marginTop: 8,
    gap: 10,
  },
  vaultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: THEME.spacing.radiusFull,
    backgroundColor: 'rgba(252, 211, 77, 0.15)',
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  vaultButtonSaved: {
    backgroundColor: THEME.colors.primary,
  },
  vaultButtonText: {
    color: THEME.colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  vaultButtonTextSaved: {
    color: '#0F1115',
  },
  resumePlayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: THEME.spacing.radiusFull,
    backgroundColor: THEME.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  resumePlayText: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
});
