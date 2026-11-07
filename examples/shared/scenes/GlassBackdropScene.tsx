import { StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassButton, LiquidGlassView } from 'react-native-liquid-glass-native';
import { Background } from '../Background';

/**
 * Two backdrops on one screen. Each glass names the backdrop it should sample
 * with `backdropId`, so the controls over the "map" never sample the list.
 */
export default function GlassBackdropScene() {
  return (
    <View style={styles.screen}>
      <GlassBackdrop backdropId="map" style={styles.top}>
        <View style={styles.map}>
          {Array.from({ length: 12 }, (_, i) => (
            <View key={i} style={[styles.tile, { backgroundColor: i % 3 ? '#1dd1a1' : '#54a0ff' }]} />
          ))}
        </View>
      </GlassBackdrop>

      <GlassBackdrop backdropId="list" style={styles.bottom}>
        <Background label="List row" />
      </GlassBackdrop>

      {/* Sits over the map, so it samples the "map" backdrop. */}
      <LiquidGlassView backdropId="map" material="thin" cornerRadius={20} style={styles.mapControls}>
        <Text style={styles.text}>Map controls</Text>
      </LiquidGlassView>

      {/* Sits over the list, so it samples the "list" backdrop. */}
      <LiquidGlassButton backdropId="list" title="Add to list" style={styles.listButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  top: { position: 'absolute', top: 0, left: 0, right: 0, height: '45%' },
  bottom: { position: 'absolute', top: '45%', left: 0, right: 0, bottom: 0 },
  map: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 8, gap: 8, backgroundColor: '#10ac84' },
  tile: { width: '30%', height: 80, borderRadius: 12 },
  mapControls: { position: 'absolute', top: 48, right: 16, paddingVertical: 12, paddingHorizontal: 16 },
  listButton: { position: 'absolute', bottom: 40, alignSelf: 'center' },
  text: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
