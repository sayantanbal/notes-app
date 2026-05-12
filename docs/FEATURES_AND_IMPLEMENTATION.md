# Features, design rationale, and implementation

This document describes what the Notes app does, **why** it is built that way, and **where** the important logic lives in the codebase.

**Runtime:** the project is built and tested against **Expo SDK 55** (see the `expo` entry in `package.json`, currently the `~55.x` range). Use the same major SDK when upgrading or copying patterns from Expo’s docs so native modules and Expo Router APIs line up.

---

## 1. Goals

- Deliver two polished surfaces: a **browsable list** and a **comfortable editor**, suitable for a React Native coursework rubric (core components, layout, theming, inputs, `StyleSheet` discipline).
- Keep the mental model simple: **mock data**, **no persistence**, and **tabs** instead of a deep navigation graph, while still allowing **deep links into the editor** with a `noteId` when the user taps a card.
- Make **light/dark** behavior correct for both “follow the device” and “I want to force light or dark for the demo.”

---

## 2. User-facing features

### Notes list

- **Scrollable list** of notes with title, two-line body preview, and a formatted **date/time** (`Intl.DateTimeFormat`).
- **Search** filters by title or body (case-insensitive, trimmed query).
- **Tap a card** to open the Editor tab with that note’s `noteId` so fields are **pre-filled** from mock data.
- **Dark mode switch** maps to the app’s effective appearance (light vs dark). A hint line explains whether you are **following the device** or using a **manual** override and what the OS reports.
- **Use device appearance** appears when a manual override is active; it clears the override so **`useColorScheme()`** drives the UI again.
- **Empty state** when search returns no rows.
- **Android ripple** on cards and the “Use device appearance” control for clearer touch feedback.

### Note editor

- **Title** and **multiline body** fields with labels and placeholders tuned for both themes.
- **Header** uses `ImageBackground` with a semi-transparent overlay so text stays readable on top of artwork.
- **Back** returns to the Notes tab route; **Save** shows a confirmation alert (no storage—this is intentional).
- **Writing focus** toggle: larger typography and body area, subtitle hidden in the header, aimed at a distraction-reduced writing pass (tab bar remains; hiding it would be a layout-level change).
- **Keyboard:** `KeyboardAvoidingView` on iOS uses `padding` and respects the top safe area via `keyboardVerticalOffset`. On Android, `behavior` is omitted and **`windowSoftInputMode: adjustResize`** (see `app.json`) lets the window resize with the IME while content scrolls inside `ScrollView`.
- **Haptics:** Save triggers a **success** notification on native platforms (`expo-haptics`), guarded from web.

### Theming (global)

- All screens and tab chrome read **`effectiveScheme`** from context (`'light' | 'dark'`).
- React Navigation’s `ThemeProvider` receives `DefaultTheme` or `DarkTheme` based on that value so headers and defaults stay consistent.

### Responsive layout

- **`useWindowDimensions()`** supplies width; above **`TABLET_MIN_WIDTH`** (600, defined in `src/constants/theme.ts`) the UI uses **wider horizontal padding** and **slightly larger type** so the same components feel natural on tablets and large phones.
- A **`MaxContentWidth`** cap keeps lines from stretching uncomfortably on very wide layouts (especially web).

---

## 3. Thought process (design decisions)

### Why context for theme instead of only `useColorScheme()` in each screen?

The rubric asks for automatic detection **and** a switch. Putting **`useColorScheme()`** in a single **`AppThemeProvider`** keeps one source of truth: `effectiveScheme = override ?? normalizedSystem`. Screens only call **`useAppTheme()`**, which avoids duplicated logic and guarantees the list, editor, and tabs stay in sync.

### Why a nullable override instead of only mirroring the Switch?

A boolean switch cannot express three states (system / force light / force dark) by itself. The implementation uses **`override: 'light' | 'dark' | null`**: `null` means **follow device**; non-null means **forced**. The Switch still presents a binary “dark on vs off” mapped to `setSchemeOverride('dark' | 'light')`, and **Use device appearance** restores `null`. **`isFollowingSystem`** is exposed so the list can show the right hint and conditional control.

### Why `useMemo` + `StyleSheet.create` inside screens?

Colors and some numeric styles depend on **`effectiveScheme`** and **width breakpoints**. Recreating the stylesheet object when those inputs change keeps updates predictable and avoids scattering magic numbers. It also satisfies a strict reading of “styles live in `StyleSheet.create`” while remaining performant.

### Why `StyleSheet.compose` / `flatten`?

