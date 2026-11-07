import { StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassButton, LiquidGlassView } from 'react-native-liquid-glass-native';
import { Background } from '../Background';

export default function QuickStart() {
  return (
    <View style={styles.screen}>
      {/* 1. BACKGROUND: everything the glass should blur goes inside the backdrop. */}
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background />
      </GlassBackdrop>

      {/* 2. GLASS: next to the backdrop, on top of it. Never inside it. */}
      <LiquidGlassView material="regular" style={styles.header}>
        <Text style={styles.title}>Photos</Text>
        <Text style={styles.subtitle}>Scroll the background under the glass</Text>
      </LiquidGlassView>

      <LiquidGlassButton title="Continue" style={styles.cta} onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  header: { position: 'absolute', top: 48, left: 16, right: 16, padding: 16 },
  title: { color: '#fff', fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#fff', fontSize: 14, marginTop: 4 },
  cta: { position: 'absolute', bottom: 40, alignSelf: 'center' },
});
