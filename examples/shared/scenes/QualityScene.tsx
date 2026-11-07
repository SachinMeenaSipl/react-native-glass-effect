import { StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassView, type GlassQuality } from 'react-native-liquid-glass-native';
import { Background } from '../Background';
import { text } from '../ui';

const MODES: { quality: GlassQuality; note: string; cost: number }[] = [
  { quality: 'auto', note: 'Picked per device (default)', cost: 0 },
  { quality: 'high', note: 'Blur + refraction + RGB split', cost: 3 },
  { quality: 'medium', note: 'Blur + refraction', cost: 2 },
  { quality: 'low', note: 'Blur only', cost: 1 },
  { quality: 'static', note: 'Captured once, for still backgrounds', cost: 0 },
];

export default function QualityScene() {
  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background topInset={40} />
      </GlassBackdrop>

      <View style={styles.stack} pointerEvents="box-none">
        {MODES.map(({ quality, note, cost }) => (
          <LiquidGlassView key={quality} quality={quality} chromaticAberration={0.3} style={styles.row}>
            <View style={styles.flex}>
              <Text style={text.title}>{quality}</Text>
              <Text style={text.caption}>{note}</Text>
            </View>
            {/* GPU cost: more bars cost more. "auto" adapts to the device. */}
            <View style={styles.bars}>
              {[1, 2, 3].map((n) => (
                <View key={n} style={[styles.bar, { height: 8 + n * 6, opacity: n <= cost ? 1 : 0.25 }]} />
              ))}
            </View>
          </LiquidGlassView>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0c1150' },
  stack: { flex: 1, justifyContent: 'center', padding: 16, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 18 },
  flex: { flex: 1 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  bar: { width: 6, borderRadius: 3, backgroundColor: '#fff' },
});
