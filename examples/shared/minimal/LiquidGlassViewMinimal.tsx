import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassView } from 'react-native-liquid-glass-native';

const COLORS = ['#ff6b6b', '#feca57', '#48dbfb', '#5f27cd', '#1dd1a1'];

export default function App() {
  return (
    <View style={styles.screen}>
      {/* What the glass blurs. */}
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <ScrollView contentContainerStyle={styles.content}>
          {COLORS.map((color) => (
            <View key={color} style={[styles.block, { backgroundColor: color }]} />
          ))}
        </ScrollView>
      </GlassBackdrop>

      {/* The glass: next to the backdrop, on top of it. */}
      <LiquidGlassView material="regular" style={styles.header}>
        <Text style={styles.title}>Hello, glass</Text>
      </LiquidGlassView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  content: { padding: 16, paddingTop: 120, gap: 16 },
  block: { height: 160, borderRadius: 24 },
  header: { position: 'absolute', top: 48, left: 16, right: 16, padding: 16 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
});
