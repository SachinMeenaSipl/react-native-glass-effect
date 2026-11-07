import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import {
  GlassBackdrop,
  GlassThemeProvider,
  LiquidGlassCard,
  type GlassMaterialName,
} from 'react-native-liquid-glass-native';
import { ART } from '../assets';
import { Background } from '../Background';
import { AppIcon, Eyebrow, PauseIcon, text } from '../ui';

/** An in-app "Appearance" setting that changes every glass at once through the theme. */
export default function RecipeSettingsToggle() {
  const [strong, setStrong] = useState(false);
  const [solid, setSolid] = useState(false);
  const material: GlassMaterialName = strong ? 'thick' : 'thin';

  return (
    <GlassThemeProvider theme={{ defaultMaterial: material }}>
      <View style={styles.screen}>
        <GlassBackdrop style={StyleSheet.absoluteFill}>
          <Background topInset={40} />
        </GlassBackdrop>

        <View style={styles.stack} pointerEvents="box-none">
          <LiquidGlassCard reduceTransparency={solid || 'auto'} padding={20}>
            <Eyebrow>{`theme.defaultMaterial = "${material}"`}</Eyebrow>
            <Text style={text.title}>Appearance</Text>
            <View style={styles.row}>
              <Text style={text.body}>Stronger glass</Text>
              <Switch value={strong} onValueChange={setStrong} />
            </View>
            <View style={styles.row}>
              <Text style={text.body}>Solid surfaces</Text>
              <Switch value={solid} onValueChange={setSolid} />
            </View>
          </LiquidGlassCard>

          {/* This card follows the same setting. */}
          <LiquidGlassCard reduceTransparency={solid || 'auto'} style={styles.player}>
            <AppIcon image={ART[7].image} size={52} />
            <View style={styles.flex}>
              <Text style={text.title}>Equalizer</Text>
              <Text style={text.caption}>Midnight FM</Text>
            </View>
            <PauseIcon size={22} />
          </LiquidGlassCard>
        </View>
      </View>
    </GlassThemeProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0c1150' },
  stack: { flex: 1, justifyContent: 'center', padding: 16, gap: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.25)',
  },
  player: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  flex: { flex: 1 },
});
