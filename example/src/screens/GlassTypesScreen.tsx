import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  DEFAULT_GLASS_ADJUSTMENTS,
  FrostedGlass,
  GlassAdjuster,
  GlassBackdrop,
  LiquidGlass,
  type GlassMaterialName,
} from 'react-native-liquid-glass';
import { BusyBackground } from '../components/BusyBackground';
import { CONTENT_TOP } from '../layout';

const FROSTED: GlassMaterialName[] = ['thin', 'regular', 'thick', 'clear'];

/**
 * Full-screen tour of every glass type over a scrolling background.
 * Tests: LiquidGlass (Apple look), FrostedGlass (same shader on both platforms), GlassAdjuster.
 */
export function GlassTypesScreen() {
  const [look, setLook] = useState({ ...DEFAULT_GLASS_ADJUSTMENTS });
  return (
    <View style={styles.root}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <BusyBackground />
      </GlassBackdrop>
      <ScrollView style={StyleSheet.absoluteFill} pointerEvents="box-none" contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Liquid Glass</Text>
        <View style={styles.row}>
          <LiquidGlass quality="high" cornerRadius={28} interactive style={styles.tile}>
            <Text style={styles.label}>regular</Text>
          </LiquidGlass>
          <LiquidGlass variant="clear" quality="high" cornerRadius={28} interactive style={styles.tile}>
            <Text style={styles.label}>clear</Text>
          </LiquidGlass>
        </View>
        <Text style={styles.heading}>Frosted Glass</Text>
        <View style={styles.row}>
          {FROSTED.map((material) => (
            <FrostedGlass key={material} material={material} quality="high" cornerRadius={20} style={styles.small}>
              <Text style={styles.label}>{material}</Text>
            </FrostedGlass>
          ))}
        </View>
        <Text style={styles.heading}>Adjust it yourself</Text>
        <FrostedGlass {...look} quality="high" interactive style={styles.preview}>
          <Text style={styles.label}>Your glass</Text>
        </FrostedGlass>
        <GlassAdjuster value={look} onChange={setLook} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: 16, paddingTop: CONTENT_TOP, paddingBottom: 48, gap: 10 },
  heading: { fontSize: 16, fontWeight: '800', color: '#fff', textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 4 },
  row: { flexDirection: 'row', gap: 10 },
  tile: { flex: 1, height: 96, padding: 12, justifyContent: 'flex-end' },
  small: { flex: 1, height: 72, padding: 8, justifyContent: 'flex-end' },
  preview: { height: 110, padding: 14, justifyContent: 'flex-end' },
  label: { fontSize: 14, fontWeight: '700', color: '#111' },
});
