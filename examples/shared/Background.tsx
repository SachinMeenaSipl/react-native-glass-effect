import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { ART, aurora } from './assets';

/**
 * What the example glass blurs: a vivid wallpaper with a scrolling feed of artwork on top.
 * Every example scene puts this inside a <GlassBackdrop>. In your app, use your own content.
 */
export function Background({ topInset = 120 }: { topInset?: number }) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Wallpaper />
      <ScrollView contentContainerStyle={[styles.feed, { paddingTop: topInset }]}>
        {ART.map((item) => (
          <Image key={item.title} source={item.image} style={styles.art} />
        ))}
      </ScrollView>
    </View>
  );
}

/** Just the wallpaper, for scenes whose content shouldn't scroll. */
export function Wallpaper() {
  return <Image source={aurora} style={styles.fill} resizeMode="cover" />;
}

const styles = StyleSheet.create({
  // Explicit size: on Android an absoluteFill image without width/height draws at its natural size.
  fill: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  feed: { paddingHorizontal: 20, paddingBottom: 260, gap: 22 },
  art: { width: '100%', height: 240, borderRadius: 28 },
});
