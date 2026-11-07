import { StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassView } from 'react-native-liquid-glass-native';
import { Background } from '../Background';

export default function LiquidGlassViewScene() {
  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background />
      </GlassBackdrop>

      <View style={styles.stack} pointerEvents="box-none">
        {/* Defaults: the theme's material ("regular") and corner radius (24). */}
        <LiquidGlassView style={styles.panel}>
          <Text style={styles.title}>Default glass</Text>
          <Text style={styles.body}>material="regular", cornerRadius 24</Text>
        </LiquidGlassView>

        {/* A tinted, rounder panel. Use tint + tintOpacity, never backgroundColor. */}
        <LiquidGlassView
          material="thick"
          tint="#6D5DFC"
          tintOpacity={0.25}
          cornerRadius={32}
          style={styles.panel}
        >
          <Text style={styles.title}>Tinted, thick</Text>
          <Text style={styles.body}>tint="#6D5DFC" tintOpacity={0.25}</Text>
        </LiquidGlassView>

        {/* A pill: corner radius of half the height or more. */}
        <LiquidGlassView material="thin" cornerRadius={999} style={styles.pill}>
          <Text style={styles.body}>Pill, material="thin"</Text>
        </LiquidGlassView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  stack: { flex: 1, justifyContent: 'center', padding: 16, gap: 16 },
  panel: { padding: 18 },
  pill: { height: 52, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', paddingHorizontal: 24 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },
  body: { color: '#fff', fontSize: 14, marginTop: 4 },
});
