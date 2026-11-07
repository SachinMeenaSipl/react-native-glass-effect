import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  DEFAULT_GLASS_ADJUSTMENTS,
  FrostedGlass,
  GlassAdjuster,
  GlassBackdrop,
} from 'react-native-liquid-glass-native';
import { ART } from '../assets';
import { Background } from '../Background';
import { AppIcon, PauseIcon, text } from '../ui';

export default function GlassAdjusterScene() {
  // The adjuster edits one object; spread it onto any glass.
  const [look, setLook] = useState(DEFAULT_GLASS_ADJUSTMENTS);

  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background topInset={40} />
      </GlassBackdrop>

      <View style={styles.stack} pointerEvents="box-none">
        <FrostedGlass {...look} style={styles.preview}>
          <AppIcon image={ART[2].image} size={56} />
          <View style={styles.flex}>
            <Text style={text.title}>Solar</Text>
            <Text style={text.caption}>
              blur {look.blur} · tint {look.tintOpacity} · corners {look.cornerRadius}
            </Text>
          </View>
          <PauseIcon size={24} />
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
  screen: { flex: 1, backgroundColor: '#0c1150' },
  stack: { flex: 1, justifyContent: 'center', padding: 16, gap: 16 },
  preview: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  flex: { flex: 1 },
});
