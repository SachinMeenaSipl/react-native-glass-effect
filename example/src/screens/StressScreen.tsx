import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  GlassBackdrop,
  LiquidGlassButton,
  LiquidGlassCard,
  getGlassStats,
  resetGlassStats,
  type GlassStats,
} from 'react-native-liquid-glass';

/** Per-second glass work, read from the native counters. */
function useGlassStatsPerSecond(): GlassStats | null {
  const [stats, setStats] = useState<GlassStats | null>(null);
  useEffect(() => {
    resetGlassStats();
    const id = setInterval(() => {
      setStats(getGlassStats());
      resetGlassStats();
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return stats;
}

/**
 * Many glass cards scrolling over a FIXED backdrop.
 * Tests: quality="auto" steps down after 6 / 12 glass views; cards moving over a
 * still background (geometry change detection); performance.
 * The overlay shows native work per second (see getGlassStats).
 */
export function StressScreen() {
  const [count, setCount] = useState(4);
  const s = useGlassStatsPerSecond();
  return (
    <View style={styles.root}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <View style={styles.stripes}>
          {Array.from({ length: 24 }, (_, i) => (
            <View key={i} style={[styles.stripe, { backgroundColor: i % 2 ? '#4D96FF' : '#FFD93D' }]} />
          ))}
        </View>
      </GlassBackdrop>

      <ScrollView contentContainerStyle={styles.list}>
        {Array.from({ length: count }, (_, i) => (
          <LiquidGlassCard key={i} style={styles.card}>
            <Text style={styles.text}>Glass card {i + 1}</Text>
          </LiquidGlassCard>
        ))}
      </ScrollView>

      {s && (
        <View style={styles.stats} pointerEvents="none">
          <Text style={styles.statsText}>
            live {s.liveGlassViews} · draws {s.glassDraws}/s · blur {s.gpuBlurPasses}/s · shader{' '}
            {s.shaderPasses}/s
          </Text>
          <Text style={styles.statsText}>
            captures {s.compatCaptures}/s ({s.compatCaptures ? (s.compatCaptureMs / s.compatCaptures).toFixed(1) : 0} ms
            each) · skipped {s.skippedFarChanges}/s · solid {s.solidDraws}/s
          </Text>
        </View>
      )}

      <View style={styles.controls}>
        <LiquidGlassButton title="− 4" size="small" onPress={() => setCount((c) => Math.max(1, c - 4))} />
        <Text style={styles.count}>{count} views</Text>
        <LiquidGlassButton title="+ 4" size="small" onPress={() => setCount((c) => c + 4)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  stripes: { flex: 1, flexDirection: 'row', transform: [{ rotate: '20deg' }, { scale: 1.6 }] },
  stripe: { flex: 1 },
  list: { padding: 16, paddingTop: 80, paddingBottom: 140, gap: 12 },
  card: { height: 90, justifyContent: 'center' },
  text: { fontSize: 18, fontWeight: '700' },
  controls: {
    position: 'absolute', bottom: 40, left: 16, right: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  count: { fontWeight: '800', fontSize: 16, color: '#000' },
  stats: {
    position: 'absolute', top: 56, left: 8, right: 8, padding: 6,
    borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.65)',
  },
  statsText: { color: '#fff', fontSize: 11, fontVariant: ['tabular-nums'] },
});
