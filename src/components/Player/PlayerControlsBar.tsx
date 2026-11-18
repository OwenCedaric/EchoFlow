import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { usePlayerStore } from '../../store/usePlayerStore';
import { SubtitleMode } from '../../types/subtitle';

export const PlayerControlsBar: React.FC = () => {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const setPlaying = usePlayerStore((s) => s.setPlaying);
  const playbackRate = usePlayerStore((s) => s.playbackRate);
  const cyclePlaybackRate = usePlayerStore((s) => s.cyclePlaybackRate);
  const isLoopingCue = usePlayerStore((s) => s.isLoopingCue);
  const toggleLoopCue = usePlayerStore((s) => s.toggleLoopCue);
  const subtitleMode = usePlayerStore((s) => s.subtitleMode);
  const cycleSubtitleMode = usePlayerStore((s) => s.cycleSubtitleMode);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const requestSeek = usePlayerStore((s) => s.requestSeek);

  const getSubtitleModeLabel = (mode: SubtitleMode) => {
    switch (mode) {
      case 'bilingual':
        return '中英双显';
      case 'en_only':
        return '仅英文';
      case 'zh_only':
        return '仅中文';
      case 'hidden':
        return '盲听隐藏';
    }
  };

  const handleRewind5s = () => {
    requestSeek(Math.max(0, currentTime - 5));
  };

  const handleForward5s = () => {
    requestSeek(currentTime + 5);
  };

  return (
    <View style={styles.container}>
      {/* Top functional row: Speed, A-B Loop, Subtitle Mode */}
      <View style={styles.topRow}>
        {/* Playback speed pill */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={cyclePlaybackRate}
          style={[styles.pillButton, playbackRate !== 1.0 && styles.pillButtonActive]}
          hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
        >
          <Ionicons
            name="speedometer-outline"
            size={16}
            color={playbackRate !== 1.0 ? THEME.colors.primary : THEME.colors.textMuted}
          />
          <Text
            style={[
              styles.pillText,
              playbackRate !== 1.0 && styles.pillTextActive,
            ]}
          >
            {playbackRate}x
          </Text>
        </TouchableOpacity>

        {/* Single Sentence Loop (A-B Loop) pill */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => toggleLoopCue()}
          style={[styles.pillButton, isLoopingCue && styles.pillButtonActive]}
          hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
        >
          <Ionicons
            name="repeat"
            size={16}
            color={isLoopingCue ? THEME.colors.primary : THEME.colors.textMuted}
          />
          <Text
            style={[
              styles.pillText,
              isLoopingCue && styles.pillTextActive,
            ]}
          >
            单句循环
          </Text>
        </TouchableOpacity>

        {/* Subtitle visibility mode pill */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={cycleSubtitleMode}
          style={[
            styles.pillButton,
            subtitleMode === 'hidden' && styles.pillButtonBlindMode,
          ]}
          hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
        >
          <Ionicons
            name={subtitleMode === 'hidden' ? 'eye-off-outline' : 'chatbox-ellipses-outline'}
            size={16}
            color={subtitleMode === 'hidden' ? THEME.colors.warning : THEME.colors.textMuted}
          />
          <Text
            style={[
              styles.pillText,
              subtitleMode === 'hidden' && styles.pillTextBlindMode,
            ]}
          >
            {getSubtitleModeLabel(subtitleMode)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main playback control row: Large touch targets > 44dp */}
      <View style={styles.mainControlsRow}>
        {/* Fast Rewind 5s */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleRewind5s}
          style={styles.touchControlItem}
        >
          <Ionicons name="play-back-outline" size={24} color={THEME.colors.textPrimary} />
          <Text style={styles.subtext}>-5s</Text>
        </TouchableOpacity>

        {/* Main Play / Pause Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setPlaying(!isPlaying)}
          style={styles.playPauseButton}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={28}
            color="#0F1115"
            style={!isPlaying ? { marginLeft: 3 } : undefined}
          />
        </TouchableOpacity>

        {/* Fast Forward 5s */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleForward5s}
          style={styles.touchControlItem}
        >
          <Ionicons name="play-forward-outline" size={24} color={THEME.colors.textPrimary} />
          <Text style={styles.subtext}>+5s</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.background,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: THEME.colors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: THEME.spacing.radiusFull,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    minHeight: 36,
  },
  pillButtonActive: {
    backgroundColor: 'rgba(252, 211, 77, 0.15)',
    borderColor: THEME.colors.primary,
  },
  pillButtonBlindMode: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: THEME.colors.warning,
  },
  pillText: {
    color: THEME.colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  pillTextActive: {
    color: THEME.colors.primary,
  },
  pillTextBlindMode: {
    color: THEME.colors.warning,
  },
  mainControlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 36,
  },
  touchControlItem: {
    width: THEME.spacing.minTouchTarget,
    height: THEME.spacing.minTouchTarget,
    borderRadius: THEME.spacing.minTouchTarget / 2,
    backgroundColor: THEME.colors.surfaceCard,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  subtext: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    marginTop: -2,
  },
  playPauseButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
