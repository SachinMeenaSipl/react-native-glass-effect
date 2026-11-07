import { StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, GlassThemeProvider, LiquidGlassCard, LiquidGlassView } from 'react-native-liquid-glass-native';
import { Background } from '../Background';

export default function ThemeScene() {
  return (
    // App-wide defaults: every glass below uses them unless it passes its own prop.
    <GlassThemeProvider
      theme={{
        defaultMaterial: 'thick',
        cornerRadius: 28,
        materials: {
          thick: { blur: 40, tint: { light: '#E8F0FF', dark: '#0F1A33' } },
        },
      }}
    >
      <View style={styles.screen}>
        <GlassBackdrop style={StyleSheet.absoluteFill}>
          <Background />
        </GlassBackdrop>

        <View style={styles.stack} pointerEvents="box-none">
          <LiquidGlassCard>
            <Text style={styles.title}>From the theme</Text>
            <Text style={styles.body}>thick · blur 40 · corners 28 · blue tint</Text>
          </LiquidGlassCard>

          {/* A component prop still wins over the theme. */}
          <LiquidGlassCard material="thin">
            <Text style={styles.title}>Prop wins</Text>
            <Text style={styles.body}>material="thin" overrides defaultMaterial</Text>
          </LiquidGlassCard>

          {/* Nested providers: the inner one wins for its subtree. */}
          <GlassThemeProvider theme={{ defaultMaterial: 'clear', cornerRadius: 999 }}>
            <LiquidGlassView style={styles.pill}>
              <Text style={styles.body}>Nested theme: clear pill</Text>
            </LiquidGlassView>
          </GlassThemeProvider>
        </View>
      </View>
    </GlassThemeProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  stack: { flex: 1, justifyContent: 'center', padding: 16, gap: 16 },
  pill: { height: 52, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, alignSelf: 'center' },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },
  body: { color: '#fff', fontSize: 14, marginTop: 4 },
});
