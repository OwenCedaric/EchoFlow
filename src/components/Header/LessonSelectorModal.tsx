import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Lesson } from '../../types/lesson';
import { THEME } from '../../constants/theme';
import { useLessonStore } from '../../store/useLessonStore';
import { usePlayerStore } from '../../store/usePlayerStore';

interface LessonSelectorModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LessonSelectorModal: React.FC<LessonSelectorModalProps> = ({
  visible,
  onClose,
}) => {
  const lessons = useLessonStore((s) => s.lessons);
  const currentLesson = useLessonStore((s) => s.currentLesson);
  const selectLesson = useLessonStore((s) => s.selectLesson);
  const resetPlayer = usePlayerStore((s) => s.resetPlayer);

  const handleSelect = (lesson: Lesson) => {
    if (lesson.id !== currentLesson.id) {
      resetPlayer();
      selectLesson(lesson.id);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity activeOpacity={1} style={styles.backdrop} onPress={onClose} />

        <View style={styles.dialogContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>选择精听素材</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={THEME.colors.textMuted} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={lessons}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isSelected = item.id === currentLesson.id;
              return (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => handleSelect(item)}
                  style={[
                    styles.lessonCard,
                    isSelected && styles.lessonCardSelected,
                  ]}
                >
                  <View style={styles.lessonInfo}>
                    <View style={styles.titleRow}>
                      <Text style={[styles.lessonTitle, isSelected && styles.lessonTitleActive]}>
                        {item.title}
                      </Text>
                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={18}
                          color={THEME.colors.primary}
                        />
                      )}
                    </View>
                    <Text style={styles.speakerText}>{item.speaker}</Text>
                    <Text style={styles.descText} numberOfLines={2}>
                      {item.description}
                    </Text>

                    <View style={styles.badgeRow}>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.subtitles.length} 句字幕</Text>
                      </View>
                      <View style={[styles.badge, styles.diffBadge]}>
                        <Text style={styles.diffBadgeText}>{item.difficulty}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  dialogContainer: {
    width: '100%',
    maxHeight: '75%',
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    paddingBottom: 8,
  },
  lessonCard: {
    backgroundColor: THEME.colors.surfaceElevated,
    borderRadius: THEME.spacing.radiusMd,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  lessonCardSelected: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(252, 211, 77, 0.08)',
  },
  lessonInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonTitle: {
    flex: 1,
    color: THEME.colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginRight: 8,
  },
  lessonTitleActive: {
    color: THEME.colors.primary,
  },
  speakerText: {
    color: THEME.colors.secondary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 4,
  },
  descText: {
    color: THEME.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  diffBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  diffBadgeText: {
    color: '#818CF8',
    fontSize: 11,
    fontWeight: '600',
  },
});
