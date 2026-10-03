# 2 · Quick start

```tsx
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassButton, LiquidGlassView } from '@sachin-meena/react-native-liquid-glass';

export default function Screen() {
  return (
    <View style={{ flex: 1 }}>
      {/* 1. BACKGROUND: everything the glass should blur */}
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <ScrollView>
          <ImageBackground source={{ uri: 'https://picsum.photos/800/1600' }} style={{ height: 1600 }} />
        </ScrollView>
      </GlassBackdrop>

      {/* 2. GLASS: on top, outside the backdrop */}
      <LiquidGlassView style={styles.header}>
        <Text style={styles.title}>Photos</Text>
      </LiquidGlassView>

      <LiquidGlassButton title="Continue" style={styles.cta} onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { position: 'absolute', top: 60, left: 16, right: 16, padding: 16 },
  title: { fontSize: 20, fontWeight: '700' },
  cta: { position: 'absolute', bottom: 40, alignSelf: 'center' },
});
```

That's it. Scroll the image: the header and button blur it live.

Next: read [Core concepts](03-core-concepts.md). It takes 3 minutes and saves hours.
