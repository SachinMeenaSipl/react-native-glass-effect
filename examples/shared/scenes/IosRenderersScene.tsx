import { StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassView } from 'react-native-liquid-glass-native';
import { Background } from '../Background';
import { Eyebrow, text } from '../ui';

/**
 * iOS only: compare Apple's glass with the library's Metal renderer.
 * Android and web ignore `iosRenderer`, so both panels look the same there.
 */
export default function IosRenderersScene() {
  return (
    <View style={styles.screen}>
      {/* iosRenderer="shader" needs a backdrop, like Android always does. */}
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background topInset={40} />
      </GlassBackdrop>

      <View style={styles.stack} pointerEvents="box-none">
        <LiquidGlassView iosRenderer="system" style={styles.panel}>
          <Eyebrow>iosRenderer="system" · default</Eyebrow>
          <Text style={text.title}>Apple's glass</Text>
          <Text style={text.body}>Lighter and paler. The system decides the look.</Text>
        </LiquidGlassView>

        <LiquidGlassView iosRenderer="shader" refraction={0.6} style={styles.panel}>
          <Eyebrow>iosRenderer="shader"</Eyebrow>
          <Text style={text.title}>The library's renderer</Text>
          <Text style={text.body}>Matches Android, and every prop works on iOS.</Text>
        </LiquidGlassView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0c1150' },
  stack: { flex: 1, justifyContent: 'center', padding: 16, gap: 16 },
  panel: { padding: 20 },
});
