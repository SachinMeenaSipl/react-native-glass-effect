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
import { Eyebrow, text } from '../ui';

export default function AccessibilityScene() {
  // Android has no system "reduce transparency" setting, so apps can offer their own.
  const [solid, setSolid] = useState(false);
  const systemReduceTransparency = useReduceTransparency();
  const systemReduceMotion = useReduceMotion();

  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background topInset={40} />
      </GlassBackdrop>

      <View style={styles.stack} pointerEvents="box-none">
        <LiquidGlassView reduceTransparency={solid || 'auto'} fallbackColor="#1F2333" style={styles.panel}>
          <Eyebrow>{solid ? 'reduceTransparency · solid surface' : 'glass'}</Eyebrow>
          <Text style={text.title}>Display & text</Text>

          <View style={styles.row}>
            <Text style={text.body}>Use solid surfaces</Text>
            <Switch value={solid} onValueChange={setSolid} />
          </View>
          <View style={styles.row}>
            <Text style={text.body}>System Reduce Transparency</Text>
            <Text style={styles.value}>{systemReduceTransparency ? 'On' : 'Off'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={text.body}>System Reduce Motion</Text>
            <Text style={styles.value}>{systemReduceMotion ? 'On' : 'Off'}</Text>
          </View>
        </LiquidGlassView>

        {/* Buttons announce as buttons, including the disabled state. */}
        <LiquidGlassButton
          size="large"
          title="Save changes"
          textStyle={styles.buttonText}
          accessibilityLabel="Save changes"
          accessibilityHint="Saves your display settings"
          onPress={() => {}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0c1150' },
  stack: { flex: 1, justifyContent: 'center', padding: 16, gap: 18 },
  panel: { padding: 20 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.25)',
  },
  value: { color: '#fff', fontSize: 15, fontWeight: '700' },
  buttonText: { color: '#fff', fontWeight: '700' },
});
