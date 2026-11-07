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
import { Eyebrow, text } from '../ui';

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
        <Background />
      </GlassBackdrop>

      <View style={styles.stack} pointerEvents="box-none">
        <LiquidGlassCard material="thick" padding={20}>
          <Eyebrow>getGlassStats() · per second</Eyebrow>
          <Text style={text.title}>Scroll the feed and watch</Text>
          <View style={styles.grid}>
            {Object.entries(stats).map(([key, value]) => (
              <View key={key} style={styles.cell}>
                <Text style={styles.value}>{value}</Text>
                <Text style={text.caption}>{key}</Text>
              </View>
            ))}
          </View>
        </LiquidGlassCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0c1150' },
  stack: { flex: 1, justifyContent: 'flex-end', padding: 16, paddingBottom: 36 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, rowGap: 12 },
  cell: { width: '50%' },
  value: { color: '#fff', fontSize: 26, fontWeight: '700', fontVariant: ['tabular-nums'] },
});
