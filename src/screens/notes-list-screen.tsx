import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
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

import { BottomTabInset, Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/context/app-theme';
import { MOCK_NOTES, type Note } from '@/data/mock-notes';

const TABLET_MIN_WIDTH = 600;

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
  const { effectiveScheme, setSchemeOverride } = useAppTheme();
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
        themeRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: Spacing.two,
          paddingHorizontal: Spacing.three,
          borderRadius: Spacing.three,
          backgroundColor: Colors[effectiveScheme].backgroundElement,
          marginBottom: Spacing.three,
        },
        themeRowWide: {
          paddingVertical: Spacing.three,
        },
        themeLabelWrap: {
          gap: Spacing.half,
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

  const renderItem: ListRenderItem<Note> = ({ item }) => (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push('/editor')}
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

          <View
            style={
              isWide ? StyleSheet.compose(styles.themeRow, styles.themeRowWide) : styles.themeRow
            }>
            <View style={styles.themeLabelWrap}>
              <Text style={styles.themeLabel}>Dark mode</Text>
              <Text style={styles.themeHint}>{`Device: ${systemLabel}`}</Text>
            </View>
            <Switch
              accessibilityLabel="Toggle dark mode"
              value={effectiveScheme === 'dark'}
              onValueChange={(enabled) => setSchemeOverride(enabled ? 'dark' : 'light')}
            />
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
