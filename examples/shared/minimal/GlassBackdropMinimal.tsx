import { Image, StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassView } from 'react-native-liquid-glass-native';

export default function App() {
  return (
    <View style={styles.screen}>
      {/* Wrap only what the glass should see through: here, a photo. */}
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Image
          source={{ uri: 'https://picsum.photos/id/1015/800/1600' }}
          style={styles.photo}
          resizeMode="cover"
        />
      </GlassBackdrop>

      {/* Glass is a sibling of the backdrop, rendered after it. Never inside it. */}
      <LiquidGlassView style={styles.caption}>
        <Text style={styles.text}>River valley, Norway</Text>
      </LiquidGlassView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' },
  // Give full-screen images an explicit size: on Android, absoluteFill alone
  // can draw the image at its natural size.
  photo: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  caption: { position: 'absolute', left: 16, right: 16, bottom: 40, padding: 16 },
  text: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
