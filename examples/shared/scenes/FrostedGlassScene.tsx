import { StyleSheet, Text, View } from 'react-native';
import { FrostedGlass, GlassBackdrop } from 'react-native-liquid-glass-native';
import { Background } from '../Background';
import { Eyebrow, text } from '../ui';

/** Weather widgets drawn by the library's own shader, so Android and iOS look alike. */
export default function FrostedGlassScene() {
  return (
    <View style={styles.screen}>
      {/* FrostedGlass always needs a backdrop, on iOS too. */}
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background topInset={40} />
      </GlassBackdrop>

      <View style={styles.stack} pointerEvents="box-none">
        <View style={styles.row}>
          <FrostedGlass material="thin" style={styles.small}>
            <Eyebrow>thin</Eyebrow>
            <Text style={text.big}>18°</Text>
            <Text style={text.caption}>San Francisco</Text>
          </FrostedGlass>
          <FrostedGlass material="regular" style={styles.small}>
            <Eyebrow>regular</Eyebrow>
            <Text style={text.big}>24°</Text>
            <Text style={text.caption}>Lisbon</Text>
          </FrostedGlass>
        </View>

        <FrostedGlass material="thick" style={styles.wide}>
          <Eyebrow>thick</Eyebrow>
          <Text style={text.title}>Clear skies all evening</Text>
          <Text style={text.body}>Sunset 19:42 · Wind 8 km/h · UV 2</Text>
        </FrostedGlass>

        <FrostedGlass material="regular" refraction={0.8} chromaticAberration={0.3} quality="high" style={styles.wide}>
          <Eyebrow>refraction 0.8 · RGB split 0.3</Eyebrow>
          <Text style={text.title}>A stronger lens at the rim</Text>
          <Text style={text.body}>Android 13+ and the iOS shader bend the content behind the edge.</Text>
        </FrostedGlass>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0c1150' },
  stack: { flex: 1, justifyContent: 'center', padding: 16, gap: 14 },
  row: { flexDirection: 'row', gap: 14 },
  small: { flex: 1, padding: 18 },
  wide: { padding: 18 },
});
