import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { FrostedGlass } from '../FrostedGlass';
import {
  ADJUSTMENT_RANGES,
  DEFAULT_GLASS_ADJUSTMENTS,
  stepAdjustment,
  type GlassAdjustmentKey,
  type GlassAdjustments,
} from './adjustments';

export interface GlassAdjusterProps {
  /** Current values. Spread the same object onto your glass. */
  value: GlassAdjustments;
  /** Called with the full new object on every change. */
  onChange: (value: GlassAdjustments) => void;
  /** Which rows to show, in order. Default: all of them. */
  controls?: readonly GlassAdjustmentKey[];
  /** Values for the Reset button. Default: the `regular` material. */
  defaults?: GlassAdjustments;
  style?: StyleProp<ViewStyle>;
}

const ALL = Object.keys(ADJUSTMENT_RANGES) as GlassAdjustmentKey[];

/**
 * A ready-made panel for tuning glass live.
 *
 * ```tsx
 * const [look, setLook] = useState(DEFAULT_GLASS_ADJUSTMENTS);
 * <FrostedGlass {...look} style={styles.card} />
 * <GlassAdjuster value={look} onChange={setLook} />
 * ```
 */
export function GlassAdjuster({
  value,
  onChange,
  controls = ALL,
  defaults = DEFAULT_GLASS_ADJUSTMENTS,
  style,
}: GlassAdjusterProps) {
  return (
    <FrostedGlass material="thick" cornerRadius={20} style={[styles.panel, style]}>
      {controls.map((key) => {
        const { label } = ADJUSTMENT_RANGES[key];
        return (
          <View key={key} style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <StepButton label={`Decrease ${label}`} glyph="−" onPress={() => onChange(stepAdjustment(value, key, -1))} />
            <Text style={styles.value}>{value[key]}</Text>
            <StepButton label={`Increase ${label}`} glyph="+" onPress={() => onChange(stepAdjustment(value, key, 1))} />
          </View>
        );
      })}
      <Pressable accessibilityRole="button" onPress={() => onChange({ ...defaults })} style={styles.reset}>
        <Text style={styles.resetText}>Reset</Text>
      </Pressable>
    </FrostedGlass>
  );
}

function StepButton({ label, glyph, onPress }: { label: string; glyph: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} hitSlop={4} onPress={onPress} style={styles.step}>
      <Text style={styles.glyph}>{glyph}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  panel: { padding: 12, gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', height: 30 },
  label: { flex: 1, fontSize: 14, fontWeight: '600', color: '#111' },
  value: { width: 52, textAlign: 'center', fontSize: 14, color: '#111' },
  step: {
    width: 34, height: 28, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  glyph: { fontSize: 18, fontWeight: '700', color: '#111' },
  reset: { alignSelf: 'flex-end', paddingVertical: 4, paddingHorizontal: 8 },
  resetText: { fontSize: 14, fontWeight: '700', color: '#111' },
});
