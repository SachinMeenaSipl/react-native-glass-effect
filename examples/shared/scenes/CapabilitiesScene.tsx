import { StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassCard, useGlassCapabilities } from 'react-native-liquid-glass-native';
import { Background } from '../Background';
import { Eyebrow, text } from '../ui';

export default function CapabilitiesScene() {
  // Re-read automatically when the app returns to the foreground.
  const caps = useGlassCapabilities();

  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background topInset={40} />
      </GlassBackdrop>

      <View style={styles.stack} pointerEvents="box-none">
        <LiquidGlassCard material="thick" padding={22}>
          <Eyebrow>useGlassCapabilities()</Eyebrow>
          <Text style={styles.renderer}>{caps.bestRenderer}</Text>
          <Text style={text.caption}>
            {caps.platform} {caps.osVersion || ''} · native {caps.isNativeAvailable ? 'available' : 'not available'}
          </Text>

          {Object.entries(caps).map(([key, value]) => (
            <View key={key} style={styles.row}>
              <Text style={text.body}>{key}</Text>
              <Text style={styles.value}>{String(value)}</Text>
            </View>
          ))}
        </LiquidGlassCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0c1150' },
  stack: { flex: 1, justifyContent: 'center', padding: 16 },
  renderer: { color: '#fff', fontSize: 40, fontWeight: '800', letterSpacing: -1 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  value: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