The assignment explicitly calls for **`compose`** or **`flatten`**. They are used where multiple registered styles are merged (for example list `contentContainerStyle`, composed card widths, composed editor header layout, optional focus variants on inputs).

### Why Expo Router params for `noteId`?

Tapping a specific note should feel like opening **that** note. **`router.push({ pathname: '/editor', params: { noteId } })`** keeps navigation declarative. **`useLocalSearchParams`** normalizes `noteId` (string vs array on some platforms). **`getMockNoteById`** in `mock-notes.ts` centralizes lookup; **`useEffect`** syncs local `title`/`body` state when `existingNote` changes so switching between notes or clearing `noteId` stays consistent.

### Why iOS-only `KeyboardAvoidingView` behavior?

On Android, combining **`behavior="height"`** with multiline fields often fights the window resize. **`adjustResize`** plus scrollable content is a common pattern; iOS still benefits from **`padding`** behavior with a safe-area-aware vertical offset.

### Why `android_ripple` and haptics?

They are small additions that improve perceived quality on devices without changing assignment scope. Ripple is Android-specific; haptics are skipped on web.

---

## 4. How it is implemented (by area)

### Data layer

| Piece | Location | Behavior |
|--------|-----------|----------|
| Note type and mock list | `src/data/mock-notes.ts` | Static `MOCK_NOTES` array |
| Lookup by id | `getMockNoteById(id)` | Returns `null` if missing / empty id |

### Theme layer

| Piece | Location | Behavior |
|--------|-----------|----------|
| Provider | `src/context/app-theme.tsx` | `useColorScheme()`, override state, `effectiveScheme`, `isFollowingSystem`, `setSchemeOverride`, `clearOverride` |
| Color tokens | `src/constants/theme.ts` | `Colors.light` / `Colors.dark`, spacing scale, `TABLET_MIN_WIDTH`, `MaxContentWidth`, `BottomTabInset` |

### List screen

| Concern | Implementation |
|---------|------------------|
| Virtualized list | `FlatList` with `keyExtractor`, `renderItem`, `ListEmptyComponent` |
| Search | `useState` for query + `useMemo` filtered array |
| Navigation | `useRouter().push` with `pathname` + `params` |
| Theme UI | `Switch` + conditional `Pressable` for `clearOverride` |
| Styles | `useMemo` → `StyleSheet.create`; `compose` / `flatten` where multiple styles merge |

### Editor screen

| Concern | Implementation |
|---------|------------------|
| Route params | `useLocalSearchParams` → `noteId` → `getMockNoteById` |
| Form state | `useState` for title/body; `useEffect` when `existingNote` changes |
| Focus mode | `useState` for `focusWriting`; conditional styles / subtitle visibility |
| Keyboard | `KeyboardAvoidingView` wrapping `ScrollView`; platform-specific `behavior` |
| Header image | `ImageBackground` + `StyleSheet` `imageStyle` (`resizeMode: 'cover'`) |
| Actions | `Pressable` + `Alert` on Save; `router.navigate('/')` on Back |

### App shell

| Piece | Location | Role |
|--------|-----------|------|
| Root layout | `src/app/_layout.tsx` | Wraps tree in `AppThemeProvider`, syncs React Navigation theme |
| Tabs (native) | `src/components/app-tabs.tsx` | `NativeTabs`; `labelStyle` memoized from theme text color |
| Tabs (web) | `src/components/app-tabs.web.tsx` | Alternate tab UI for web |

### Native configuration

| Setting | File | Purpose |
|---------|------|---------|
| `userInterfaceStyle: automatic` | `app.json` | OS can supply light/dark to the app |
| `android.windowSoftInputMode: adjustResize` | `app.json` | Resize window with keyboard on Android |

---

## 5. Limitations and out of scope

- **No persistence:** Save does not write to disk or an API.
- **No auth or multi-user model.**
- **Tab bar** does not hide in Writing focus mode (would require coordinating layout above the screen components).
- **Web vs native tabs** use different implementations (`app-tabs.web.tsx` vs `app-tabs.tsx`); feature parity is intentional where Expo’s unstable native tabs differ from web.

---

## 6. Suggested reading order in the repo

1. `src/context/app-theme.tsx` — theme model  
2. `src/constants/theme.ts` — tokens and breakpoints  
3. `src/screens/notes-list-screen.tsx` — list + theme controls + navigation  
4. `src/screens/note-editor-screen.tsx` — editor, keyboard, focus, params  
5. `src/app/_layout.tsx` — how the provider wraps navigation  

This should give reviewers or teammates enough context to extend the app (real API, SQLite, stack navigation) without reverse-engineering every file.
