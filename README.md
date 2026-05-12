# Notes App (Expo + React Native)

A **notes listing** and **note editor** UI built with **Expo Router** and **React Native**. The app uses two tab destinations—**Notes** and **Editor**—so you can move between list and writing surfaces without a separate stack navigator. Data is **mock-only** (no backend or local persistence).

**Made for Expo SDK 55** (`expo` ~55.x in `package.json`), including Expo Router and the surrounding Expo-managed native stack for that release.

For a deeper walkthrough of **features**, **design decisions**, and **how each part is implemented**, see **[`docs/FEATURES_AND_IMPLEMENTATION.md`](docs/FEATURES_AND_IMPLEMENTATION.md)**.

---

## Features at a glance

| Area | What you get |
|------|----------------|
| **Notes list** | Scrollable `FlatList`, live search, tappable cards (title, preview, date), dark/light `Switch`, return to **device appearance** when you have overridden the theme |
| **Editor** | Title and multiline body, `KeyboardAvoidingView` + `ScrollView`, `ImageBackground` header, Back/Save `Pressable`s, optional **Writing focus** mode, open from a card with **`noteId`** to edit mock data |
| **Theme** | `useColorScheme()` drives the default; manual override is app-wide and reflected in navigation chrome |
| **Layout** | `useWindowDimensions()` for tablet-style spacing and typography; content capped with `MaxContentWidth` |
| **Polish** | `StyleSheet.create` / `compose` / `flatten`, `android_ripple`, haptic feedback on Save (native), Android `adjustResize` for the keyboard |

---

## Requirements coverage (assignment-style)

| Area | Implementation |
|------|----------------|
| List screen | `FlatList`, search `TextInput`, `Pressable` note cards (`android_ripple`), theme `Switch`, **Use device appearance** when overriding system theme |
| Editor screen | Title/body `TextInput`s, `KeyboardAvoidingView`, `ScrollView`, `ImageBackground` (`imageStyle` from `StyleSheet`), `Pressable` Back/Save, **Writing focus** `Switch`, optional `noteId` to edit a mock note |
| Theme | `useColorScheme()` in `AppThemeProvider`; `Switch` sets override; **`isFollowingSystem`** + **clear override** on the list |
| Responsive | `useWindowDimensions()` + shared **`TABLET_MIN_WIDTH`** in `constants/theme.ts` |
| Styling | `StyleSheet.create` (via `useMemo` where theme/size changes), `StyleSheet.compose`, `StyleSheet.flatten` |
| Android keyboard | `windowSoftInputMode: adjustResize` in `app.json`; `KeyboardAvoidingView` **`behavior`** on **iOS only** |
| Feedback | `expo-haptics` on Save (native) |

---

## Project layout

| Path | Role |
|------|------|
| [`src/app/index.tsx`](src/app/index.tsx) | Notes tab route |
| [`src/app/editor.tsx`](src/app/editor.tsx) | Editor tab route |
| [`src/app/_layout.tsx`](src/app/_layout.tsx) | Tabs, splash, navigation theme, `AppThemeProvider` |
| [`src/screens/notes-list-screen.tsx`](src/screens/notes-list-screen.tsx) | List UI |
| [`src/screens/note-editor-screen.tsx`](src/screens/note-editor-screen.tsx) | Editor UI |
| [`src/context/app-theme.tsx`](src/context/app-theme.tsx) | System scheme + manual override |
| [`src/data/mock-notes.ts`](src/data/mock-notes.ts) | Sample notes + `getMockNoteById` |
| [`src/constants/theme.ts`](src/constants/theme.ts) | Colors, spacing, `TABLET_MIN_WIDTH`, tab inset |
| [`src/components/app-tabs.tsx`](src/components/app-tabs.tsx) / [`app-tabs.web.tsx`](src/components/app-tabs.web.tsx) | Native vs web tab chrome |

---

## Core components and hooks

**Components:** `SafeAreaView`, `View`, `Text`, `TextInput`, `FlatList`, `Pressable`, `Switch`, `KeyboardAvoidingView`, `ScrollView`, `ImageBackground`.

**Hooks:** `useColorScheme`, `useWindowDimensions`, `useMemo`, `useState`, `useEffect`, `useCallback`, `useSafeAreaInsets`, Expo Router `useRouter`, `useLocalSearchParams`.

**APIs / libraries:** `StyleSheet.create`, `StyleSheet.compose`, `StyleSheet.flatten`, `Platform`, `Alert`, `expo-haptics` (Save on native).

---

## Run locally

Install dependencies (this repo includes a `bun.lock`; use **Bun** or **npm**):

```bash
bun install
# or: npm install
```

Start Expo:

```bash
bun start
# or: npx expo start
```

Open **iOS simulator**, **Android emulator**, **Expo Go**, or press **`w`** for web.

### Scripts

| Command | Description |
|---------|-------------|
| `bun start` / `npm run start` | Expo dev server |
| `bun run android` / `npm run android` | Android |
| `bun run ios` / `npm run ios` | iOS |
| `bun run web` / `npm run web` | Web |
| `bun run lint` / `npm run lint` | ESLint (`eslint-config-expo`) |

---

## Assignment submission

Replace placeholders with your own links:

- **Repository:** `https://github.com/sayanatanbal/notes-app`

**Out of scope:** persistence, auth, and “real” stack navigation beyond tabs. The assignment only required two UIs; tabs are an extra convenience.

---

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
