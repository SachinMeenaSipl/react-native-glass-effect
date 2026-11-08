import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassCard } from 'react-native-liquid-glass-native';

const COLORS = ['#ff6b6b', '#feca57', '#48dbfb', '#5f27cd', '#1dd1a1'];

export default function App() {
  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <ScrollView contentContainerStyle={styles.content}>
          {COLORS.map((color) => (
            <View key={color} style={[styles.block, { backgroundColor: color }]} />
          ))}
        </ScrollView>
      </GlassBackdrop>

      {/* A LiquidGlassView with padding (default 16). */}
      <LiquidGlassCard style={styles.card}>
        <Text style={styles.label}>Total balance</Text>
        <Text style={styles.amount}>$12,480.32</Text>
      </LiquidGlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  content: { padding: 16, paddingTop: 40, gap: 16 },
  block: { height: 160, borderRadius: 24 },
  card: { position: 'absolute', left: 16, right: 16, top: 120 },
  label: { color: '#fff', fontSize: 14 },
  amount: { color: '#fff', fontSize: 36, fontWeight: '700' },
});
