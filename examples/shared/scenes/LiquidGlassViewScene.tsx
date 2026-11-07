import { StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassView } from 'react-native-liquid-glass-native';
import { ART } from '../assets';
import { Background } from '../Background';
import { AppIcon, text } from '../ui';

/** A lock screen: three LiquidGlassView looks, from a default notification to a pill. */
export default function LiquidGlassViewScene() {
  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background topInset={300} />
      </GlassBackdrop>

      <View style={styles.clock} pointerEvents="none">
        <Text style={styles.date}>Friday, 7 November</Text>
        <Text style={styles.time}>9:41</Text>
      </View>

      <View style={styles.stack} pointerEvents="box-none">
        {/* Defaults: the theme's material ("regular") and corner radius (24). */}
        <LiquidGlassView style={styles.notification}>
          <AppIcon image={ART[1].image} />
          <View style={styles.flex}>
            <View style={styles.row}>
              <Text style={styles.app}>MUSIC</Text>
              <Text style={text.caption}>now</Text>
            </View>
            <Text style={text.title}>Ripple is out</Text>
            <Text style={text.body}>The new album from Blue Static is ready to play.</Text>
          </View>
        </LiquidGlassView>

        {/* Tinted and rounder. Use tint + tintOpacity, never backgroundColor. */}
        <LiquidGlassView material="thick" tint="#6D5DFC" tintOpacity={0.3} cornerRadius={32} style={styles.notification}>
          <AppIcon image={ART[5].image} />
          <View style={styles.flex}>
            <View style={styles.row}>
              <Text style={styles.app}>CALENDAR</Text>
              <Text style={text.caption}>in 15 min</Text>
            </View>
            <Text style={text.title}>Design review</Text>
            <Text style={text.body}>Studio B · with Maya and Leo</Text>
          </View>
        </LiquidGlassView>

        {/* A pill: any corner radius of half the height or more. */}
        <LiquidGlassView material="thin" cornerRadius={999} style={styles.pill}>
          <Text style={styles.pillText}>2 more notifications</Text>
        </LiquidGlassView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0c1150' },
  clock: { position: 'absolute', top: 70, left: 0, right: 0, alignItems: 'center' },
  date: { color: 'rgba(255,255,255,0.9)', fontSize: 18, fontWeight: '600' },
  time: { color: '#fff', fontSize: 92, fontWeight: '200', letterSpacing: -3 },
  stack: { flex: 1, justifyContent: 'flex-end', padding: 14, paddingBottom: 48, gap: 10 },
  notification: { flexDirection: 'row', gap: 12, padding: 14 },
  flex: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  app: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  pill: { alignSelf: 'center', height: 40, paddingHorizontal: 20, justifyContent: 'center' },
  pillText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
