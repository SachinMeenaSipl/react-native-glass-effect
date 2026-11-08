import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { GlassBackdrop, LiquidGlassButton } from 'react-native-liquid-glass-native';

const COLORS = ['#ff6b6b', '#feca57', '#48dbfb', '#5f27cd', '#1dd1a1'];

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <ScrollView contentContainerStyle={styles.content}>
          {COLORS.map((color) => (
            <View key={color} style={[styles.block, { backgroundColor: color }]} />
          ))}
        </ScrollView>
      </GlassBackdrop>

      <View style={styles.buttons} pointerEvents="box-none">
        <LiquidGlassButton
          size="large"
          title={`Pressed ${count}×`}
          textStyle={styles.label}
          onPress={() => setCount((n) => n + 1)}
        />
        <LiquidGlassButton size="small" title="Disabled" textStyle={styles.label} disabled />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  content: { padding: 16, paddingTop: 40, gap: 16 },
  block: { height: 160, borderRadius: 24 },
  buttons: { position: 'absolute', left: 0, right: 0, bottom: 48, alignItems: 'center', gap: 12 },
  // The default label is dark in light mode; set a colour that suits your background.
  label: { color: '#fff', fontWeight: '700' },
});
