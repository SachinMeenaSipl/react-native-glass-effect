import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { FrostedGlass, GlassBackdrop } from 'react-native-liquid-glass-native';

const COLORS = ['#ff6b6b', '#feca57', '#48dbfb', '#5f27cd', '#1dd1a1'];

export default function App() {
  return (
    <View style={styles.screen}>
      {/* FrostedGlass needs a backdrop on iOS too: its shader samples it. */}
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <ScrollView contentContainerStyle={styles.content}>
          {COLORS.map((color) => (
            <View key={color} style={[styles.block, { backgroundColor: color }]} />
          ))}
        </ScrollView>
      </GlassBackdrop>

      <FrostedGlass material="thick" refraction={0.6} style={styles.card}>
        <Text style={styles.title}>Same look on Android and iOS</Text>
        <Text style={styles.body}>The library's shader draws this glass on both.</Text>
      </FrostedGlass>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  content: { padding: 16, paddingTop: 40, gap: 16 },
  block: { height: 160, borderRadius: 24 },
  card: { position: 'absolute', left: 16, right: 16, bottom: 48, padding: 20 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },
  body: { color: '#fff', fontSize: 15, marginTop: 4 },
});
