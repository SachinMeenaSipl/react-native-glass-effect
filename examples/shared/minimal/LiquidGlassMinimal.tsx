import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlass } from 'react-native-liquid-glass-native';

const COLORS = ['#ff6b6b', '#feca57', '#48dbfb', '#5f27cd', '#1dd1a1'];

export default function App() {
  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <ScrollView contentContainerStyle={styles.content}>
          {COLORS.map((color) => (
            <View key={color} style={[styles.block, { backgroundColor: color }]} />
          ))}
        </ScrollView>
      </GlassBackdrop>

      {/* Apple's glass on iOS 26+; the library's shader, tuned to match, on Android. */}
      <LiquidGlass style={styles.panel}>
        <Text style={styles.text}>variant="regular"</Text>
      </LiquidGlass>

      {/* A see-through lens for small controls over media. */}
      <LiquidGlass variant="clear" cornerRadius={999} style={styles.pill}>
        <Text style={styles.text}>clear</Text>
      </LiquidGlass>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  content: { padding: 16, paddingTop: 120, gap: 16 },
  block: { height: 160, borderRadius: 24 },
  panel: { position: 'absolute', top: 48, left: 16, right: 16, padding: 18 },
  pill: { position: 'absolute', bottom: 48, alignSelf: 'center', paddingHorizontal: 24, height: 48, justifyContent: 'center' },
  text: { color: '#111', fontSize: 16, fontWeight: '600' },
});
