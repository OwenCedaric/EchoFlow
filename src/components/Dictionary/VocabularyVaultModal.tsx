import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { useVocabularyStore } from '../../store/useVocabularyStore';
import { SavedVocabularyItem } from '../../types/vocabulary';

interface VocabularyVaultModalProps {
  visible: boolean;
  onClose: () => void;
}

export const VocabularyVaultModal: React.FC<VocabularyVaultModalProps> = ({
  visible,
  onClose,
}) => {
  const savedWords = useVocabularyStore((s) => s.savedWords);
  const removeSavedWord = useVocabularyStore((s) => s.removeSavedWord);

  const handleSpeak = (word: string) => {
    Speech.stop();
    Speech.speak(word, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.9,
    });
  };

  const renderWordItem = ({ item }: { item: SavedVocabularyItem }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.wordCol}>
            <View style={styles.wordRow}>
              <Text style={styles.wordText}>{item.word}</Text>
              <Text style={styles.phoneticText}>{item.phonetic}</Text>
              <TouchableOpacity
                onPress={() => handleSpeak(item.word)}
                style={styles.speakerBtn}
              >
                <Ionicons name="volume-high" size={16} color={THEME.colors.primary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.defText}>{item.definition}</Text>
          </View>

          <TouchableOpacity
            onPress={() => removeSavedWord(item.id)}
            style={styles.deleteBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={18} color={THEME.colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Video sentence context */}
        {item.contextSentenceEn ? (
          <View style={styles.contextContainer}>
            <Text style={styles.contextEn}>{item.contextSentenceEn}</Text>
            {item.contextSentenceZh ? (
              <Text style={styles.contextZh}>{item.contextSentenceZh}</Text>
            ) : null}
            <Text style={styles.videoSourceText}>来源：{item.videoTitle}</Text>
          </View>
        ) : null}
      </View>
    );
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

          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons name="bookmark" size={22} color={THEME.colors.primary} />
              <Text style={styles.title}>我的生词本 ({savedWords.length})</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={THEME.colors.textMuted} />
            </TouchableOpacity>
          </View>

          {savedWords.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="book-outline" size={48} color={THEME.colors.borderLight} />
              <Text style={styles.emptyTitle}>暂无生词收藏</Text>
              <Text style={styles.emptyDesc}>
                在字幕中轻点任意陌生单词，即可将其连同原视频语境一键加入生词本。
              </Text>
            </View>
          ) : (
            <FlatList
              data={savedWords}
              keyExtractor={(item) => item.id}
              renderItem={renderWordItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
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
    height: '80%',
    backgroundColor: THEME.colors.surfaceCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: THEME.colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: THEME.colors.surfaceElevated,
    borderRadius: THEME.spacing.radiusMd,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  wordCol: {
    flex: 1,
    paddingRight: 10,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wordText: {
    color: THEME.colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  phoneticText: {
    color: THEME.colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  speakerBtn: {
    padding: 2,
  },
  defText: {
    color: THEME.colors.textActiveCueZh,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  deleteBtn: {
    padding: 4,
  },
  contextContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.primary,
  },
  contextEn: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  contextZh: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  videoSourceText: {
    color: THEME.colors.textHint,
    fontSize: 11,
    marginTop: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 6,
  },
  emptyDesc: {
    color: THEME.colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
