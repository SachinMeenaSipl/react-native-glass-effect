import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  DEFAULT_GLASS_ADJUSTMENTS,
  GlassAdjuster,
  GlassBackdrop,
  LiquidGlassView,
  MATERIALS,
  useGlassTheme,
  type GlassAdjustments,
  type GlassMaterialName,
} from 'react-native-liquid-glass-native';
import { Background } from '../Background';
import { text } from '../ui';

const NAMES: GlassMaterialName[] = ['thin', 'regular', 'thick', 'clear', 'liquid', 'liquidClear'];

/** Pick a material to load its values, then tune any value and watch the glass change. */
export default function PlaygroundScene() {
  const { resolvedScheme } = useGlassTheme();
  const [material, setMaterial] = useState<GlassMaterialName>('regular');
  // `base` is the picked material's values: what Reset returns to.
  const [base, setBase] = useState<GlassAdjustments>(DEFAULT_GLASS_ADJUSTMENTS);
  const [look, setLook] = useState<GlassAdjustments>(DEFAULT_GLASS_ADJUSTMENTS);

  const pick = (name: GlassMaterialName) => {
    const m = MATERIALS[name];
    const values: GlassAdjustments = {
      ...DEFAULT_GLASS_ADJUSTMENTS,
      blur: m.blur,
      tintOpacity: m.tintOpacity[resolvedScheme],
      refraction: m.refraction,
      distortion: m.distortion,
      illumination: m.illumination,
      chromaticAberration: m.chromaticAberration,
      edgeWidth: m.edgeWidth,
      borderOpacity: m.borderOpacity,
    };
    setMaterial(name);
    setBase(values);
    setLook(values);
  };

  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background topInset={40} />
      </GlassBackdrop>

      <ScrollView contentContainerStyle={styles.stack}>
        <LiquidGlassView material={material} {...look} quality="high" style={styles.preview}>
          <Text style={text.title}>{material}</Text>
          <Text style={text.caption}>
            blur {look.blur} · tint {look.tintOpacity} · refraction {look.refraction} · corners {look.cornerRadius}
          </Text>
        </LiquidGlassView>

        <View style={styles.chips}>
          {NAMES.map((name) => (
            <Pressable
              key={name}
              onPress={() => pick(name)}
              accessibilityRole="button"
              accessibilityState={{ selected: name === material }}
              style={[styles.chip, name === material && styles.chipSelected]}
            >
              <Text style={[styles.chipText, name === material && styles.chipTextSelected]}>{name}</Text>
            </Pressable>
          ))}
        </View>

        <GlassAdjuster value={look} onChange={setLook} defaults={base} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0c1150' },
  stack: { padding: 16, paddingTop: 48, gap: 14 },
  preview: { height: 140, padding: 20, justifyContent: 'flex-end' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.35)' },
  chipSelected: { backgroundColor: '#ffffff' },
  chipText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  chipTextSelected: { color: '#111' },
});
