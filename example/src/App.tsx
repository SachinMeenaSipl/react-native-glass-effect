import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { GlassThemeProvider, LiquidGlassButton } from 'react-native-liquid-glass';
import { TAB_BAR_TOP } from './layout';
import { GlassTypesScreen } from './screens/GlassTypesScreen';
import { CapabilitiesScreen } from './screens/CapabilitiesScreen';
import { MaterialsScreen } from './screens/MaterialsScreen';
import { PlaygroundScreen } from './screens/PlaygroundScreen';
import { ScrollingScreen } from './screens/ScrollingScreen';
import { StressScreen } from './screens/StressScreen';

const SCREENS = {
  Types: GlassTypesScreen,
  Scroll: ScrollingScreen,
  Materials: MaterialsScreen,
  Play: PlaygroundScreen,
  Stress: StressScreen,
  Caps: CapabilitiesScreen,
} as const;
type ScreenName = keyof typeof SCREENS;

/** Same glass on Android and iOS across the whole example. LiquidGlass stays Apple's on iOS. */
const THEME = { iosRenderer: 'shader' } as const;

export default function App() {
  const [screen, setScreen] = useState<ScreenName>('Types');
  const Screen = SCREENS[screen];
  return (
    <GlassThemeProvider theme={THEME}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View style={styles.root}>
        <Screen />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabs}
          contentContainerStyle={styles.tabRow}
        >
          {(Object.keys(SCREENS) as ScreenName[]).map((name) => (
            <LiquidGlassButton
              key={name}
              title={name}
              size="small"
              quality="high"
              material={name === screen ? 'thick' : 'thin'}
              onPress={() => setScreen(name)}
            />
          ))}
        </ScrollView>
      </View>
    </GlassThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  tabs: {
    // Below the status bar, which takes touches on edge-to-edge Android.
    position: 'absolute', top: TAB_BAR_TOP, left: 0, right: 0,
  },
  tabRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 8 },
});
