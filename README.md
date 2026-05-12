# Notes App (Expo + React Native)

A simple **notes listing** and **note editor** UI built with **Expo Router** and **React Native**. Two tab screens (no separate navigation stack): **Notes** and **Editor**.

## Requirements coverage

| Area | Implementation |
|------|----------------|
| List screen | `FlatList`, search `TextInput`, `Pressable` note cards, theme `Switch` |
| Editor screen | Title/body `TextInput`s, `KeyboardAvoidingView`, `ScrollView`, `ImageBackground` header, `Pressable` Back/Save |
| Theme | `useColorScheme()` in `AppThemeProvider`; `Switch` sets a manual light/dark override for the whole app |
| Responsive | `useWindowDimensions()` on both screens (wider padding and typography on large widths) |
| Styling | `StyleSheet.create` (via `useMemo` where colors depend on theme), plus `StyleSheet.compose` and `StyleSheet.flatten` |

## Project layout

- [`src/app/index.tsx`](src/app/index.tsx) — Notes tab route  
- [`src/app/editor.tsx`](src/app/editor.tsx) — Editor tab route  
- [`src/app/_layout.tsx`](src/app/_layout.tsx) — Tab layout, splash, navigation theme, `AppThemeProvider`  
- [`src/screens/notes-list-screen.tsx`](src/screens/notes-list-screen.tsx) — List UI  
- [`src/screens/note-editor-screen.tsx`](src/screens/note-editor-screen.tsx) — Editor UI  
- [`src/context/app-theme.tsx`](src/context/app-theme.tsx) — Theme override + system scheme  
- [`src/data/mock-notes.ts`](src/data/mock-notes.ts) — Sample notes (no persistence)  
- [`src/components/app-tabs.tsx`](src/components/app-tabs.tsx) / [`app-tabs.web.tsx`](src/components/app-tabs.web.tsx) — Native vs web tab chrome  

## Core components and hooks used

**Components:** `SafeAreaView`, `View`, `Text`, `TextInput`, `FlatList`, `Pressable`, `Switch`, `KeyboardAvoidingView`, `ScrollView`, `ImageBackground`.

**Hooks:** `useColorScheme`, `useWindowDimensions`, `useMemo`, `useState`, `useCallback`, `useSafeAreaInsets` (editor), Expo Router `useRouter`.

**APIs:** `StyleSheet.create`, `StyleSheet.compose`, `StyleSheet.flatten`, `Platform`, `Alert` (Save).

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

Then open **iOS simulator**, **Android emulator**, **Expo Go**, or press **`w`** for web.

### Scripts

| Command | Description |
|---------|-------------|
| `bun start` / `npm run start` | Expo dev server |
| `bun run android` / `npm run android` | Start on Android |
| `bun run ios` / `npm run ios` | Start on iOS |
| `bun run web` / `npm run web` | Start on web |
| `bun run lint` / `npm run lint` | ESLint (`eslint-config-expo`) |

## UI enhancements (beyond minimum)

- Manual dark mode switch with a short **device appearance** hint (system vs effective theme).  
- Note cards with border, preview snippet, and formatted date/time.  
- Empty state when search has no matches.  
- Editor header uses an **image background** with a readable overlay; long body text scrolls while the keyboard is open.

## Assignment submission

Replace placeholders with your own links:

- **Repository:** `https://github.com/<you>/notes-app`  
- **Demo video:** `<your video URL>`  

Persistence and real navigation between unrelated stacks are **out of scope**; data is mock-only and tabs switch between the two screens.

## Learn more

- [Expo documentation](https://docs.expo.dev/)  
- [Expo Router](https://docs.expo.dev/router/introduction/)  
