import { StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassCard } from 'react-native-liquid-glass-native';
import { Background } from '../Background';

export default function CardScene() {
  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background />
      </GlassBackdrop>

      <View style={styles.stack} pointerEvents="box-none">
        {/* Default: padding 16, material "regular". */}
        <LiquidGlassCard>
          <Text style={styles.title}>Weather</Text>
          <Text style={styles.big}>21°</Text>
          <Text style={styles.body}>Partly cloudy · H 24° L 15°</Text>
        </LiquidGlassCard>

        {/* Any LiquidGlassView prop works, plus `padding`. */}
        <LiquidGlassCard material="thick" padding={24} cornerRadius={28}>
          <Text style={styles.title}>Up next</Text>
          <Text style={styles.body}>Design review · 14:00</Text>
          <Text style={styles.body}>Room 4B</Text>
        </LiquidGlassCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  stack: { flex: 1, justifyContent: 'center', padding: 16, gap: 16 },
  title: { color: '#fff', fontSize: 16, fontWeight: '700' },
  big: { color: '#fff', fontSize: 48, fontWeight: '200' },
  body: { color: '#fff', fontSize: 14, marginTop: 2 },
});
