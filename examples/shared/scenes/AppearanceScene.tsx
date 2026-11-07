import { StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassView } from 'react-native-liquid-glass-native';
import { Background } from '../Background';
import { Eyebrow, text } from '../ui';

export default function AppearanceScene() {
  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background topInset={40} />
      </GlassBackdrop>

      <View style={styles.stack} pointerEvents="box-none">
        {/* intensity scales blur, refraction, distortion, light and RGB split together. */}
        <View style={styles.row}>
          <LiquidGlassView intensity={0.3} style={styles.half}>
            <Eyebrow>intensity 0.3</Eyebrow>
            <Text style={text.title}>Subtle</Text>
          </LiquidGlassView>
          <LiquidGlassView intensity={1} style={styles.half}>
            <Eyebrow>intensity 1</Eyebrow>
            <Text style={text.title}>Full</Text>
          </LiquidGlassView>
        </View>

        {/* Override single values on top of the material. */}
        <LiquidGlassView blur={48} tint="#00C2A8" tintOpacity={0.35} style={styles.full}>
          <Eyebrow>blur 48 · tint #00C2A8 at 35%</Eyebrow>
          <Text style={text.title}>Brand-tinted glass</Text>
        </LiquidGlassView>

        {/* Light from the bottom-left, a stronger rim and a thicker border. */}
        <LiquidGlassView illumination={1} lightAngle={135} borderWidth={2} borderOpacity={0.7} style={styles.full}>
          <Eyebrow>illumination 1 · lightAngle 135 · border 2</Eyebrow>
          <Text style={text.title}>Lit from below</Text>
        </LiquidGlassView>

        {/* Square corners and no border. */}
        <LiquidGlassView cornerRadius={0} borderWidth={0} style={styles.full}>
          <Eyebrow>cornerRadius 0 · borderWidth 0</Eyebrow>
          <Text style={text.title}>Edge to edge</Text>
        </LiquidGlassView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0c1150' },
  stack: { flex: 1, justifyContent: 'center', padding: 16, gap: 14 },
  row: { flexDirection: 'row', gap: 14 },
  half: { flex: 1, padding: 18 },
  full: { padding: 18 },
});
