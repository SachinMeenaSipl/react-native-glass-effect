import { StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlass } from 'react-native-liquid-glass-native';
import { ART } from '../assets';
import { CoverImage, PauseIcon, SkipIcon } from '../ui';

const INK = '#1c1c1e';

/**
 * A "now playing" screen: a regular Liquid Glass panel and a clear lens button over the cover.
 * The `liquid` material is light and frosted, so text on it is dark, like Apple's.
 */
export default function LiquidGlassScene() {
  const track = ART[2];

  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <CoverImage image={track.image} />
      </GlassBackdrop>

      {/* variant="clear": a see-through lens, for small controls over media. */}
      <LiquidGlass variant="clear" cornerRadius={999} style={styles.lens}>
        <Text style={styles.lensText}>LIVE</Text>
      </LiquidGlass>

      {/* variant="regular": everyday Liquid Glass. Apple's own glass on iOS 26+. */}
      <LiquidGlass style={styles.player}>
        <Text style={styles.title}>{track.title}</Text>
        <Text style={styles.artist}>{track.artist}</Text>

        <View style={styles.progress}>
          <View style={styles.progressFill} />
        </View>
        <View style={styles.times}>
          <Text style={styles.time}>1:24</Text>
          <Text style={styles.time}>-2:07</Text>
        </View>

        <View style={styles.controls}>
          <SkipIcon back size={22} color={INK} />
          <PauseIcon size={34} color={INK} />
          <SkipIcon size={22} color={INK} />
        </View>
      </LiquidGlass>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' },
  lens: { position: 'absolute', top: 52, right: 18, paddingHorizontal: 16, height: 36, justifyContent: 'center' },
  lensText: { color: '#fff', fontSize: 13, fontWeight: '800', letterSpacing: 1.5 },
  player: { position: 'absolute', left: 14, right: 14, bottom: 30, padding: 22, borderRadius: 36 },
  title: { color: INK, fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  artist: { color: 'rgba(28,28,30,0.7)', fontSize: 16, fontWeight: '600' },
  time: { color: 'rgba(28,28,30,0.6)', fontSize: 13, fontVariant: ['tabular-nums'] },
  progress: { height: 5, borderRadius: 3, backgroundColor: 'rgba(28,28,30,0.2)', marginTop: 20 },
  progressFill: { width: '40%', height: 5, borderRadius: 3, backgroundColor: INK },
  times: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  controls: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginTop: 16 },
});
