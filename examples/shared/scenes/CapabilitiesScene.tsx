import { StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassCard, useGlassCapabilities } from 'react-native-liquid-glass-native';
import { Background } from '../Background';

export default function CapabilitiesScene() {
  // Re-read automatically when the app returns to the foreground.
  const caps = useGlassCapabilities();

  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background />
      </GlassBackdrop>

      <View style={styles.stack} pointerEvents="box-none">
        <LiquidGlassCard material="thick">
          <Text style={styles.title}>This device</Text>
          {Object.entries(caps).map(([key, value]) => (
            <View key={key} style={styles.row}>
              <Text style={styles.key}>{key}</Text>
              <Text style={styles.value}>{String(value)}</Text>
            </View>
          ))}
        </LiquidGlassCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  stack: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  key: { color: '#fff', fontSize: 14 },
  value: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
