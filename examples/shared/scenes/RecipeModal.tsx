import { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassButton, LiquidGlassView } from 'react-native-liquid-glass-native';
import { Background } from '../Background';

export default function RecipeModal() {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background />
      </GlassBackdrop>

      <LiquidGlassButton title="Open sheet" style={styles.open} onPress={() => setOpen(true)} />

      {/* A Modal is a separate window: give it its own backdrop. */}
      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.screen}>
          <GlassBackdrop style={StyleSheet.absoluteFill}>
            <Background label="Inside the modal" />
          </GlassBackdrop>

          <LiquidGlassView material="thick" cornerRadius={28} style={styles.sheet}>
            <Text style={styles.title}>Share</Text>
            <Text style={styles.body}>A sheet drawn with glass, inside a Modal.</Text>
            <LiquidGlassButton title="Done" material="thin" onPress={() => setOpen(false)} />
          </LiquidGlassView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  open: { position: 'absolute', bottom: 40, alignSelf: 'center' },
  sheet: { position: 'absolute', left: 12, right: 12, bottom: 24, padding: 20, gap: 12 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  body: { color: '#fff', fontSize: 15 },
});
