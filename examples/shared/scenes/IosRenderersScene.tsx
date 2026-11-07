import { StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassView } from 'react-native-liquid-glass-native';
import { Background } from '../Background';

/**
 * iOS only: compare Apple's glass with the library's Metal renderer.
 * Android and web ignore `iosRenderer`, so both panels look the same there.
 */
export default function IosRenderersScene() {
  return (
    <View style={styles.screen}>
      {/* iosRenderer="shader" needs a backdrop, like Android always does. */}
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background />
      </GlassBackdrop>

      <View style={styles.stack} pointerEvents="box-none">
        <LiquidGlassView iosRenderer="system" style={styles.panel}>
          <Text style={styles.title}>iosRenderer="system"</Text>
          <Text style={styles.body}>Apple's glass (default). Lighter, the system decides the look.</Text>
        </LiquidGlassView>

        <LiquidGlassView iosRenderer="shader" refraction={0.6} style={styles.panel}>
          <Text style={styles.title}>iosRenderer="shader"</Text>
          <Text style={styles.body}>The library's renderer. Matches Android; every prop works.</Text>
        </LiquidGlassView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  stack: { flex: 1, justifyContent: 'center', padding: 16, gap: 16 },
  panel: { padding: 18 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },
  body: { color: '#fff', fontSize: 14, marginTop: 4 },
});
