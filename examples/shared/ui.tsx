import { Image, StyleSheet, Text, View, useWindowDimensions, type ImageSourcePropType } from 'react-native';

// Small drawn icons and text styles shared by the example scenes. Not part of the library.

export function PlayIcon({ size = 22, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <View
      style={{
        width: 0,
        height: 0,
        marginLeft: size * 0.15,
        borderTopWidth: size / 2,
        borderBottomWidth: size / 2,
        borderLeftWidth: size * 0.85,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: color,
      }}
    />
  );
}

export function PauseIcon({ size = 22, color = '#fff' }: { size?: number; color?: string }) {
  const bar = { width: size * 0.3, height: size, borderRadius: 2, backgroundColor: color };
  return (
    <View style={{ flexDirection: 'row', gap: size * 0.25 }}>
      <View style={bar} />
      <View style={bar} />
    </View>
  );
}

export function SkipIcon({ size = 18, color = '#fff', back = false }: { size?: number; color?: string; back?: boolean }) {
  return (
    <View style={{ flexDirection: back ? 'row-reverse' : 'row', alignItems: 'center' }}>
      <View
        style={{
          width: 0,
          height: 0,
          borderTopWidth: size / 2,
          borderBottomWidth: size / 2,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          ...(back ? { borderRightWidth: size * 0.8, borderRightColor: color } : { borderLeftWidth: size * 0.8, borderLeftColor: color }),
        }}
      />
      <View style={{ width: size * 0.18, height: size, borderRadius: 1, backgroundColor: color }} />
    </View>
  );
}

/**
 * A square artwork image that fills the screen. Sized explicitly because Android
 * doesn't upscale a small square image enough with resizeMode="cover" alone.
 */
export function CoverImage({ image }: { image: ImageSourcePropType }) {
  const { width, height } = useWindowDimensions();
  const side = Math.max(width, height);
  return (
    <Image
      source={image}
      resizeMode="cover"
      style={{ position: 'absolute', top: (height - side) / 2, left: (width - side) / 2, width: side, height: side }}
    />
  );
}

/** A rounded-square "app icon" made from an artwork image. */
export function AppIcon({ image, size = 40 }: { image: ImageSourcePropType; size?: number }) {
  return <Image source={image} style={{ width: size, height: size, borderRadius: size * 0.24 }} />;
}

/** A small uppercase label that names the prop an example is showing. */
export function Eyebrow({ children }: { children: string }) {
  return <Text style={text.eyebrow}>{children}</Text>;
}

export const text = StyleSheet.create({
  eyebrow: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: { color: '#fff', fontSize: 19, fontWeight: '700', letterSpacing: -0.3 },
  body: { color: 'rgba(255,255,255,0.9)', fontSize: 15, lineHeight: 20 },
  caption: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  big: { color: '#fff', fontSize: 44, fontWeight: '300', letterSpacing: -1 },
});
