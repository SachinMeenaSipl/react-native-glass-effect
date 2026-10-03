import { ScrollView, StyleSheet, Text, View } from 'react-native';

const COLORS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#9D4EDD', '#FF9F1C', '#2EC4B6'];

/**
 * A deliberately "busy" scrolling background: strong colours, stripes and text.
 * Glass looks best (and bugs are easiest to spot) over content like this.
 */
export function BusyBackground({ rows = 30 }: { rows?: number }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      {Array.from({ length: rows }, (_, i) => (
        <View key={i} style={[styles.row, { backgroundColor: COLORS[i % COLORS.length] }]}>
          <View style={[styles.blob, { backgroundColor: COLORS[(i + 3) % COLORS.length] }]} />
          <Text style={styles.text}>Row {i + 1} — scroll me under the glass</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 120, paddingBottom: 160 },
  row: { height: 110, justifyContent: 'center', paddingHorizontal: 24, overflow: 'hidden' },
  blob: { position: 'absolute', right: -30, width: 140, height: 140, borderRadius: 70 },
  text: { fontSize: 20, fontWeight: '800', color: '#fff' },
});
