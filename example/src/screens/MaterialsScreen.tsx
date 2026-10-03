import { StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassCard, type GlassMaterialName } from 'react-native-liquid-glass';
import { BusyBackground } from '../components/BusyBackground';

const MATERIALS: GlassMaterialName[] = ['thin', 'regular', 'thick', 'clear'];

/** All four built-in materials side by side over the same background. */
export function MaterialsScreen() {
  return (
    <View style={styles.root}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <BusyBackground />
      </GlassBackdrop>
      <View style={styles.grid} pointerEvents="box-none">
        {MATERIALS.map((m) => (
          <LiquidGlassCard key={m} material={m} style={styles.card}>
            <Text style={styles.label}>{m}</Text>
          </LiquidGlassCard>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  grid: {
    ...StyleSheet.absoluteFillObject, paddingTop: 80,
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly', alignContent: 'center',
  },
  card: { width: '44%', height: 140, margin: 8, justifyContent: 'flex-end' },
  label: { fontSize: 20, fontWeight: '800' },
});
