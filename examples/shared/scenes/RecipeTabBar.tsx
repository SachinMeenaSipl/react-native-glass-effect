import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassView } from 'react-native-liquid-glass-native';
import { Background } from '../Background';

const TABS = [
  { key: 'home', icon: '⌂', label: 'Home' },
  { key: 'search', icon: '⌕', label: 'Search' },
  { key: 'library', icon: '♫', label: 'Library' },
  { key: 'profile', icon: '☺', label: 'Profile' },
];

const BOTTOM = 24; // In a real app: useSafeAreaInsets().bottom + 8

export default function RecipeTabBar() {
  const [active, setActive] = useState('home');

  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background label={TABS.find((t) => t.key === active)?.label} />
      </GlassBackdrop>

      <LiquidGlassView material="thick" cornerRadius={32} interactive style={styles.bar}>
        {TABS.map((tab) => {
          const selected = tab.key === active;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActive(tab.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              style={styles.tab}
            >
              <Text style={[styles.icon, selected && styles.selected]}>{tab.icon}</Text>
              <Text style={[styles.label, selected && styles.selected]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </LiquidGlassView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b14' },
  bar: {
    position: 'absolute',
    bottom: BOTTOM,
    left: 16,
    right: 16,
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: { alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4 },
  icon: { color: 'rgba(255,255,255,0.7)', fontSize: 20 },
  label: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 },
  selected: { color: '#ffffff', fontWeight: '700' },
});
