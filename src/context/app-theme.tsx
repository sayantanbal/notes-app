import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

export type ColorSchemeName = 'light' | 'dark';

type AppThemeContextValue = {
  effectiveScheme: ColorSchemeName;
  /** When true, `useColorScheme()` drives appearance (no manual override). */
  isFollowingSystem: boolean;
  setSchemeOverride: (scheme: ColorSchemeName) => void;
  clearOverride: () => void;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

function normalizeSystem(scheme: ReturnType<typeof useColorScheme>): ColorSchemeName {
  return scheme === 'dark' ? 'dark' : 'light';
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [override, setOverride] = useState<ColorSchemeName | null>(null);

  const effectiveScheme = override ?? normalizeSystem(systemScheme);

  const setSchemeOverride = useCallback((scheme: ColorSchemeName) => {
    setOverride(scheme);
  }, []);

  const clearOverride = useCallback(() => {
    setOverride(null);
  }, []);

  const isFollowingSystem = override === null;

  const value = useMemo(
    () => ({
      effectiveScheme,
      isFollowingSystem,
      setSchemeOverride,
      clearOverride,
    }),
    [effectiveScheme, isFollowingSystem, setSchemeOverride, clearOverride],
  );

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(AppThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }
  return ctx;
}
