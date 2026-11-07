import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassCard } from 'react-native-liquid-glass-native';

const ITEMS = ['Morning run', 'Team sync', 'Lunch with Sam', 'Code review', 'Gym', 'Read'];

/** A still "wallpaper" in the backdrop; the cards scroll over it. */
function Wallpaper() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={[styles.blob, { top: 40, left: -60, backgroundColor: '#ff6b6b' }]} />
      <View style={[styles.blob, { top: 260, right: -80, backgroundColor: '#48dbfb' }]} />
      <View style={[styles.blob, { top: 520, left: 20, backgroundColor: '#feca57' }]} />
    </View>
  );
}

export default function RecipeCardsOverImage() {
  return (
    <View style={styles.screen}>
      {/* Only the background goes in the backdrop. In a real app: an <Image>. */}
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Wallpaper />
      </GlassBackdrop>

      {/* The scrolling list of glass cards sits on top. */}
      <ScrollView contentContainerStyle={styles.list}>
        {ITEMS.map((title, i) => (
          <LiquidGlassCard key={title} material="regular">
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.body}>{9 + i}:00 · 45 min</Text>
          </LiquidGlassCard>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#1b1464' },
  blob: { position: 'absolute', width: 260, height: 260, borderRadius: 130 },
  list: { padding: 16, paddingTop: 48, gap: 12 },
  title: { color: '#fff', fontSize: 17, fontWeight: '700' },
  body: { color: '#fff', fontSize: 14, marginTop: 4 },
});
