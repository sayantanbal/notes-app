import { NativeTabs } from 'expo-router/unstable-native-tabs';
import React, { useMemo } from 'react';

import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/context/app-theme';

export default function AppTabs() {
  const { effectiveScheme } = useAppTheme();
  const colors = Colors[effectiveScheme];

  const tabLabelStyle = useMemo(
    () => ({
      selected: { color: colors.text },
    }),
    [colors.text],
  );

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={tabLabelStyle}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Notes</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="editor">
        <NativeTabs.Trigger.Label>Editor</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
