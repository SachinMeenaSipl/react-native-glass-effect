import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  DEFAULT_GLASS_ADJUSTMENTS,
  FrostedGlass,
  GlassAdjuster,
  GlassBackdrop,
} from 'react-native-liquid-glass-native';
import { Background } from '../Background';

export default function GlassAdjusterScene() {
  // The adjuster edits one object; spread it onto any glass.
  const [look, setLook] = useState(DEFAULT_GLASS_ADJUSTMENTS);

  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background />
      </GlassBackdrop>

      <View style={styles.stack} pointerEvents="box-none">
        <FrostedGlass {...look} style={styles.preview}>
          <Text style={styles.title}>Tune me</Text>
          <Text style={styles.body}>
            blur {look.blur} · tint {look.tintOpacity} · corners {look.cornerRadius}
          </Text>
        </FrostedGlass>

        {/* The adjuster is itself a thick FrostedGlass panel. */}
        <GlassAdjuster
          value={look}
          onChange={setLook}
          controls={['blur', 'tintOpacity', 'refraction', 'illumination', 'cornerRadius']}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  stack: { flex: 1, justifyContent: 'center', padding: 16, gap: 16 },
  preview: { padding: 20 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  body: { color: '#fff', fontSize: 14, marginTop: 4 },
});
