import { StyleSheet, Text, View } from 'react-native';
import { FrostedGlass, GlassBackdrop } from 'react-native-liquid-glass-native';
import { Background } from '../Background';

/** The library's own shader on Android and iOS, so both platforms look alike. */
export default function FrostedGlassScene() {
  return (
    <View style={styles.screen}>
      {/* FrostedGlass always needs a backdrop, on iOS too. */}
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background />
      </GlassBackdrop>

      <View style={styles.stack} pointerEvents="box-none">
        <FrostedGlass material="thin" style={styles.panel}>
          <Text style={styles.text}>material="thin"</Text>
        </FrostedGlass>
        <FrostedGlass material="regular" style={styles.panel}>
          <Text style={styles.text}>material="regular"</Text>
        </FrostedGlass>
        <FrostedGlass material="thick" style={styles.panel}>
          <Text style={styles.text}>material="thick"</Text>
        </FrostedGlass>
        <FrostedGlass material="regular" refraction={0.8} chromaticAberration={0.3} quality="high" style={styles.panel}>
          <Text style={styles.text}>refraction 0.8 + RGB split 0.3</Text>
        </FrostedGlass>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  stack: { flex: 1, justifyContent: 'center', padding: 16, gap: 14 },
  panel: { padding: 18 },
  text: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
