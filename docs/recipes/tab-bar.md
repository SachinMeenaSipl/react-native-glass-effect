# Glass tab bar

A floating bottom tab bar with a selected state, accessibility roles and touch lighting.

<Preview id="recipe-tab-bar" />

## Code

<<< @/../examples/shared/scenes/RecipeTabBar.tsx

## How it works

- The screen content is in the backdrop. The bar floats on top with `position: 'absolute'`.
- `interactive` makes the light follow the finger across the bar on Android, and enables Apple's interactive glass on iOS 26.
- Each tab is a `Pressable` with `accessibilityRole="tab"` and `accessibilityState={{ selected }}`, so screen readers announce it correctly.
- `material="thick"` keeps the labels readable over any content.
- The selected tab gets a lighter capsule behind it, a plain `View` with a translucent white background inside the glass.

## With React Navigation

Turn the bar into a custom `tabBar`, and wrap the navigator's content area in one `GlassBackdrop`:

```tsx
import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';

function GlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <LiquidGlassView material="thick" cornerRadius={32} interactive style={styles.bar}>
      {state.routes.map((route, index) => {
        const selected = state.index === index;
        const { options } = descriptors[route.key];
        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={styles.tab}
          >
            <Text style={[styles.label, selected && styles.selected]}>{options.title ?? route.name}</Text>
          </Pressable>
        );
      })}
    </LiquidGlassView>
  );
}

<Tab.Navigator tabBar={(props) => <GlassTabBar {...props} />} screenOptions={{ headerShown: false }}>
```

Each screen's content must be inside a `GlassBackdrop` for the bar to blur it on Android.

::: info
This React Navigation snippet is a starting point and hasn't been tested in this repo. The standalone tab bar above has been.
:::

## In a real app

Use the safe-area inset for the bottom offset:

```tsx
const insets = useSafeAreaInsets();
const BOTTOM = insets.bottom + 8;
```
