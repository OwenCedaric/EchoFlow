import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SubtitleCue } from '../../types/subtitle';
import { THEME } from '../../constants/theme';
import { usePlayerStore } from '../../store/usePlayerStore';
import { SubtitleCueItem } from './SubtitleCueItem';

interface SubtitleContainerProps {
  cues: SubtitleCue[];
  videoTitle: string;
  onOpenShadowing?: (cue: SubtitleCue) => void;
}

export const SubtitleContainer: React.FC<SubtitleContainerProps> = ({
  cues,
  videoTitle,
  onOpenShadowing,
}) => {
  const flatListRef = useRef<FlatList<SubtitleCue>>(null);
  const activeCueIndex = usePlayerStore((s) => s.activeCueIndex);
  const isLoopingCue = usePlayerStore((s) => s.isLoopingCue);
  const loopCueIndex = usePlayerStore((s) => s.loopCueIndex);
  const subtitleMode = usePlayerStore((s) => s.subtitleMode);
  const cycleSubtitleMode = usePlayerStore((s) => s.cycleSubtitleMode);

  const [isUserScrolledAway, setIsUserScrolledAway] = useState(false);
  const autoScrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-scroll to active cue (Apple Music lyrics style)
  useEffect(() => {
    if (activeCueIndex >= 0 && activeCueIndex < cues.length && !isUserScrolledAway) {
      try {
        flatListRef.current?.scrollToIndex({
          index: activeCueIndex,
          animated: true,
          viewPosition: 0.35, // Position active cue slightly above center for optimal viewing
        });
      } catch {
        // Fallback for initial layout calculation
        flatListRef.current?.scrollToOffset({
          offset: Math.max(0, activeCueIndex * 70 - 100),
          animated: true,
        });
      }
    }
  }, [activeCueIndex, isUserScrolledAway, cues.length]);

  const handleScrollBeginDrag = () => {
    setIsUserScrolledAway(true);
    if (autoScrollTimer.current) clearTimeout(autoScrollTimer.current);
  };

  const handleScrollEndDrag = () => {
    // If user paused scrolling, resume auto-tracking after 5 seconds
    if (autoScrollTimer.current) clearTimeout(autoScrollTimer.current);
    autoScrollTimer.current = setTimeout(() => {
      setIsUserScrolledAway(false);
    }, 5000);
  };

  const scrollToActive = () => {
    setIsUserScrolledAway(false);
    if (activeCueIndex >= 0 && activeCueIndex < cues.length) {
      flatListRef.current?.scrollToIndex({
        index: activeCueIndex,
        animated: true,
        viewPosition: 0.35,
      });
    }
  };

  // Blind listening mode state
  if (subtitleMode === 'hidden') {
    return (
      <View style={styles.blindModeContainer}>
        <Ionicons name="headset" size={42} color={THEME.colors.textMuted} />
        <Text style={styles.blindModeTitle}>盲听精听模式已开启</Text>
        <Text style={styles.blindModeDesc}>
          字幕已隐藏，专注捕捉英语原声音调与连读。
        </Text>
        <TouchableOpacity
          onPress={cycleSubtitleMode}
          activeOpacity={0.8}
          style={styles.revealButton}
        >
          <Ionicons name="eye-outline" size={18} color={THEME.colors.textPrimary} />
          <Text style={styles.revealButtonText}>显示双语字幕</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={cues}
        keyExtractor={(item) => `cue-${item.id}`}
        renderItem={({ item, index }) => (
          <SubtitleCueItem
            cue={item}
            index={index}
            isActive={index === activeCueIndex}
            isLooping={isLoopingCue && loopCueIndex === index}
            subtitleMode={subtitleMode}
            videoTitle={videoTitle}
            onOpenShadowing={onOpenShadowing}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        onScrollToIndexFailed={(info) => {
          flatListRef.current?.scrollToOffset({
            offset: info.index * 65,
            animated: true,
          });
        }}
      />

      {/* Floating button to snap back to current sentence if user scrolled away */}
      {isUserScrolledAway && activeCueIndex >= 0 && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={scrollToActive}
          style={styles.syncButton}
        >
          <Ionicons name="locate" size={16} color={THEME.colors.primary} />
          <Text style={styles.syncButtonText}>回到当前句</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.surfaceSubtitles,
    position: 'relative',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 40,
  },
  syncButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceElevated,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: THEME.spacing.radiusFull,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    gap: 6,
  },
  syncButtonText: {
    color: THEME.colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  blindModeContainer: {
    flex: 1,
    backgroundColor: THEME.colors.surfaceSubtitles,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  blindModeTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 6,
  },
  blindModeDesc: {
    color: THEME.colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  revealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: THEME.colors.surfaceElevated,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: THEME.spacing.radiusFull,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  revealButtonText: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
});
