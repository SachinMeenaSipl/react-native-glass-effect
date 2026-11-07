import { StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassView, type GlassQuality } from 'react-native-liquid-glass-native';
import { Background } from '../Background';

const MODES: { quality: GlassQuality; note: string }[] = [
  { quality: 'auto', note: 'Picked per device (default)' },
  { quality: 'high', note: 'Blur + refraction + RGB split' },
  { quality: 'medium', note: 'Blur + refraction' },
  { quality: 'low', note: 'Blur only' },
  { quality: 'static', note: 'Captured once; for still backgrounds' },
];

export default function QualityScene() {
  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background />
      </GlassBackdrop>

      <View style={styles.stack} pointerEvents="box-none">
        {MODES.map(({ quality, note }) => (
          <LiquidGlassView key={quality} quality={quality} chromaticAberration={0.3} style={styles.panel}>
            <Text style={styles.title}>quality="{quality}"</Text>
            <Text style={styles.body}>{note}</Text>
          </LiquidGlassView>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  stack: { flex: 1, justifyContent: 'center', padding: 16, gap: 12 },
  panel: { paddingVertical: 12, paddingHorizontal: 16 },
  title: { color: '#fff', fontSize: 16, fontWeight: '700' },
  body: { color: '#fff', fontSize: 13, marginTop: 2 },
});
