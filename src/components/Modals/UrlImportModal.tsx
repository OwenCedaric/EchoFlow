import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { useLessonStore } from '../../store/useLessonStore';
import { usePlayerStore } from '../../store/usePlayerStore';

interface UrlImportModalProps {
  visible: boolean;
  onClose: () => void;
}

export const UrlImportModal: React.FC<UrlImportModalProps> = ({
  visible,
  onClose,
}) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [srtText, setSrtText] = useState('');
  const importCustomLesson = useLessonStore((s) => s.importCustomLesson);
  const resetPlayer = usePlayerStore((s) => s.resetPlayer);

  const handleImport = () => {
    if (!videoUrl.trim()) {
      Alert.alert('提示', '请输入有效的视频流地址或 YouTube 链接');
      return;
    }

    resetPlayer();
    importCustomLesson({
      title: title.trim() || '导入的学习素材',
      videoUrl: videoUrl.trim(),
      srtContent: srtText.trim(),
    });

    onClose();
    setVideoUrl('');
    setTitle('');
    setSrtText('');
  };

  const handleFillDemo = () => {
    setTitle('TED: Everyday Conversation Flow');
    setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    setSrtText(`1
00:00:01,000 --> 00:00:04,500
Mastering everyday conversation is about active listening.
掌握日常对话的关键在于积极倾听。

2
00:00:05,000 --> 00:00:09,200
When someone speaks to you, give them your undivided attention.
当别人对你倾诉时，请给予他们全神贯注的关注。

3
00:00:09,800 --> 00:00:14,000
Notice the rhythm, the emotional nuance, and the pauses.
体会其中的节奏韵律、情绪细微变化与停顿。`);
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
            <View style={styles.titleRow}>
              <Ionicons name="link" size={20} color={THEME.colors.primary} />
              <Text style={styles.title}>导入自定义音视频</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={THEME.colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>视频标题 (选填)</Text>
            <TextInput
              style={styles.input}
              placeholder="例如：Steve Jobs Stanford Speech"
              placeholderTextColor={THEME.colors.textHint}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>YouTube 链接 / 视频流 URL (MP4 / HLS)</Text>
            <TextInput
              style={styles.input}
              placeholder="https://... 或 YouTube URL"
              placeholderTextColor={THEME.colors.textHint}
              value={videoUrl}
              onChangeText={setVideoUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.labelRow}>
              <Text style={styles.label}>SRT / VTT 字幕内容 (可选)</Text>
              <TouchableOpacity onPress={handleFillDemo}>
                <Text style={styles.demoLink}>填入示例示例</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="粘贴 SRT 或 VTT 格式的双语/英文字幕..."
              placeholderTextColor={THEME.colors.textHint}
              value={srtText}
              onChangeText={setSrtText}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleImport}
              style={styles.importBtn}
            >
              <Ionicons name="download-outline" size={18} color="#0F1115" />
              <Text style={styles.importBtnText}>解析并开始精听</Text>
            </TouchableOpacity>
          </ScrollView>
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
    maxHeight: '85%',
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: THEME.colors.textPrimary,
    fontSize: 17,
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
  label: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  demoLink: {
    color: THEME.colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    backgroundColor: THEME.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.spacing.radiusMd,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: THEME.colors.textPrimary,
    fontSize: 14,
  },
  multilineInput: {
    minHeight: 110,
  },
  importBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: THEME.colors.primary,
    height: 48,
    borderRadius: THEME.spacing.radiusFull,
    marginTop: 20,
    marginBottom: 8,
  },
  importBtnText: {
    color: '#0F1115',
    fontSize: 15,
    fontWeight: '700',
  },
});
