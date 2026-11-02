import { StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlass, LiquidGlassCard, type GlassMaterialName } from 'react-native-liquid-glass';
import { BusyBackground } from '../components/BusyBackground';
import { CONTENT_TOP } from '../layout';

const MATERIALS: GlassMaterialName[] = ['thin', 'regular', 'thick', 'clear'];

/** Every glass type side by side over the same background. */
export function MaterialsScreen() {
  return (
    <View style={styles.root}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <BusyBackground />
      </GlassBackdrop>
      <View style={styles.grid} pointerEvents="box-none">
        {MATERIALS.map((m) => (
          <LiquidGlassCard key={m} material={m} quality="high" style={styles.card}>
            <Text style={styles.label}>{m}</Text>
          </LiquidGlassCard>
        ))}
        <LiquidGlass quality="high" style={[styles.card, styles.pad]}>
          <Text style={styles.label}>liquid</Text>
        </LiquidGlass>
        <LiquidGlass variant="clear" quality="high" style={[styles.card, styles.pad]}>
          <Text style={styles.label}>liquid clear</Text>
        </LiquidGlass>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  grid: {
    ...StyleSheet.absoluteFillObject, paddingTop: CONTENT_TOP + 24,
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly', alignContent: 'flex-start',
  },
  card: { width: '44%', height: 140, margin: 8, justifyContent: 'flex-end' },
  pad: { padding: 16 },
  label: { fontSize: 20, fontWeight: '800' },
});
