import { StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassView } from 'react-native-liquid-glass-native';
import { Background } from '../Background';

export default function AppearanceScene() {
  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background />
      </GlassBackdrop>

      <View style={styles.stack} pointerEvents="box-none">
        {/* intensity scales blur, refraction, distortion, light and RGB split together. */}
        <View style={styles.row}>
          <LiquidGlassView intensity={0.3} style={styles.half}>
            <Text style={styles.text}>intensity 0.3</Text>
          </LiquidGlassView>
          <LiquidGlassView intensity={1} style={styles.half}>
            <Text style={styles.text}>intensity 1</Text>
          </LiquidGlassView>
        </View>

        {/* Override single values on top of the material. */}
        <LiquidGlassView material="regular" blur={48} tint="#00C2A8" tintOpacity={0.3} style={styles.full}>
          <Text style={styles.text}>blur 48 · teal tint 30%</Text>
        </LiquidGlassView>

        {/* Light comes from the bottom-left; a stronger rim and border. */}
        <LiquidGlassView illumination={1} lightAngle={135} borderWidth={2} borderOpacity={0.7} style={styles.full}>
          <Text style={styles.text}>light 1 · angle 135° · border 2</Text>
        </LiquidGlassView>

        {/* Square corners and no border. */}
        <LiquidGlassView cornerRadius={0} borderWidth={0} style={styles.full}>
          <Text style={styles.text}>cornerRadius 0 · borderWidth 0</Text>
        </LiquidGlassView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  stack: { flex: 1, justifyContent: 'center', padding: 16, gap: 14 },
  row: { flexDirection: 'row', gap: 14 },
  half: { flex: 1, height: 90, alignItems: 'center', justifyContent: 'center' },
  full: { height: 72, alignItems: 'center', justifyContent: 'center' },
  text: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
