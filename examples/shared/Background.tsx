import { ScrollView, StyleSheet, Text, View } from 'react-native';

const BANDS = ['#ff6b6b', '#feca57', '#48dbfb', '#5f27cd', '#1dd1a1', '#ff9ff3', '#54a0ff', '#ee5253'];

/**
 * Colourful, scrollable content for glass to blur. Every example scene puts this
 * inside a <GlassBackdrop>, so the glass has something visible to bend and blur.
 */
export function Background({ label = 'Scroll me' }: { label?: string }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      {BANDS.map((color, i) => (
        <View key={color} style={[styles.band, { backgroundColor: color }]}>
          <Text style={styles.bandText}>
            {label} · {i + 1}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 24, paddingBottom: 240, gap: 20, backgroundColor: '#0b0b14' },
  band: {
    height: 120,
    marginHorizontal: 20,
    borderRadius: 28,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  bandText: { color: '#ffffff', fontSize: 22, fontWeight: '800' },
});
