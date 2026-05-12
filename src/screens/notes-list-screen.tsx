import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabInset, Colors, MaxContentWidth, Spacing, TABLET_MIN_WIDTH } from '@/constants/theme';
import { useAppTheme } from '@/context/app-theme';
import { MOCK_NOTES, type Note } from '@/data/mock-notes';

function formatNoteDate(timestamp: number) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp));
}

export function NotesListScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const systemScheme = useColorScheme();
  const { effectiveScheme, isFollowingSystem, setSchemeOverride, clearOverride } = useAppTheme();
  const [query, setQuery] = useState('');

  const isWide = width >= TABLET_MIN_WIDTH;
  const contentMaxWidth = Math.min(width, MaxContentWidth);

  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_NOTES;
    return MOCK_NOTES.filter(
      (n) =>
        n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q),
    );
  }, [query]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: {
          flex: 1,
          backgroundColor: Colors[effectiveScheme].background,
        },
        outer: {
          flex: 1,
          alignItems: 'center',
        },
        inner: {
          flex: 1,
          width: '100%',
          maxWidth: contentMaxWidth,
          paddingHorizontal: isWide ? Spacing.six : Spacing.four,
        },
        headerBlock: {
          paddingTop: Spacing.three,
          paddingBottom: Spacing.four,
          gap: Spacing.two,
        },
        title: {
          fontSize: isWide ? 32 : 28,
          fontWeight: '700',
          letterSpacing: -0.5,
          color: Colors[effectiveScheme].text,
        },
        subtitle: {
          fontSize: 14,
          color: Colors[effectiveScheme].textSecondary,
        },
        search: {
          borderRadius: Spacing.three,
          paddingHorizontal: Spacing.three,
          paddingVertical: Spacing.two,
          backgroundColor: Colors[effectiveScheme].backgroundElement,
          color: Colors[effectiveScheme].text,
          fontSize: 16,
        },
        themeBlock: {
          marginBottom: Spacing.three,
        },
        themeRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: Spacing.two,
          paddingHorizontal: Spacing.three,
          borderRadius: Spacing.three,
          backgroundColor: Colors[effectiveScheme].backgroundElement,
        },
        themeRowWide: {
          paddingVertical: Spacing.three,
        },
        themeLabelWrap: {
          gap: Spacing.half,
          flex: 1,
          paddingRight: Spacing.two,
        },
        themeLabel: {
          fontSize: 16,
          fontWeight: '600',
          color: Colors[effectiveScheme].text,
        },
        themeHint: {
          fontSize: 12,
          color: Colors[effectiveScheme].textSecondary,
        },
        useDeviceRow: {
          marginTop: Spacing.two,
          alignSelf: 'flex-start',
        },
        useDeviceText: {
          fontSize: 14,
          fontWeight: '600',
          color: Colors[effectiveScheme].textSecondary,
          textDecorationLine: 'underline',
        },
        useDevicePressed: {
          opacity: 0.75,
        },
        listContent: {
          paddingBottom: BottomTabInset + Spacing.four,
          gap: Spacing.two,
        },
        listContentWide: {
          gap: Spacing.three,
        },
        card: {
          borderRadius: Spacing.three,
          padding: Spacing.three,
          backgroundColor: Colors[effectiveScheme].backgroundElement,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: Colors[effectiveScheme].backgroundSelected,
        },
        cardWide: {
          padding: Spacing.four,
        },
        cardPressed: {
          opacity: 0.92,
          transform: [{ scale: 0.995 }],
        },
        cardTitle: {
          fontSize: isWide ? 19 : 17,
          fontWeight: '600',
          color: Colors[effectiveScheme].text,
          marginBottom: Spacing.one,
        },
        cardPreview: {
          fontSize: 15,
          lineHeight: 22,
          color: Colors[effectiveScheme].textSecondary,
        },
        cardMeta: {
          marginTop: Spacing.two,
          fontSize: 13,
          color: Colors[effectiveScheme].textSecondary,
        },
        emptyWrap: {
          paddingVertical: Spacing.six,
          alignItems: 'center',
        },
        emptyTitle: {
          fontSize: 17,
          fontWeight: '600',
          color: Colors[effectiveScheme].text,
          marginBottom: Spacing.one,
        },
        emptyBody: {
          fontSize: 15,
          textAlign: 'center',
          color: Colors[effectiveScheme].textSecondary,
          paddingHorizontal: Spacing.four,
        },
      }),
    [contentMaxWidth, effectiveScheme, isWide],
  );

  const cardRipple =
    Platform.OS === 'android'
      ? {
          color:
            effectiveScheme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
          foreground: true,
        }
      : undefined;

  const renderItem: ListRenderItem<Note> = ({ item }) => (
    <Pressable
      accessibilityRole="button"
      onPress={() =>
        router.push({
          pathname: '/editor',
          params: { noteId: item.id },
        })
      }
      android_ripple={cardRipple}
      style={({ pressed }) => [pressed ? styles.cardPressed : null]}>
      <View
        style={StyleSheet.compose(
          styles.card,
          isWide ? styles.cardWide : undefined,
        )}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.cardPreview} numberOfLines={2}>
          {item.body}
        </Text>
        <Text style={styles.cardMeta}>{formatNoteDate(item.updatedAt)}</Text>
      </View>
    </Pressable>
  );

  const systemLabel =
    systemScheme === 'dark' ? 'Dark' : systemScheme === 'light' ? 'Light' : 'Unspecified';

  const themeHint = isFollowingSystem
    ? `Following device · Device is ${systemLabel}`
    : `Manual appearance · Device is ${systemLabel}`;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.outer}>
        <View style={styles.inner}>
          <View style={styles.headerBlock}>
            <Text style={styles.title}>Notes</Text>
            <Text style={styles.subtitle}>Your ideas, organized.</Text>
          </View>

          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search notes"
            placeholderTextColor={Colors[effectiveScheme].textSecondary}
            style={styles.search}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />

          <View style={styles.themeBlock}>
            <View
              style={
                isWide ? StyleSheet.compose(styles.themeRow, styles.themeRowWide) : styles.themeRow
              }>
              <View style={styles.themeLabelWrap}>
                <Text style={styles.themeLabel}>Dark mode</Text>
                <Text style={styles.themeHint}>{themeHint}</Text>
              </View>
              <Switch
                accessibilityLabel="Toggle dark mode"
                value={effectiveScheme === 'dark'}
                onValueChange={(enabled) => setSchemeOverride(enabled ? 'dark' : 'light')}
              />
            </View>
            {!isFollowingSystem ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Use device appearance for light and dark mode"
                onPress={clearOverride}
                android_ripple={cardRipple}
                style={({ pressed }) => [
                  styles.useDeviceRow,
                  pressed ? styles.useDevicePressed : null,
                ]}>
                <Text style={styles.useDeviceText}>Use device appearance</Text>
              </Pressable>
            ) : null}
          </View>

          <FlatList
            data={filteredNotes}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={StyleSheet.flatten([
              styles.listContent,
              isWide ? styles.listContentWide : null,
            ])}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyTitle}>No matches</Text>
                <Text style={styles.emptyBody}>Try a different search term.</Text>
              </View>
            }
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
