import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassView } from 'react-native-liquid-glass-native';
import { Background } from '../Background';

const TABS = ['Listen', 'Browse', 'Radio', 'Library'];
const BOTTOM = 28; // In a real app: useSafeAreaInsets().bottom + 8

export default function RecipeTabBar() {
  const [active, setActive] = useState('Listen');

  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background topInset={56} />
      </GlassBackdrop>

      <LiquidGlassView material="thick" cornerRadius={34} interactive style={styles.bar}>
        {TABS.map((tab) => {
          const selected = tab === active;
          return (
            <Pressable
              key={tab}
              onPress={() => setActive(tab)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              style={[styles.tab, selected && styles.tabSelected]}
            >
              <Text style={[styles.label, selected && styles.labelSelected]}>{tab}</Text>
            </Pressable>
          );
        })}
      </LiquidGlassView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0c1150' },
  bar: {
    position: 'absolute',
    bottom: BOTTOM,
    left: 16,
    right: 16,
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  tab: { flex: 1, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  tabSelected: { backgroundColor: 'rgba(255,255,255,0.2)' },
  label: { color: 'rgba(255,255,255,0.75)', fontSize: 14, fontWeight: '600' },
  labelSelected: { color: '#fff', fontWeight: '800' },
});
