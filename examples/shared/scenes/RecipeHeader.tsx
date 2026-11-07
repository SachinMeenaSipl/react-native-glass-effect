import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassButton, LiquidGlassView } from 'react-native-liquid-glass-native';
import { ART } from '../assets';
import { text } from '../ui';

const POSTS = [...ART, ...ART].map((art, i) => ({ id: String(i), ...art, likes: 120 + i * 37 }));

const HEADER_HEIGHT = 60;
const TOP = 44; // In a real app: useSafeAreaInsets().top

export default function RecipeHeader() {
  return (
    <View style={styles.screen}>
      {/* The feed scrolls inside the backdrop, under the header. */}
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <FlatList
          data={POSTS}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ paddingTop: TOP + HEADER_HEIGHT + 16, paddingHorizontal: 14, gap: 18 }}
          renderItem={({ item }) => (
            <View>
              <Image source={item.image} style={styles.photo} />
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={text.caption}>
                {item.artist} · {item.likes} likes
              </Text>
            </View>
          )}
        />
      </GlassBackdrop>

      {/* The header floats on top, outside the backdrop. */}
      <LiquidGlassView material="regular" cornerRadius={HEADER_HEIGHT / 2} style={styles.header}>
        <Text style={styles.title}>For you</Text>
        <LiquidGlassButton size="small" material="thin" title="New post" textStyle={styles.buttonText} onPress={() => {}} />
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
    paddingLeft: 22,
    paddingRight: 12,
  },
  title: { color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  buttonText: { color: '#fff', fontWeight: '700' },
  photo: { width: '100%', height: 300, borderRadius: 24 },
  postTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 10 },
});
