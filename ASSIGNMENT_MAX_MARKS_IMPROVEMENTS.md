# Changes for maximum marks (assignment rubric)

This project already meets the mandatory technical requirements (`FlatList`, `TextInput`, `Pressable`, `Switch`, `KeyboardAvoidingView`, `ImageBackground`, `useColorScheme`, `useWindowDimensions`, `StyleSheet.create` with `compose` / `flatten`). The items below are **tightening** items an evaluator might still nitpick, plus **polish** that reads as “production-ready UI.”

## Rubric alignment (no code change needed)

- Two screens with appropriate structure and spacing.
- Theme follows system by default; `Switch` applies a manual override via context.
- Responsive padding, typography, and max content width using `useWindowDimensions()`.

---

## High impact (small changes, clearer “perfect” compliance)

### 1. Remove remaining inline styles — **done**

- **`note-editor-screen.tsx`:** `headerImageCover` is in `StyleSheet.create` and passed as `imageStyle`.
- **`app-tabs.tsx`:** `labelStyle` is built with `useMemo` keyed on `colors.text`.

### 2. Theme toggle UX — **done**

- Context exposes **`isFollowingSystem`**. The list shows **Use device appearance** when an override is active (`clearOverride`).

### 3. List → editor continuity — **done**

- List uses `router.push({ pathname: '/editor', params: { noteId: item.id } })`. Editor reads `noteId` via **`useLocalSearchParams`** and **`getMockNoteById`** to pre-fill fields.

---

## Medium impact (UX / evaluation “wow”)

### 4. Keyboard and scroll behavior — **done**

- **`app.json`:** `android.windowSoftInputMode` set to **`adjustResize`**.
- **`note-editor-screen.tsx`:** `KeyboardAvoidingView` **`behavior`** is **`padding` on iOS only**; Android relies on the manifest + scroll.

### 5. Pressable feedback — **done**

- **`android_ripple`** on list cards, “Use device appearance”, Back, and Save.
- **`expo-haptics`** success notification on Save (native).

### 6. Empty / edge states

- Empty search state is already good; you could add **skeleton** or **section header** (“Today”, “Earlier”) if you want extra hierarchy marks.

---

## Lower impact (code quality presentation)

### 7. Duplicated constants — **done**

- **`TABLET_MIN_WIDTH`** lives in **`constants/theme.ts`** and is imported by both screens.

### 8. Submission checklist (not code)

- Public **GitHub** link, short **demo video**, and a short paragraph listing **components and hooks** (your `README.md` already does this—keep it in sync if the app changes).

---

## If your brief literally required a third “Focus” mode — **done (editor)**

- **Writing focus** `Switch` on the editor: larger title/body type, taller body field, and the header subtitle is hidden for a simpler chrome. Tab bar is unchanged (would need layout-level work to hide).

---

## Summary checklist

| Item | Action |
|------|--------|
| Inline `imageStyle` / tab `labelStyle` | Done (`StyleSheet` / `useMemo`). |
| System theme after manual toggle | Done (`Use device appearance` + `isFollowingSystem`). |
| Optional editing flow | Done (`noteId` params + `getMockNoteById`). |
| Keyboard on Android | Done (`adjustResize` + iOS-only KAV behavior). |
| “Focus” mode (if required) | Done (editor **Writing focus** switch + README). |

Optional follow-ups: **section headers** in the list, **skeleton** loading states, or hiding the tab bar in focus mode (larger change).
