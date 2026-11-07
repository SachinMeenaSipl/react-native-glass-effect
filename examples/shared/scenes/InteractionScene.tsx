import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassView } from 'react-native-liquid-glass-native';
import { ART } from '../assets';
import { Background } from '../Background';
import { AppIcon, Eyebrow, PauseIcon, text } from '../ui';

/** A control centre: tiles that react to touch, tilt, and animate between looks. */
export default function InteractionScene() {
  const [focus, setFocus] = useState(false);

  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background topInset={40} />
      </GlassBackdrop>

      <View style={styles.grid} pointerEvents="box-none">
        {/* Android: a light follows the finger and the tile squishes and springs back.
            iOS 26+: Apple's interactive glass. */}
        <LiquidGlassView interactive style={styles.tile}>
          <Eyebrow>interactive</Eyebrow>
          <Text style={text.title}>Wi-Fi</Text>
          <Text style={text.caption}>Studio 5G</Text>
        </LiquidGlassView>
        <LiquidGlassView interactive style={styles.tile}>
          <Eyebrow>interactive</Eyebrow>
          <Text style={text.title}>Bluetooth</Text>
          <Text style={text.caption}>AirWaves Pro</Text>
        </LiquidGlassView>

        {/* Android: the rim light follows device tilt (uses the gyroscope). */}
        <LiquidGlassView material="clear" interactive motionLighting style={styles.wide}>
          <AppIcon image={ART[5].image} size={54} />
          <View style={styles.flex}>
            <Eyebrow>motionLighting · tilt the phone</Eyebrow>
            <Text style={text.title}>Prism</Text>
            <Text style={text.caption}>Kite Theory</Text>
          </View>
          <PauseIcon size={22} />
        </LiquidGlassView>

        {/* Prop changes animate natively over transitionDuration (ms). */}
        <Pressable style={styles.widePress} onPress={() => setFocus((v) => !v)}>
          <LiquidGlassView
            material={focus ? 'thick' : 'thin'}
            tint={focus ? '#7c5cff' : '#ffffff'}
            tintOpacity={focus ? 0.45 : 0.08}
            transitionDuration={300}
            style={styles.focus}
          >
            <Eyebrow>transitionDuration 300 · tap me</Eyebrow>
            <Text style={text.title}>Focus {focus ? 'on' : 'off'}</Text>
          </LiquidGlassView>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0c1150' },
  grid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', padding: 14, gap: 14 },
  tile: { width: '47%', height: 132, padding: 16, justifyContent: 'flex-end' },
  wide: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  widePress: { width: '100%' },
  focus: { padding: 18 },
  flex: { flex: 1 },
});
