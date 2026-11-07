import { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassButton, LiquidGlassView } from 'react-native-liquid-glass-native';
import { ART } from '../assets';
import { Background } from '../Background';
import { AppIcon, CoverImage, text } from '../ui';

const SHARE_TO = [
  { name: 'Messages', art: ART[4] },
  { name: 'Mail', art: ART[1] },
  { name: 'Notes', art: ART[2] },
  { name: 'Studio', art: ART[6] },
];

export default function RecipeModal() {
  const [open, setOpen] = useState(false);
  const item = ART[0];

  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background />
      </GlassBackdrop>

      <LiquidGlassButton size="large" title="Share" textStyle={styles.buttonText} style={styles.open} onPress={() => setOpen(true)} />

      {/* A Modal is a separate window: give it its own backdrop. */}
      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.screen}>
          <GlassBackdrop style={StyleSheet.absoluteFill}>
            <CoverImage image={item.image} />
          </GlassBackdrop>

          <LiquidGlassView material="thick" cornerRadius={34} style={styles.sheet}>
            <View style={styles.header}>
              <AppIcon image={item.image} size={48} />
              <View>
                <Text style={text.title}>{item.title}</Text>
                <Text style={text.caption}>{item.artist} · Album</Text>
              </View>
            </View>

            <View style={styles.targets}>
              {SHARE_TO.map((target) => (
                <View key={target.name} style={styles.target}>
                  <AppIcon image={target.art.image} size={56} />
                  <Text style={styles.targetName}>{target.name}</Text>
                </View>
              ))}
            </View>

            <LiquidGlassButton size="large" title="Done" material="thin" textStyle={styles.buttonText} onPress={() => setOpen(false)} />
          </LiquidGlassView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0c1150' },
  open: { position: 'absolute', bottom: 40, alignSelf: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  sheet: { position: 'absolute', left: 10, right: 10, bottom: 20, padding: 22, gap: 22 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  targets: { flexDirection: 'row', justifyContent: 'space-between' },
  target: { alignItems: 'center', gap: 6 },
  targetName: { color: '#fff', fontSize: 12, fontWeight: '600' },
});
