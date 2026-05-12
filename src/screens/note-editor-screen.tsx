import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset, Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/context/app-theme';

const TABLET_MIN_WIDTH = 600;

export function NoteEditorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { effectiveScheme } = useAppTheme();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

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
        headerSubtitle: {
          marginTop: Spacing.one,
          fontSize: 15,
          color: effectiveScheme === 'dark' ? 'rgba(255,255,255,0.85)' : 'rgba(11,18,32,0.72)',
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

  const onSave = () => {
    Alert.alert('Saved', 'Your note layout is ready. Persistence is not part of this demo.');
  };

  const keyboardVerticalOffset = Platform.OS === 'ios' ? insets.top : 0;

  return (
    <SafeAreaView style={styles.flex} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardRoot}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={scrollContentCombined}
          showsVerticalScrollIndicator={false}>
          <View style={styles.inner}>
              <ImageBackground
                source={require('@/assets/images/logo-glow.png')}
                style={headerImageStyle}
                imageStyle={{ resizeMode: 'cover' }}>
                <View style={styles.headerOverlay}>
                  <Text style={styles.headerTitle}>New note</Text>
                  <Text style={styles.headerSubtitle}>Comfortable space for long-form writing.</Text>
                </View>
              </ImageBackground>

              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Add a title"
                  placeholderTextColor={Colors[effectiveScheme].textSecondary}
                  style={styles.titleInput}
                />
              </View>

              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Body</Text>
                <TextInput
                  value={body}
                  onChangeText={setBody}
                  placeholder="Write something thoughtful…"
                  placeholderTextColor={Colors[effectiveScheme].textSecondary}
                  style={styles.bodyInput}
                  multiline
                />
              </View>

              <View style={styles.actionsRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Back to notes"
                  onPress={() => router.navigate('/')}
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
