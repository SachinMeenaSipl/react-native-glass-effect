import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassCard } from 'react-native-liquid-glass-native';
import { Wallpaper } from '../Background';
import { text } from '../ui';

const AGENDA = [
  { time: '08:30', title: 'Morning run', place: 'Riverside Park', color: '#38ef7d' },
  { time: '10:00', title: 'Team standup', place: 'Studio B', color: '#00c6ff' },
  { time: '12:30', title: 'Lunch with Maya', place: 'Harbor Coffee', color: '#ffd200' },
  { time: '14:00', title: 'Mix review', place: 'Control room', color: '#ff6a00' },
  { time: '16:30', title: 'Mastering session', place: 'Room 4', color: '#f953c6' },
  { time: '19:00', title: 'Gig: Low Orbit', place: 'Old Town Records', color: '#8e2de2' },
];

export default function RecipeCardsOverImage() {
  return (
    <View style={styles.screen}>
      {/* Only the background goes in the backdrop. In a real app: an <Image>. */}
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Wallpaper />
      </GlassBackdrop>

      {/* The scrolling list of glass cards sits on top. */}
      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.heading}>Today</Text>
        {AGENDA.map((item) => (
          <LiquidGlassCard key={item.title} style={styles.card}>
            <Text style={styles.time}>{item.time}</Text>
            <View style={[styles.accent, { backgroundColor: item.color }]} />
            <View style={styles.flex}>
              <Text style={text.title}>{item.title}</Text>
              <Text style={text.caption}>{item.place}</Text>
            </View>
          </LiquidGlassCard>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0c1150' },
  list: { padding: 16, paddingTop: 56, gap: 12 },
  heading: { color: '#fff', fontSize: 40, fontWeight: '800', letterSpacing: -1, marginBottom: 8 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  time: { color: '#fff', fontSize: 15, fontWeight: '700', width: 48, fontVariant: ['tabular-nums'] },
  accent: { width: 4, height: 40, borderRadius: 2 },
  flex: { flex: 1 },
});
