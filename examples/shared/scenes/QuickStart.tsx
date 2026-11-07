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
        <View>
          <Text style={styles.title}>Discover</Text>
          <Text style={styles.subtitle}>New releases this week</Text>
        </View>
        <Text style={styles.count}>8</Text>
      </LiquidGlassView>

      <LiquidGlassButton
        size="large"
        title="Start listening"
        textStyle={styles.ctaText}
        style={styles.cta}
        onPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0c1150' },
  header: {
    position: 'absolute',
    top: 48,
    left: 16,
    right: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { color: '#fff', fontSize: 28, fontWeight: '800', letterSpacing: -0.6 },
  subtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 15, marginTop: 2 },
  count: { color: '#fff', fontSize: 34, fontWeight: '200' },
  cta: { position: 'absolute', bottom: 40, alignSelf: 'center' },
  ctaText: { color: '#fff', fontWeight: '700' },
});
