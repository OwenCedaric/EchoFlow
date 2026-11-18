import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SubtitleCue, SubtitleMode } from '../../types/subtitle';
import { THEME } from '../../constants/theme';
import { WordToken } from './WordToken';
import { usePlayerStore } from '../../store/usePlayerStore';

interface SubtitleCueItemProps {
  cue: SubtitleCue;
  index: number;
  isActive: boolean;
  isLooping: boolean;
  subtitleMode: SubtitleMode;
  videoTitle: string;
  onOpenShadowing?: (cue: SubtitleCue) => void;
}

export const SubtitleCueItem: React.FC<SubtitleCueItemProps> = ({
  cue,
  index,
  isActive,
  isLooping,
  subtitleMode,
  videoTitle,
  onOpenShadowing,
}) => {
  const requestSeek = usePlayerStore((s) => s.requestSeek);
  const toggleLoopCue = usePlayerStore((s) => s.toggleLoopCue);

  const showEnglish = subtitleMode === 'bilingual' || subtitleMode === 'en_only';
  const showChinese =
    (subtitleMode === 'bilingual' || subtitleMode === 'zh_only') && Boolean(cue.textZh);

  const handleSeekCue = () => {
    requestSeek(cue.startTime);
  };

  const handleToggleLoop = () => {
    toggleLoopCue(index);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleSeekCue}
      style={[
        styles.container,
        isActive && styles.activeContainer,
      ]}
    >
      {/* Active sentence accent bar */}
      <View style={[styles.accentIndicator, isActive && styles.accentIndicatorActive]} />

      <View style={styles.contentColumn}>
        {/* English row */}
        {showEnglish && (
          <View style={styles.wordsRow}>
            {cue.words.map((word) => (
              <WordToken
                key={word.id}
                word={word}
                cue={cue}
                isActiveCue={isActive}
                videoTitle={videoTitle}
              />
            ))}
          </View>
        )}

        {/* Chinese translation row */}
        {showChinese && (
          <Text
            style={[
              styles.chineseText,
              isActive ? styles.chineseTextActive : styles.chineseTextInactive,
            ]}
          >
            {cue.textZh}
          </Text>
        )}
      </View>

      {/* Action shortcuts for active cue */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          onPress={handleToggleLoop}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={[styles.iconButton, isLooping && styles.iconButtonLooping]}
        >
          <Ionicons
            name="repeat"
            size={16}
            color={isLooping ? THEME.colors.primary : THEME.colors.textMuted}
          />
        </TouchableOpacity>

        {onOpenShadowing && (
          <TouchableOpacity
            onPress={() => onOpenShadowing(cue)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.iconButton}
          >
            <Ionicons name="mic-outline" size={16} color={THEME.colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: THEME.spacing.radiusMd,
    marginVertical: 4,
    backgroundColor: 'transparent',
    minHeight: 52,
  },
  activeContainer: {
    backgroundColor: THEME.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: 'rgba(252, 211, 77, 0.25)',
  },
  accentIndicator: {
    width: 3,
    height: '100%',
    borderRadius: 2,
    backgroundColor: 'transparent',
    marginRight: 10,
    marginTop: 2,
  },
  accentIndicatorActive: {
    backgroundColor: THEME.colors.primary,
  },
  contentColumn: {
    flex: 1,
    paddingRight: 8,
  },
  wordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  chineseText: {
    marginTop: 6,
    fontSize: THEME.typography.cueActiveZh.fontSize,
    lineHeight: THEME.typography.cueActiveZh.lineHeight,
  },
  chineseTextActive: {
    color: THEME.colors.textActiveCueZh,
    fontWeight: '500',
  },
  chineseTextInactive: {
    color: THEME.colors.textInactiveCueZh,
    fontWeight: '400',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 2,
  },
  iconButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonLooping: {
    backgroundColor: 'rgba(252, 211, 77, 0.2)',
  },
});
