# 9 · Recipes

## Floating header over a scrolling feed

```tsx
<View style={{ flex: 1 }}>
  <GlassBackdrop style={StyleSheet.absoluteFill}>
    <FlatList data={posts} renderItem={renderPost} contentContainerStyle={{ paddingTop: 110 }} />
  </GlassBackdrop>
  <LiquidGlassView style={{ position: 'absolute', top: insets.top + 8, left: 12, right: 12, height: 56 }}
                   cornerRadius={28} material="regular">
    <Text>Feed</Text>
  </LiquidGlassView>
</View>
```

## Bottom tab bar

```tsx
<LiquidGlassView material="thick" cornerRadius={32} interactive
  style={{ position: 'absolute', bottom: insets.bottom + 8, left: 16, right: 16, height: 64,
           flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
  {tabs.map((t) => <TabIcon key={t.key} {...t} />)}
</LiquidGlassView>
```

React Navigation: render it from `tabBar={(props) => <GlassTabBar {...props} />}` and wrap each **screen's** content in a `GlassBackdrop`. Better still, wrap the navigator's content area once.

## Glass cards scrolling over a wallpaper

```tsx
<View style={{ flex: 1 }}>
  <GlassBackdrop style={StyleSheet.absoluteFill}>
    <Image source={wallpaper} style={StyleSheet.absoluteFill} />
  </GlassBackdrop>
  <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
    {items.map((it) => <LiquidGlassCard key={it.id}>…</LiquidGlassCard>)}
  </ScrollView>
</View>
```

Keep the default `quality="auto"`. Moving glass has to re-blur what's under it every frame on Android 12+ whatever the quality. Keep the number of cards visible at once small (see [Quality & performance](06-quality-and-performance.md)).

## Glass in a Modal / bottom sheet

A Modal is a separate window, so give it **its own** backdrop:

```tsx
<Modal transparent>
  <GlassBackdrop style={StyleSheet.absoluteFill}>
    <Image source={blurredContextImage} style={StyleSheet.absoluteFill} />
  </GlassBackdrop>
  <LiquidGlassView material="thick" style={styles.sheet}>…</LiquidGlassView>
</Modal>
```

## Two backdrops on one screen

```tsx
<GlassBackdrop backdropId="map" style={styles.top}><MapView /></GlassBackdrop>
<GlassBackdrop backdropId="list" style={styles.bottom}><List /></GlassBackdrop>

<LiquidGlassView backdropId="map" style={styles.mapControls} />
```

## Hero element with tilt lighting

```tsx
<LiquidGlassView material="clear" interactive motionLighting chromaticAberration={0.3} quality="high" />
```

## Animate between materials

Changing props animates natively (`transitionDuration`, default 180 ms):

```tsx
<LiquidGlassView material={expanded ? 'thick' : 'thin'} transitionDuration={250} />
```

## Match custom UI to the glass

```tsx
const { resolvedScheme, defaultMaterial, materials } = useGlassTheme();
const values = resolveMaterial({ props: {}, colorScheme: resolvedScheme, defaultMaterial, materialOverrides: materials });
// values.tintColor, values.fallbackColor, …
```
