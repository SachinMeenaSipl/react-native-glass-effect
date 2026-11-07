import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import {
  GlassBackdrop,
  GlassThemeProvider,
  LiquidGlassCard,
  type GlassMaterialName,
} from 'react-native-liquid-glass-native';
import { Background } from '../Background';

/** An in-app "Appearance" setting that changes every glass at once through the theme. */
export default function RecipeSettingsToggle() {
  const [strong, setStrong] = useState(false);
  const [solid, setSolid] = useState(false);
  const material: GlassMaterialName = strong ? 'thick' : 'thin';

  return (
    <GlassThemeProvider theme={{ defaultMaterial: material }}>
      <View style={styles.screen}>
        <GlassBackdrop style={StyleSheet.absoluteFill}>
          <Background />
        </GlassBackdrop>

        <View style={styles.stack} pointerEvents="box-none">
          <LiquidGlassCard reduceTransparency={solid || 'auto'}>
            <Text style={styles.title}>Appearance</Text>
            <View style={styles.row}>
              <Text style={styles.body}>Stronger glass</Text>
              <Switch value={strong} onValueChange={setStrong} />
            </View>
            <View style={styles.row}>
              <Text style={styles.body}>Solid surfaces</Text>
              <Switch value={solid} onValueChange={setSolid} />
            </View>
          </LiquidGlassCard>

          <LiquidGlassCard reduceTransparency={solid || 'auto'}>
            <Text style={styles.body}>This card follows the setting too: material="{material}"</Text>
          </LiquidGlassCard>
        </View>
      </View>
    </GlassThemeProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  stack: { flex: 1, justifyContent: 'center', padding: 16, gap: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },
  body: { color: '#fff', fontSize: 15 },
});
