import { StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassView, MATERIALS, type GlassMaterialName } from 'react-native-liquid-glass-native';
import { Background } from '../Background';
import { text } from '../ui';

const NAMES: GlassMaterialName[] = ['thin', 'regular', 'thick', 'clear', 'liquid', 'liquidClear'];

export default function MaterialsScene() {
  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background topInset={40} />
      </GlassBackdrop>

      <View style={styles.grid} pointerEvents="box-none">
        {NAMES.map((name) => {
          const m = MATERIALS[name];
          return (
            <LiquidGlassView key={name} material={name} style={styles.tile}>
              <Text style={styles.name}>{name}</Text>
              <Text style={text.caption}>
                blur {m.blur} · tint {Math.round(m.tintOpacity.light * 100)}%
              </Text>
            </LiquidGlassView>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0c1150' },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 12,
  },
  tile: { width: '46%', height: 128, padding: 16, justifyContent: 'flex-end' },
  name: { color: '#fff', fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
});
