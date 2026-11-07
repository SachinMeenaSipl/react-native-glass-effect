import { StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassView, type GlassMaterialName } from 'react-native-liquid-glass-native';
import { Background } from '../Background';

const NAMES: GlassMaterialName[] = ['thin', 'regular', 'thick', 'clear', 'liquid', 'liquidClear'];

export default function MaterialsScene() {
  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background />
      </GlassBackdrop>

      <View style={styles.grid} pointerEvents="box-none">
        {NAMES.map((name) => (
          <LiquidGlassView key={name} material={name} style={styles.tile}>
            <Text style={styles.text}>{name}</Text>
          </LiquidGlassView>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 12,
  },
  tile: { width: '45%', height: 110, alignItems: 'center', justifyContent: 'center' },
  text: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
