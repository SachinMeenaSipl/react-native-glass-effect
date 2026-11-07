import { StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlass } from 'react-native-liquid-glass-native';
import { Background } from '../Background';

export default function LiquidGlassScene() {
  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background />
      </GlassBackdrop>

      <View style={styles.stack} pointerEvents="box-none">
        {/* Everyday Liquid Glass. iOS 26+ uses Apple's own glass. */}
        <LiquidGlass style={styles.panel}>
          <Text style={styles.title}>variant="regular"</Text>
          <Text style={styles.body}>Frosted enough for text</Text>
        </LiquidGlass>

        {/* A see-through lens: almost no frost, strong edge bending. */}
        <LiquidGlass variant="clear" style={styles.panel}>
          <Text style={styles.title}>variant="clear"</Text>
          <Text style={styles.body}>Best for small controls over media</Text>
        </LiquidGlass>

        <LiquidGlass variant="clear" cornerRadius={36} style={styles.circle}>
          <Text style={styles.icon}>▶</Text>
        </LiquidGlass>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  stack: { flex: 1, justifyContent: 'center', padding: 16, gap: 16 },
  panel: { padding: 18 },
  circle: { width: 72, height: 72, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },
  body: { color: '#fff', fontSize: 14, marginTop: 4 },
  icon: { color: '#fff', fontSize: 26 },
});
