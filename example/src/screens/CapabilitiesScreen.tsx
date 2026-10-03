import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LiquidGlassCard, useGlassCapabilities } from 'react-native-liquid-glass';

/**
 * What the device can do, plus two edge cases that MUST NOT crash:
 * - glass with no GlassBackdrop at all (→ solid/frosted fallback + logcat warning)
 * - reduceTransparency forced on (→ opaque fallbackColor)
 */
export function CapabilitiesScreen() {
  const caps = useGlassCapabilities();
  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.root}>
      <LiquidGlassCard>
        {Object.entries(caps).map(([k, v]) => (
          <View key={k} style={styles.row}>
            <Text style={styles.key}>{k}</Text>
            <Text>{String(v)}</Text>
          </View>
        ))}
      </LiquidGlassCard>
      <LiquidGlassCard reduceTransparency>
        <Text>reduceTransparency — opaque fallback colour</Text>
      </LiquidGlassCard>
      <LiquidGlassCard backdropId="does-not-exist">
        <Text>backdropId that doesn't exist — solid fallback, no crash</Text>
      </LiquidGlassCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#E9E4F0' },
  content: { padding: 16, paddingTop: 80, gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  key: { fontWeight: '600' },
});
