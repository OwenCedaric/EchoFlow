export const THEME = {
  colors: {
    // Dark mode primary surfaces
    background: '#0F1115', // Deep Midnight
    surface: '#161920',
    surfaceSubtitles: '#1A1D24', // Dedicated Subtitle scroll background
    surfaceElevated: '#222630',
    surfaceCard: '#1E222A',
    surfaceHighlight: '#2A303C',

    // Text hierarchy
    textPrimary: '#FFFFFF',
    textActiveCueEn: '#FCD34D', // Amber gold for active English cue
    textActiveCueZh: '#E5E7EB', // Clean readable light grey for active Chinese cue
    textInactiveCueEn: '#9CA3AF', // Clear secondary grey for readable inactive English
    textInactiveCueZh: '#64748B', // Subordinate muted grey for inactive Chinese
    textMuted: '#6B7280',
    textHint: '#4B5563',

    // Accents & status
    primary: '#FCD34D', // Warm amber
    primaryDark: '#D97706',
    secondary: '#38BDF8', // Cyan blue
    accent: '#6366F1', // Indigo
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',

    // Borders & dividers
    border: '#262B35',
    borderLight: '#374151',

    // Overlays
    overlayDark: 'rgba(0, 0, 0, 0.75)',
    overlayLight: 'rgba(255, 255, 255, 0.1)',
  },
  typography: {
    title: {
      fontSize: 18,
      fontWeight: '700' as const,
    },
    cueActiveEn: {
      fontSize: 19,
      lineHeight: 28,
      fontWeight: '700' as const,
    },
    cueInactiveEn: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '500' as const,
    },
    cueActiveZh: {
      fontSize: 15,
      lineHeight: 22,
      fontWeight: '500' as const,
    },
    cueInactiveZh: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400' as const,
    },
    wordToken: {
      fontSize: 18,
    },
  },
  spacing: {
    minTouchTarget: 46, // Guaranteed > 44dp for mobile touch
    radiusSm: 8,
    radiusMd: 12,
    radiusLg: 16,
    radiusFull: 9999,
  },
};
