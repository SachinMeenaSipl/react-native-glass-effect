import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassButton } from 'react-native-liquid-glass-native';
import { ART } from '../assets';
import { Wallpaper } from '../Background';
import { PlayIcon } from '../ui';

/** An onboarding screen with every button size, custom content and a disabled state. */
export default function ButtonScene() {
  const [plays, setPlays] = useState(0);

  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Wallpaper />
        <Image source={ART[0].image} style={styles.hero} />
      </GlassBackdrop>

      <View style={styles.content} pointerEvents="box-none">
        <Text style={styles.headline}>Music that sounds{'\n'}like glass.</Text>
        <Text style={styles.subhead}>Millions of songs. No ads. Cancel anytime.</Text>

        {/* Three sizes: 36, 48 and 56 dp tall. Pill-shaped by default. */}
        <LiquidGlassButton size="large" title="Get started" textStyle={styles.strong} style={styles.wide} />
        <LiquidGlassButton size="medium" title="I already have an account" textStyle={styles.label} />

        {/* Custom content instead of a title. */}
        <LiquidGlassButton material="thick" onPress={() => setPlays((n) => n + 1)}>
          <PlayIcon size={16} />
          <Text style={styles.label}>{plays ? `Preview played ${plays}×` : 'Play a preview'}</Text>
        </LiquidGlassButton>

        <View style={styles.row}>
          <LiquidGlassButton size="small" title="Skip" textStyle={styles.label} />
          {/* Disabled: dimmed, no press feedback, announced as disabled. */}
          <LiquidGlassButton size="small" title="Downloading…" textStyle={styles.label} disabled />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0c1150' },
  hero: { position: 'absolute', top: 70, alignSelf: 'center', width: 280, height: 280, borderRadius: 36 },
  content: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', padding: 24, paddingBottom: 44, gap: 14 },
  headline: { color: '#fff', fontSize: 34, fontWeight: '800', letterSpacing: -1, textAlign: 'center' },
  subhead: { color: 'rgba(255,255,255,0.8)', fontSize: 16, textAlign: 'center', marginBottom: 14 },
  wide: { alignSelf: 'stretch' },
  row: { flexDirection: 'row', gap: 12 },
  strong: { color: '#fff', fontWeight: '700' },
  label: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
