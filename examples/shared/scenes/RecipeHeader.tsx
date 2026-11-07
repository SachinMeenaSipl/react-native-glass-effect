import { FlatList, StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassButton, LiquidGlassView } from 'react-native-liquid-glass-native';

const POSTS = Array.from({ length: 30 }, (_, i) => ({
  id: String(i),
  color: ['#ff6b6b', '#feca57', '#48dbfb', '#5f27cd', '#1dd1a1'][i % 5],
}));

const HEADER_HEIGHT = 56;
const TOP = 44; // In a real app: useSafeAreaInsets().top

export default function RecipeHeader() {
  return (
    <View style={styles.screen}>
      {/* The feed scrolls inside the backdrop, under the header. */}
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <FlatList
          data={POSTS}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ paddingTop: TOP + HEADER_HEIGHT + 16, paddingHorizontal: 16, gap: 12 }}
          renderItem={({ item }) => (
            <View style={[styles.post, { backgroundColor: item.color }]}>
              <Text style={styles.postText}>Post {Number(item.id) + 1}</Text>
            </View>
          )}
        />
      </GlassBackdrop>

      {/* The header floats on top, outside the backdrop. */}
      <LiquidGlassView material="regular" cornerRadius={HEADER_HEIGHT / 2} style={styles.header}>
        <Text style={styles.title}>Feed</Text>
        <LiquidGlassButton size="small" material="thin" title="New" textStyle={styles.buttonText} onPress={() => {}} />
      </LiquidGlassView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  header: {
    position: 'absolute',
    top: TOP,
    left: 12,
    right: 12,
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 10,
  },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  buttonText: { color: '#fff' },
  post: { height: 160, borderRadius: 20, padding: 16, justifyContent: 'flex-end' },
  postText: { color: '#fff', fontSize: 20, fontWeight: '800' },
});
