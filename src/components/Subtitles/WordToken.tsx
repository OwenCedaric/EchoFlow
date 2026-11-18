import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { SubtitleWord, SubtitleCue } from '../../types/subtitle';
import { THEME } from '../../constants/theme';
import { useVocabularyStore } from '../../store/useVocabularyStore';
import { usePlayerStore } from '../../store/usePlayerStore';

interface WordTokenProps {
  word: SubtitleWord;
  cue: SubtitleCue;
  isActiveCue: boolean;
  videoTitle: string;
}

export const WordToken: React.FC<WordTokenProps> = ({
  word,
  cue,
  isActiveCue,
  videoTitle,
}) => {
  const isSaved = useVocabularyStore((s) => s.isWordSaved(word.cleanWord));
  const openLookup = useVocabularyStore((s) => s.openLookup);
  const pauseForLookup = usePlayerStore((s) => s.pauseForLookup);

  if (!word.isClickable) {
    return (
      <Text
        style={[
          styles.text,
          isActiveCue ? styles.activeText : styles.inactiveText,
        ]}
      >
        {word.raw}
      </Text>
    );
  }

  const handlePress = () => {
    pauseForLookup();
    openLookup(word.cleanWord, cue, videoTitle);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.65}
      onPress={handlePress}
      hitSlop={{ top: 6, bottom: 6, left: 2, right: 2 }}
      style={[
        styles.touchable,
        isSaved && styles.savedWordContainer,
      ]}
    >
      <Text
        style={[
          styles.text,
          isActiveCue ? styles.activeText : styles.inactiveText,
          isSaved && styles.savedWordText,
        ]}
      >
        {word.raw}
      </Text>
      {isSaved && <View style={styles.savedDot} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    paddingHorizontal: 1,
    paddingVertical: 1,
    borderRadius: 4,
    position: 'relative',
  },
  text: {
    fontSize: THEME.typography.cueActiveEn.fontSize,
  },
  activeText: {
    color: THEME.colors.textActiveCueEn,
    fontWeight: '700',
  },
  inactiveText: {
    color: THEME.colors.textInactiveCueEn,
    fontWeight: '500',
  },
  savedWordContainer: {
    borderBottomWidth: 1.5,
    borderBottomColor: THEME.colors.primary,
  },
  savedWordText: {
    color: '#FEF08A',
  },
  savedDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.colors.primary,
  },
});
