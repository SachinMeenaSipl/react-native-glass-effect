import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassButton } from 'react-native-liquid-glass-native';
import { Background } from '../Background';

export default function ButtonScene() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background />
      </GlassBackdrop>

      <View style={styles.stack} pointerEvents="box-none">
        {/* Three sizes: 36, 48 and 56 dp tall. Pill-shaped by default. */}
        <LiquidGlassButton size="small" title="Small" onPress={() => setCount((n) => n + 1)} />
        <LiquidGlassButton size="medium" title="Medium" onPress={() => setCount((n) => n + 1)} />
        <LiquidGlassButton size="large" title={`Large · pressed ${count}×`} onPress={() => setCount((n) => n + 1)} />

        {/* Custom content instead of a title. */}
        <LiquidGlassButton material="thick" onPress={() => setCount(0)}>
          <Text style={styles.icon}>↺</Text>
          <Text style={styles.label}>Reset</Text>
        </LiquidGlassButton>

        {/* Disabled: dimmed, no press feedback, announced as disabled. */}
        <LiquidGlassButton title="Disabled" disabled />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  stack: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  icon: { color: '#fff', fontSize: 18 },
  label: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
