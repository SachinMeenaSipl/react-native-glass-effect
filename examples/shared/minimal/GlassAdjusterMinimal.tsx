import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  DEFAULT_GLASS_ADJUSTMENTS,
  FrostedGlass,
  GlassAdjuster,
  GlassBackdrop,
} from 'react-native-liquid-glass-native';

const COLORS = ['#ff6b6b', '#feca57', '#48dbfb', '#5f27cd', '#1dd1a1'];

export default function App() {
  // One object holds every value; spread it onto the glass you're tuning.
  const [look, setLook] = useState(DEFAULT_GLASS_ADJUSTMENTS);

  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <ScrollView contentContainerStyle={styles.content}>
          {COLORS.map((color) => (
            <View key={color} style={[styles.block, { backgroundColor: color }]} />
          ))}
        </ScrollView>
      </GlassBackdrop>

      <View style={styles.stack} pointerEvents="box-none">
        <FrostedGlass {...look} style={styles.preview}>
          <Text style={styles.text}>Tune me</Text>
        </FrostedGlass>
        <GlassAdjuster value={look} onChange={setLook} controls={['blur', 'tintOpacity', 'cornerRadius']} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  content: { padding: 16, paddingTop: 40, gap: 16 },
  block: { height: 160, borderRadius: 24 },
  stack: { flex: 1, justifyContent: 'center', padding: 16, gap: 16 },
  preview: { padding: 24 },
  text: { color: '#fff', fontSize: 20, fontWeight: '700' },
});
