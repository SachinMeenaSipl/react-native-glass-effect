import { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { GlassThemeProvider, LiquidGlassButton } from 'react-native-liquid-glass';
import { CapabilitiesScreen } from './screens/CapabilitiesScreen';
import { MaterialsScreen } from './screens/MaterialsScreen';
import { PlaygroundScreen } from './screens/PlaygroundScreen';
import { ScrollingScreen } from './screens/ScrollingScreen';
import { StressScreen } from './screens/StressScreen';

const SCREENS = {
  Scroll: ScrollingScreen,
  Materials: MaterialsScreen,
  Play: PlaygroundScreen,
  Stress: StressScreen,
  Caps: CapabilitiesScreen,
} as const;
type ScreenName = keyof typeof SCREENS;

export default function App() {
  const [screen, setScreen] = useState<ScreenName>('Scroll');
  const Screen = SCREENS[screen];
  return (
    <GlassThemeProvider>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View style={styles.root}>
        <Screen />
        <View style={styles.tabs} pointerEvents="box-none">
          {(Object.keys(SCREENS) as ScreenName[]).map((name) => (
            <LiquidGlassButton
              key={name}
              title={name}
              size="small"
              material={name === screen ? 'thick' : 'thin'}
              onPress={() => setScreen(name)}
            />
          ))}
        </View>
      </View>
    </GlassThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  tabs: {
    position: 'absolute', top: 8, left: 8, right: 8,
    flexDirection: 'row', justifyContent: 'space-between',
  },
});
