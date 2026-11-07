import { StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, GlassThemeProvider, LiquidGlassCard, LiquidGlassView } from 'react-native-liquid-glass-native';
import { Background } from '../Background';
import { Eyebrow, text } from '../ui';

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
          <Background topInset={40} />
        </GlassBackdrop>

        <View style={styles.stack} pointerEvents="box-none">
          <LiquidGlassCard padding={20}>
            <Eyebrow>From the theme · thick, blur 40, corners 28</Eyebrow>
            <Text style={text.title}>3 events today</Text>
            <Text style={text.body}>Standup 10:00 · Lunch 12:30 · Mix review 16:00</Text>
          </LiquidGlassCard>

          {/* A component prop still wins over the theme. */}
          <LiquidGlassCard material="thin" padding={20}>
            <Eyebrow>Prop wins · material="thin"</Eyebrow>
            <Text style={text.title}>8,432 steps</Text>
            <Text style={text.body}>71% of your daily goal</Text>
          </LiquidGlassCard>

          {/* Nested providers: the inner one wins for its subtree. */}
          <GlassThemeProvider theme={{ defaultMaterial: 'clear', cornerRadius: 999 }}>
            <LiquidGlassView style={styles.pill}>
              <Text style={styles.pillText}>Nested theme · clear pill</Text>
            </LiquidGlassView>
          </GlassThemeProvider>
        </View>
      </View>
    </GlassThemeProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0c1150' },
  stack: { flex: 1, justifyContent: 'center', padding: 16, gap: 16 },
  pill: { height: 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, alignSelf: 'center' },
  pillText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
