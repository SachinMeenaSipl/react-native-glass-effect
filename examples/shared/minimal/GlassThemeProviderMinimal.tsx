import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, GlassThemeProvider, LiquidGlassCard } from 'react-native-liquid-glass-native';

const COLORS = ['#ff6b6b', '#feca57', '#48dbfb', '#5f27cd', '#1dd1a1'];

export default function App() {
  return (
    // Defaults for every glass inside. A component prop still wins.
    <GlassThemeProvider theme={{ defaultMaterial: 'thick', cornerRadius: 28 }}>
      <View style={styles.screen}>
        <GlassBackdrop style={StyleSheet.absoluteFill}>
          <ScrollView contentContainerStyle={styles.content}>
            {COLORS.map((color) => (
              <View key={color} style={[styles.block, { backgroundColor: color }]} />
            ))}
          </ScrollView>
        </GlassBackdrop>

        <View style={styles.stack} pointerEvents="box-none">
          <LiquidGlassCard>
            <Text style={styles.text}>From the theme: thick, corners 28</Text>
          </LiquidGlassCard>
          <LiquidGlassCard material="thin">
            <Text style={styles.text}>The prop wins: thin</Text>
          </LiquidGlassCard>
        </View>
      </View>
    </GlassThemeProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  content: { padding: 16, paddingTop: 40, gap: 16 },
  block: { height: 160, borderRadius: 24 },
  stack: { flex: 1, justifyContent: 'center', padding: 16, gap: 16 },
  text: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
