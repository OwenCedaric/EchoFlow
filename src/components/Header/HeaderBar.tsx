import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { useLessonStore } from '../../store/useLessonStore';
import { useVocabularyStore } from '../../store/useVocabularyStore';
import { LessonSelectorModal } from './LessonSelectorModal';
import { VocabularyVaultModal } from '../Dictionary/VocabularyVaultModal';
import { UrlImportModal } from '../Modals/UrlImportModal';

export const HeaderBar: React.FC = () => {
  const currentLesson = useLessonStore((s) => s.currentLesson);
  const savedWordsCount = useVocabularyStore((s) => s.savedWords.length);

  const [showLessonSelector, setShowLessonSelector] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [showImport, setShowImport] = useState(false);

  return (
    <>
      <View style={styles.header}>
        {/* Brand Logo & Name */}
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Ionicons name="sparkles" size={16} color="#0F1115" />
          </View>
          <Text style={styles.brandTitle}>EchoFlow</Text>
        </View>

        {/* Lesson Selector Pill */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setShowLessonSelector(true)}
          style={styles.lessonSelectorPill}
        >
          <Text style={styles.lessonTitleText} numberOfLines={1}>
            {currentLesson.title}
          </Text>
          <Ionicons name="chevron-down" size={14} color={THEME.colors.textMuted} />
        </TouchableOpacity>

        {/* Action icons: Import URL & Vault */}
        <View style={styles.actionsRow}>
          {/* Custom URL Import */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowImport(true)}
            style={styles.iconBtn}
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
          >
            <Ionicons name="link-outline" size={20} color={THEME.colors.textPrimary} />
          </TouchableOpacity>

          {/* Vocabulary Vault */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowVault(true)}
            style={styles.iconBtn}
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
          >
            <Ionicons name="bookmark-outline" size={20} color={THEME.colors.textPrimary} />
            {savedWordsCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{savedWordsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Modals */}
      <LessonSelectorModal
        visible={showLessonSelector}
        onClose={() => setShowLessonSelector(false)}
      />
      <VocabularyVaultModal
        visible={showVault}
        onClose={() => setShowVault(false)}
      />
      <UrlImportModal
        visible={showImport}
        onClose={() => setShowImport(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 54,
    backgroundColor: THEME.colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  lessonSelectorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.spacing.radiusFull,
    maxWidth: 160,
    gap: 4,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  lessonTitleText: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: THEME.colors.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#0F1115',
    fontSize: 10,
    fontWeight: '800',
  },
});
