import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassView, type GlassQuality } from 'react-native-liquid-glass';
import { BusyBackground } from '../components/BusyBackground';

type Knob = 'blur' | 'refraction' | 'distortion' | 'illumination' | 'intensity';
const STEP: Record<Knob, number> = { blur: 4, refraction: 0.1, distortion: 0.05, illumination: 0.1, intensity: 0.1 };
const QUALITIES: GlassQuality[] = ['auto', 'high', 'medium', 'low', 'static'];

/**
 * Tweak every knob live. Changes animate natively (transitionDuration).
 * Touch the big glass: the light follows your finger and it squishes.
 */
export function PlaygroundScreen() {
  const [v, setV] = useState<Record<Knob, number>>({
    blur: 20, refraction: 0.35, distortion: 0.1, illumination: 0.5, intensity: 1,
  });
  const [quality, setQuality] = useState<GlassQuality>('auto');
  const [motion, setMotion] = useState(false);

  const bump = (k: Knob, dir: 1 | -1) =>
    setV((s) => ({ ...s, [k]: Math.max(0, +(s[k] + dir * STEP[k]).toFixed(2)) }));

  return (
    <View style={styles.root}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <BusyBackground />
      </GlassBackdrop>

      <LiquidGlassView
        style={styles.lens}
        cornerRadius={48}
        interactive
        motionLighting={motion}
        quality={quality}
        {...v}
      >
        <Text style={styles.lensText}>Touch me</Text>
      </LiquidGlassView>

      <LiquidGlassView material="thick" style={styles.panel} cornerRadius={24}>
        {(Object.keys(v) as Knob[]).map((k) => (
          <View key={k} style={styles.row}>
            <Text style={styles.key}>{k}</Text>
            <Btn label="−" onPress={() => bump(k, -1)} />
            <Text style={styles.value}>{v[k]}</Text>
            <Btn label="+" onPress={() => bump(k, 1)} />
          </View>
        ))}
        <View style={styles.row}>
          {QUALITIES.map((q) => (
            <Btn key={q} label={q} active={q === quality} onPress={() => setQuality(q)} />
          ))}
        </View>
        <Btn label={`motion lighting: ${motion ? 'on' : 'off'}`} onPress={() => setMotion((m) => !m)} />
      </LiquidGlassView>
    </View>
  );
}

function Btn({ label, onPress, active }: { label: string; onPress: () => void; active?: boolean }) {
  return (
    <Pressable onPress={onPress} style={[styles.btn, active && styles.btnActive]}>
      <Text style={styles.btnText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  lens: {
    position: 'absolute', top: 90, alignSelf: 'center',
    width: 260, height: 160, alignItems: 'center', justifyContent: 'center',
  },
  lensText: { fontSize: 22, fontWeight: '800' },
  panel: { position: 'absolute', left: 12, right: 12, bottom: 24, padding: 14, gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  key: { width: 96, fontWeight: '600' },
  value: { width: 48, textAlign: 'center', fontVariant: ['tabular-nums'] },
  btn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.08)' },
  btnActive: { backgroundColor: 'rgba(0,0,0,0.25)' },
  btnText: { fontWeight: '600' },
});
