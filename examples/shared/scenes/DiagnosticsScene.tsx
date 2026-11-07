import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  GlassBackdrop,
  LiquidGlassCard,
  getGlassStats,
  resetGlassStats,
  type GlassStats,
} from 'react-native-liquid-glass-native';
import { Background } from '../Background';

export default function DiagnosticsScene() {
  const [stats, setStats] = useState<GlassStats>(getGlassStats());

  // Counters per second: read, show, reset.
  useEffect(() => {
    resetGlassStats();
    const id = setInterval(() => {
      setStats(getGlassStats());
      resetGlassStats();
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background label="Scroll to see the counters move" />
      </GlassBackdrop>

      <View style={styles.stack} pointerEvents="box-none">
        <LiquidGlassCard material="thick">
          <Text style={styles.title}>Glass work per second</Text>
          {Object.entries(stats).map(([key, value]) => (
            <View key={key} style={styles.row}>
              <Text style={styles.key}>{key}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          ))}
        </LiquidGlassCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  stack: { flex: 1, justifyContent: 'flex-end', padding: 16, paddingBottom: 40 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  key: { color: '#fff', fontSize: 14 },
  value: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
