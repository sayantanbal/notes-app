import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset, Colors, MaxContentWidth, Spacing, TABLET_MIN_WIDTH } from '@/constants/theme';
import { useAppTheme } from '@/context/app-theme';
import { getMockNoteById } from '@/data/mock-notes';

export function NoteEditorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ noteId?: string | string[] }>();
  const noteId = Array.isArray(params.noteId) ? params.noteId[0] : params.noteId;
  const existingNote = useMemo(() => getMockNoteById(noteId), [noteId]);

  const { effectiveScheme } = useAppTheme();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [focusWriting, setFocusWriting] = useState(false);

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setBody(existingNote.body);
    } else {
      setTitle('');
      setBody('');
    }
  }, [existingNote]);

  const isWide = width >= TABLET_MIN_WIDTH;
  const contentMaxWidth = Math.min(width, MaxContentWidth);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        flex: {
          flex: 1,
          backgroundColor: Colors[effectiveScheme].background,
        },
        keyboardRoot: {
          flex: 1,
        },
        scrollContent: {
          flexGrow: 1,
          paddingBottom: BottomTabInset + Spacing.four,
        },
        centeredColumn: {
          alignItems: 'center',
        },
        inner: {
          width: '100%',
          maxWidth: contentMaxWidth,
          paddingHorizontal: isWide ? Spacing.six : Spacing.four,
        },
        headerImage: {
          width: '100%',
          borderBottomLeftRadius: Spacing.four,
          borderBottomRightRadius: Spacing.four,
          overflow: 'hidden',
          marginBottom: Spacing.four,
        },
        headerImageMinHeight: {
          minHeight: 140,
        },
        headerImageCover: {
          resizeMode: 'cover',
        },
        headerOverlay: {
          paddingTop: Spacing.three,
          paddingBottom: Spacing.five,
          paddingHorizontal: Spacing.four,
          backgroundColor:
            effectiveScheme === 'dark' ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.72)',
        },
        headerTitle: {
          fontSize: isWide ? 26 : 22,
          fontWeight: '700',
          color: effectiveScheme === 'dark' ? '#fff' : '#0b1220',
        },
        headerTitleFocus: {
          fontSize: isWide ? 28 : 24,
        },
        headerSubtitle: {
          marginTop: Spacing.one,
          fontSize: 15,
          color: effectiveScheme === 'dark' ? 'rgba(255,255,255,0.85)' : 'rgba(11,18,32,0.72)',
        },
        focusRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: Spacing.two,
          paddingHorizontal: Spacing.three,
          marginBottom: Spacing.four,
          borderRadius: Spacing.three,
          backgroundColor: Colors[effectiveScheme].backgroundElement,
        },
        focusLabelWrap: {
          flex: 1,
          paddingRight: Spacing.two,
          gap: Spacing.half,
        },
        focusLabel: {
          fontSize: 15,
          fontWeight: '600',
          color: Colors[effectiveScheme].text,
        },
        focusHint: {
          fontSize: 12,
          color: Colors[effectiveScheme].textSecondary,
        },
        fieldBlock: {
          gap: Spacing.two,
          marginBottom: Spacing.four,
        },
        label: {
          fontSize: 13,
          fontWeight: '600',
          letterSpacing: 0.3,
          textTransform: 'uppercase',
          color: Colors[effectiveScheme].textSecondary,
        },
        titleInput: {
          borderRadius: Spacing.three,
          paddingHorizontal: Spacing.three,
          paddingVertical: Spacing.two,
          fontSize: 18,
          fontWeight: '600',
          color: Colors[effectiveScheme].text,
          backgroundColor: Colors[effectiveScheme].backgroundElement,
        },
        titleInputFocus: {
          fontSize: 20,
          paddingVertical: Spacing.three,
        },
        bodyInput: {
          borderRadius: Spacing.three,
          paddingHorizontal: Spacing.three,
          paddingVertical: Spacing.three,
          fontSize: 16,
          lineHeight: 24,
          minHeight: isWide ? 280 : 220,
          textAlignVertical: 'top',
          color: Colors[effectiveScheme].text,
          backgroundColor: Colors[effectiveScheme].backgroundElement,
        },
        bodyInputFocus: {
          fontSize: 18,
          lineHeight: 28,
          minHeight: isWide ? 360 : 300,
        },
        actionsRow: {
          flexDirection: 'row',
          gap: Spacing.two,
          paddingTop: Spacing.four,
        },
        actionBase: {
          flex: 1,
          borderRadius: Spacing.three,
          paddingVertical: Spacing.three,
          alignItems: 'center',
          justifyContent: 'center',
        },
        actionSecondary: {
          backgroundColor: Colors[effectiveScheme].backgroundElement,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: Colors[effectiveScheme].backgroundSelected,
        },
        actionPrimary: {
          backgroundColor: effectiveScheme === 'dark' ? '#f2f4f8' : '#111827',
        },
        actionSecondaryText: {
          fontSize: 16,
          fontWeight: '600',
          color: Colors[effectiveScheme].text,
        },
        actionPrimaryText: {
          fontSize: 16,
          fontWeight: '600',
          color: effectiveScheme === 'dark' ? '#111827' : '#f9fafb',
        },
        actionPressed: {
          opacity: 0.85,
        },
      }),
    [contentMaxWidth, effectiveScheme, isWide],
  );

  const scrollContentCombined = useMemo(
    () => StyleSheet.flatten([styles.scrollContent, styles.centeredColumn]),
    [styles.scrollContent, styles.centeredColumn],
  );

  const headerImageStyle = useMemo(
    () =>
      StyleSheet.compose(styles.headerImage, styles.headerImageMinHeight) as ViewStyle,
    [styles.headerImage, styles.headerImageMinHeight],
  );

  const secondaryRipple =
    Platform.OS === 'android'
      ? {
          color:
            effectiveScheme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
          foreground: true,
        }
      : undefined;

  const primaryRipple =
    Platform.OS === 'android'
      ? {
          color: effectiveScheme === 'dark' ? 'rgba(17,24,39,0.35)' : 'rgba(249,250,251,0.35)',
          foreground: true,
        }
      : undefined;

  const onSave = () => {
    if (Platform.OS !== 'web') {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    Alert.alert('Saved', 'Your note layout is ready. Persistence is not part of this demo.');
  };

  const keyboardVerticalOffset = Platform.OS === 'ios' ? insets.top : 0;
  const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <SafeAreaView style={styles.flex} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardRoot}
        behavior={keyboardBehavior}
        keyboardVerticalOffset={keyboardVerticalOffset}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={scrollContentCombined}
          showsVerticalScrollIndicator={false}>
          <View style={styles.inner}>
            <ImageBackground
              source={require('@/assets/images/logo-glow.png')}
              style={headerImageStyle}
              imageStyle={styles.headerImageCover}>
              <View style={styles.headerOverlay}>
                <Text style={[styles.headerTitle, focusWriting && styles.headerTitleFocus]}>
                  {existingNote ? 'Edit note' : 'New note'}
                </Text>
                {!focusWriting ? (
                  <Text style={styles.headerSubtitle}>
                    Comfortable space for long-form writing.
                  </Text>
                ) : null}
              </View>
            </ImageBackground>

            <View style={styles.focusRow}>
              <View style={styles.focusLabelWrap}>
                <Text style={styles.focusLabel}>Writing focus</Text>
                <Text style={styles.focusHint}>Larger type, minimal header chrome.</Text>
              </View>
              <Switch
                accessibilityLabel="Toggle writing focus mode"
                value={focusWriting}
                onValueChange={setFocusWriting}
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Add a title"
                placeholderTextColor={Colors[effectiveScheme].textSecondary}
                style={StyleSheet.compose(
                  styles.titleInput,
                  focusWriting ? styles.titleInputFocus : undefined,
                )}
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Body</Text>
              <TextInput
                value={body}
                onChangeText={setBody}
                placeholder="Write something thoughtful…"
                placeholderTextColor={Colors[effectiveScheme].textSecondary}
                style={StyleSheet.compose(
                  styles.bodyInput,
                  focusWriting ? styles.bodyInputFocus : undefined,
                )}
                multiline
              />
            </View>

            <View style={styles.actionsRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to notes"
                onPress={() => router.navigate('/')}
                android_ripple={secondaryRipple}
                style={({ pressed }) => [
                  styles.actionBase,
                  styles.actionSecondary,
                  pressed && styles.actionPressed,
                ]}>
                <Text style={styles.actionSecondaryText}>Back</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Save note"
                onPress={onSave}
                android_ripple={primaryRipple}
                style={({ pressed }) => [
                  styles.actionBase,
                  styles.actionPrimary,
                  pressed && styles.actionPressed,
                ]}>
                <Text style={styles.actionPrimaryText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
