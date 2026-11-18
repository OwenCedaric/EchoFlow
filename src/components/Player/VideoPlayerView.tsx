import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { Lesson } from '../../types/lesson';
import { THEME } from '../../constants/theme';
import { usePlayerStore } from '../../store/usePlayerStore';
import { formatTime } from '../../utils/timeFormatter';

interface VideoPlayerViewProps {
  lesson: Lesson;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_HEIGHT = Math.round((SCREEN_WIDTH * 9) / 16);

export const VideoPlayerView: React.FC<VideoPlayerViewProps> = ({ lesson }) => {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const setPlaying = usePlayerStore((s) => s.setPlaying);
  const playbackRate = usePlayerStore((s) => s.playbackRate);
  const setCurrentTime = usePlayerStore((s) => s.setCurrentTime);
  const setDuration = usePlayerStore((s) => s.setDuration);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const isBuffering = usePlayerStore((s) => s.isBuffering);
  const setBuffering = usePlayerStore((s) => s.setBuffering);
  const seekTargetTime = usePlayerStore((s) => s.seekTargetTime);
  const clearSeekTarget = usePlayerStore((s) => s.clearSeekTarget);
  const isLoopingCue = usePlayerStore((s) => s.isLoopingCue);

  const [showHUD, setShowHUD] = useState(true);
  const [doubleTapFeedback, setDoubleTapFeedback] = useState<'-5s' | '+5s' | null>(null);

  const lastTapRef = useRef<number>(0);
  const lastTapXRef = useRef<number>(0);
  const hudTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize expo-video player
  const player = useVideoPlayer(lesson.videoUrl, (p) => {
    p.loop = false;
    p.preservesPitch = true;
    p.playbackRate = playbackRate;
    p.timeUpdateEventInterval = 0.1; // 100ms precision for silky-smooth subtitle tracking
  });

  // Keep player playbackRate synced
  useEffect(() => {
    if (player) {
      player.preservesPitch = true;
      player.playbackRate = playbackRate;
    }
  }, [player, playbackRate]);

  // Keep player playing status synced
  useEffect(() => {
    if (!player) return;
    if (isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  }, [player, isPlaying]);

  // Handle external seek requests (e.g. from subtitle click, loop reset, rewind button)
  useEffect(() => {
    if (player && seekTargetTime !== null) {
      player.currentTime = seekTargetTime;
      clearSeekTarget();
    }
  }, [player, seekTargetTime, clearSeekTarget]);

  // Event listeners for player status, time updates, and buffering
  useEffect(() => {
    if (!player) return;

    const timeUpdateSub = player.addListener('timeUpdate', (payload) => {
      setCurrentTime(payload.currentTime, lesson.subtitles);
    });

    const statusSub = player.addListener('statusChange', (payload) => {
      if (payload.status === 'loading') {
        setBuffering(true);
      } else if (payload.status === 'readyToPlay') {
        setBuffering(false);
      } else if (payload.status === 'error') {
        setBuffering(false);
      }
    });

    const playingSub = player.addListener('playingChange', (payload) => {
      setPlaying(payload.isPlaying);
    });

    const sourceLoadSub = player.addListener('sourceLoad', (payload) => {
      if (payload.duration) {
        setDuration(payload.duration);
      }
    });

    return () => {
      timeUpdateSub.remove();
      statusSub.remove();
      playingSub.remove();
      sourceLoadSub.remove();
    };
  }, [player, lesson, setCurrentTime, setDuration, setBuffering, setPlaying]);

  // Auto-hide HUD after 3 seconds of inactivity when playing
  useEffect(() => {
    if (hudTimeoutRef.current) clearTimeout(hudTimeoutRef.current);
    if (showHUD && isPlaying) {
      hudTimeoutRef.current = setTimeout(() => {
        setShowHUD(false);
      }, 3500);
    }
  }, [showHUD, isPlaying]);

  // Gesture handling: single tap for HUD, double-tap left for -5s, right for +5s
  const handleTouchZone = (evt: any) => {
    const now = Date.now();
    const tapX = evt.nativeEvent.locationX;
    const isDoubleTap = now - lastTapRef.current < 300;

    if (isDoubleTap) {
      // Double tap action
      if (hudTimeoutRef.current) clearTimeout(hudTimeoutRef.current);

      if (tapX < SCREEN_WIDTH * 0.45) {
        // Double tap left: -5s
        player.seekBy(-5);
        setDoubleTapFeedback('-5s');
        setTimeout(() => setDoubleTapFeedback(null), 700);
      } else if (tapX > SCREEN_WIDTH * 0.55) {
        // Double tap right: +5s
        player.seekBy(5);
        setDoubleTapFeedback('+5s');
        setTimeout(() => setDoubleTapFeedback(null), 700);
      }
    } else {
      // Single tap: toggle HUD
      setShowHUD((prev) => !prev);
    }

    lastTapRef.current = now;
    lastTapXRef.current = tapX;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* Video Surface */}
      <VideoView
        player={player}
        style={styles.videoView}
        nativeControls={false}
        contentFit="contain"
      />

      {/* Touch Overlay for Gestures */}
      <TouchableWithoutFeedback onPress={handleTouchZone}>
        <View style={styles.touchOverlay}>
          {/* Double Tap Feedback Animation */}
          {doubleTapFeedback && (
            <View
              style={[
                styles.feedbackOverlay,
                doubleTapFeedback === '-5s' ? styles.feedbackLeft : styles.feedbackRight,
              ]}
            >
              <Ionicons
                name={doubleTapFeedback === '-5s' ? 'play-back' : 'play-forward'}
                size={32}
                color={THEME.colors.primary}
              />
              <Text style={styles.feedbackText}>{doubleTapFeedback}</Text>
            </View>
          )}

          {/* Buffering Indicator */}
          {isBuffering && (
            <View style={styles.bufferingContainer}>
              <ActivityIndicator size="large" color={THEME.colors.primary} />
            </View>
          )}

          {/* HUD Overlay */}
          {showHUD && (
            <View style={styles.hudContainer}>
              {/* Loop badge if A-B loop active */}
              {isLoopingCue && (
                <View style={styles.loopBadge}>
                  <Ionicons name="repeat" size={14} color={THEME.colors.primary} />
                  <Text style={styles.loopBadgeText}>单句洗脑循环中</Text>
                </View>
              )}

              {/* Center Play / Pause icon */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setPlaying(!isPlaying)}
                style={styles.centerPlayButton}
              >
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={32}
                  color={THEME.colors.textPrimary}
                  style={!isPlaying ? { marginLeft: 3 } : undefined}
                />
              </TouchableOpacity>

              {/* Bottom HUD: Progress Bar & Timestamps */}
              <View style={styles.bottomHud}>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                </View>

                <View style={styles.timeRow}>
                  <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                  <Text style={styles.timeText}>{formatTime(duration)}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: VIDEO_HEIGHT,
    backgroundColor: '#000000',
    position: 'relative',
  },
  videoView: {
    width: '100%',
    height: '100%',
  },
  touchOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hudContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerPlayButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(15, 17, 21, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  loopBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 17, 21, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.spacing.radiusFull,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  loopBadgeText: {
    color: THEME.colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  bufferingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  feedbackOverlay: {
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 17, 21, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: THEME.spacing.radiusMd,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  feedbackLeft: {
    left: 40,
  },
  feedbackRight: {
    right: 40,
  },
  feedbackText: {
    color: THEME.colors.primary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  bottomHud: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingBottom: 6,
  },
  progressBarBackground: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: THEME.colors.primary,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    color: '#D1D5DB',
    fontSize: 11,
    fontWeight: '500',
  },
});
