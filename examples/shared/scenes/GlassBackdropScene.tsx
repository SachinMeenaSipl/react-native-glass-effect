import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassButton, LiquidGlassView } from 'react-native-liquid-glass-native';
import { ART, map } from '../assets';
import { AppIcon, text } from '../ui';

const PLACES = [
  { name: 'Harbor Coffee', info: 'Café · 4 min walk', art: ART[0] },
  { name: 'Riverside Park', info: 'Park · 9 min walk', art: ART[4] },
  { name: 'Old Town Records', info: 'Music store · 12 min', art: ART[7] },
  { name: 'Market Hall', info: 'Food market · 15 min', art: ART[3] },
  { name: 'Lumen Gallery', info: 'Gallery · 18 min', art: ART[5] },
];

/**
 * Two backdrops on one screen. Each glass names the backdrop it samples with
 * `backdropId`, so the map controls never sample the list, and the reverse.
 */
export default function GlassBackdropScene() {
  return (
    <View style={styles.screen}>
      <GlassBackdrop backdropId="map" style={styles.top}>
        <Image source={map} style={styles.fill} resizeMode="cover" />
      </GlassBackdrop>

      <GlassBackdrop backdropId="list" style={styles.bottom}>
        <ScrollView contentContainerStyle={styles.list}>
          {PLACES.map((place) => (
            <View key={place.name} style={styles.place}>
              <AppIcon image={place.art.image} size={52} />
              <View>
                <Text style={text.title}>{place.name}</Text>
                <Text style={text.caption}>{place.info}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </GlassBackdrop>

      {/* Over the map: samples the "map" backdrop. */}
      <LiquidGlassView backdropId="map" material="regular" cornerRadius={999} style={styles.search}>
        <Text style={styles.searchText}>Search Maps</Text>
      </LiquidGlassView>
      <LiquidGlassView backdropId="map" material="thin" cornerRadius={22} style={styles.locate}>
        <View style={styles.dot} />
      </LiquidGlassView>

      {/* Over the list: samples the "list" backdrop. */}
      <LiquidGlassButton backdropId="list" size="large" title="Directions" textStyle={styles.buttonText} style={styles.directions} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#1b2433' },
  fill: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  top: { position: 'absolute', top: 0, left: 0, right: 0, height: '52%' },
  bottom: { position: 'absolute', top: '52%', left: 0, right: 0, bottom: 0, backgroundColor: '#0f1420' },
  list: { padding: 20, paddingBottom: 120, gap: 18 },
  place: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  search: { position: 'absolute', top: 48, left: 16, right: 16, height: 52, justifyContent: 'center', paddingHorizontal: 22 },
  searchText: { color: 'rgba(255,255,255,0.85)', fontSize: 17 },
  locate: { position: 'absolute', top: '40%', right: 16, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#3d8bff', borderWidth: 3, borderColor: '#fff' },
  directions: { position: 'absolute', bottom: 36, alignSelf: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
});
