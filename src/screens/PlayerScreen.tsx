import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from '../constants/theme';
import { useLessonStore } from '../store/useLessonStore';
import { HeaderBar } from '../components/Header/HeaderBar';
import { VideoPlayerView } from '../components/Player/VideoPlayerView';
import { PlayerControlsBar } from '../components/Player/PlayerControlsBar';
import { SubtitleContainer } from '../components/Subtitles/SubtitleContainer';
import { WordDetailSheet } from '../components/Dictionary/WordDetailSheet';
import { ShadowingSheet } from '../components/Shadowing/ShadowingSheet';
import { SubtitleCue } from '../types/subtitle';

export const PlayerScreen: React.FC = () => {
  const currentLesson = useLessonStore((s) => s.currentLesson);
  const [shadowingCue, setShadowingCue] = useState<SubtitleCue | null>(null);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar style="light" />

      <View style={styles.container}>
        {/* Top Header */}
        <HeaderBar />

        {/* Video Player */}
        <VideoPlayerView lesson={currentLesson} />

        {/* Player Controls Bar */}
        <PlayerControlsBar />

        {/* Subtitles Scroll Area (~40% of screen height) */}
        <View style={styles.subtitlesWrapper}>
          <SubtitleContainer
            cues={currentLesson.subtitles}
            videoTitle={currentLesson.title}
            onOpenShadowing={(cue) => setShadowingCue(cue)}
          />
        </View>

        {/* Milestone 2: Instant Dictionary Bottom Sheet */}
        <WordDetailSheet />

        {/* Milestone 3: Echo & AI Scoring Shadowing Sheet */}
        <ShadowingSheet
          visible={Boolean(shadowingCue)}
          cue={shadowingCue}
          onClose={() => setShadowingCue(null)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  subtitlesWrapper: {
    flex: 1,
  },
});
