import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassView } from 'react-native-liquid-glass-native';
import { Background } from '../Background';

export default function InteractionScene() {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background />
      </GlassBackdrop>

      <View style={styles.stack} pointerEvents="box-none">
        {/* Android: a light follows the finger and the surface squishes and springs back.
            iOS 26+: Apple's interactive glass. */}
        <LiquidGlassView interactive style={styles.panel}>
          <Text style={styles.title}>interactive</Text>
          <Text style={styles.body}>Press and drag your finger across me</Text>
        </LiquidGlassView>

        {/* Android: the rim light follows device tilt (uses the gyroscope). */}
        <LiquidGlassView material="clear" interactive motionLighting style={styles.panel}>
          <Text style={styles.title}>motionLighting</Text>
          <Text style={styles.body}>Tilt the phone</Text>
        </LiquidGlassView>

        {/* Prop changes animate natively over transitionDuration (ms). */}
        <Pressable onPress={() => setExpanded((v) => !v)}>
          <LiquidGlassView
            material={expanded ? 'thick' : 'thin'}
            tintOpacity={expanded ? 0.4 : 0.08}
            transitionDuration={300}
            style={styles.panel}
          >
            <Text style={styles.title}>Tap to switch material</Text>
            <Text style={styles.body}>{expanded ? 'thick' : 'thin'} · animates over 300 ms</Text>
          </LiquidGlassView>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  stack: { flex: 1, justifyContent: 'center', padding: 16, gap: 16 },
  panel: { padding: 18 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },
  body: { color: '#fff', fontSize: 14, marginTop: 4 },
});
