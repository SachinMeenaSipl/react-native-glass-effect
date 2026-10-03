import { StyleSheet, Text, View } from 'react-native';
import {
  GlassBackdrop,
  LiquidGlassButton,
  LiquidGlassView,
} from 'react-native-liquid-glass';
import { BusyBackground } from '../components/BusyBackground';

/**
 * The core proof: dynamic background capture.
 * Scroll the list — header and bottom bar must blur the rows live, with no lag.
 */
export function ScrollingScreen() {
  return (
    <View style={styles.root}>
      {/* 1. What the glass should see */}
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <BusyBackground />
      </GlassBackdrop>

      {/* 2. Glass on top, OUTSIDE the backdrop */}
      <LiquidGlassView material="regular" style={styles.header} cornerRadius={28}>
        <Text style={styles.title}>Live blur while scrolling</Text>
      </LiquidGlassView>

      <View style={styles.bottom}>
        <LiquidGlassButton title="Primary" onPress={() => undefined} />
        <LiquidGlassButton title="Clear" material="clear" onPress={() => undefined} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    position: 'absolute', top: 56, left: 16, right: 16,
    height: 64, justifyContent: 'center', paddingHorizontal: 20,
  },
  title: { fontSize: 18, fontWeight: '700' },
  bottom: {
    position: 'absolute', bottom: 40, left: 16, right: 16,
    flexDirection: 'row', justifyContent: 'space-around',
  },
});
