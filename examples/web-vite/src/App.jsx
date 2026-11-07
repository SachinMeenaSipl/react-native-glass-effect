import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  FrostedGlass,
  GlassBackdrop,
  LiquidGlass,
  LiquidGlassButton,
  LiquidGlassView,
  useGlassCapabilities,
} from 'react-native-liquid-glass-native';

const SWATCHES = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#5f27cd', '#1dd1a1', '#ff9ff3'];

export default function App() {
  const caps = useGlassCapabilities();
  const [pressCount, setPressCount] = useState(0);

  return (
    <View style={styles.root}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <ScrollView contentContainerStyle={styles.backdropContent}>
          {SWATCHES.map((color, i) => (
            <View key={color} style={[styles.swatch, { backgroundColor: color }]} />
          ))}
        </ScrollView>
      </GlassBackdrop>

      <View style={styles.overlay}>
        <LiquidGlassView material="regular" style={styles.header}>
          <Text style={styles.title}>Liquid Glass · Web</Text>
          <Text style={styles.body}>
            renderer: {caps.bestRenderer} · native: {caps.isNativeAvailable ? 'yes' : 'no'}
          </Text>
        </LiquidGlassView>

        <LiquidGlass variant="regular" style={styles.card}>
          <Text style={styles.body}>LiquidGlass (Apple-style)</Text>
        </LiquidGlass>

        <FrostedGlass material="thick" style={styles.card}>
          <Text style={styles.body}>FrostedGlass (same shader everywhere)</Text>
        </FrostedGlass>

        <LiquidGlassButton title={`Pressed ${pressCount}×`} onPress={() => setPressCount((n) => n + 1)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, minHeight: '100vh', backgroundColor: '#0b0b14' },
  backdropContent: { paddingTop: 120, paddingBottom: 400 },
  swatch: { height: 110, borderRadius: 28, marginHorizontal: 24, marginBottom: 28 },
  overlay: { flex: 1, justifyContent: 'flex-end', padding: 16, gap: 12 },
  header: { marginTop: 56, padding: 16, borderRadius: 24 },
  card: { padding: 16, borderRadius: 24 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },
  body: { color: '#fff', fontSize: 14 },
});
