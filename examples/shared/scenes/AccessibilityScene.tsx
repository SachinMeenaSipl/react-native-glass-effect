import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import {
  GlassBackdrop,
  LiquidGlassButton,
  LiquidGlassView,
  useReduceMotion,
  useReduceTransparency,
} from 'react-native-liquid-glass-native';
import { Background } from '../Background';

export default function AccessibilityScene() {
  // Android has no system "reduce transparency" setting, so apps can offer their own.
  const [solid, setSolid] = useState(false);
  const systemReduceTransparency = useReduceTransparency();
  const systemReduceMotion = useReduceMotion();

  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background />
      </GlassBackdrop>

      <View style={styles.stack} pointerEvents="box-none">
        <LiquidGlassView reduceTransparency={solid || 'auto'} fallbackColor="#1F2333" style={styles.panel}>
          <Text style={styles.title}>{solid ? 'Solid surface' : 'Glass'}</Text>
          <Text style={styles.body}>System reduce transparency: {String(systemReduceTransparency)}</Text>
          <Text style={styles.body}>System reduce motion: {String(systemReduceMotion)}</Text>
          <View style={styles.row}>
            <Text style={styles.body}>Use solid surfaces</Text>
            <Switch value={solid} onValueChange={setSolid} />
          </View>
        </LiquidGlassView>

        {/* Buttons announce as buttons, including the disabled state. */}
        <LiquidGlassButton
          title="Save"
          accessibilityLabel="Save changes"
          accessibilityHint="Saves your settings"
          onPress={() => {}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  stack: { flex: 1, justifyContent: 'center', padding: 16, gap: 16 },
  panel: { padding: 18 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },
  body: { color: '#fff', fontSize: 14, marginTop: 4 },
});
