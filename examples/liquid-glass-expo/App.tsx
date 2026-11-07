import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { BackHandler, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useGlassCapabilities } from 'react-native-liquid-glass-native';
import { SCENES, findScene } from '../shared/scenes';

/**
 * Every example from the docs, running natively. Tap one to open it;
 * the Android back button (or "All examples" on iOS, which has no back button) returns here.
 */
export default function App() {
  const caps = useGlassCapabilities();
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (id === null) return false;
      setId(null);
      return true;
    });
    return () => sub.remove();
  }, [id]);

  const scene = id ? findScene(id) : undefined;
  if (scene) {
    const { Component } = scene;
    return (
      <View style={styles.fill}>
        <StatusBar style="light" />
        <Component />
        {Platform.OS === 'ios' && (
          <Pressable style={styles.back} onPress={() => setId(null)} accessibilityRole="button">
            <Text style={styles.backText}>← All examples</Text>
          </Pressable>
        )}
      </View>
    );
  }

  const groups = [...new Set(SCENES.map((s) => s.group))];
  return (
    <ScrollView style={styles.fill} contentContainerStyle={styles.index}>
      <StatusBar style="light" />
      <Text style={styles.h1}>Liquid Glass · Expo</Text>
      <Text style={styles.note}>
        renderer: {caps.bestRenderer} · native: {caps.isNativeAvailable ? 'yes' : 'no'}
      </Text>
      {groups.map((group) => (
        <View key={group} style={styles.group}>
          <Text style={styles.h2}>{group}</Text>
          {SCENES.filter((s) => s.group === group).map((s) => (
            <Pressable key={s.id} onPress={() => setId(s.id)} style={styles.link}>
              <Text style={styles.linkText}>{s.title}</Text>
            </Pressable>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: '#0b0b14' },
  index: { padding: 20, paddingTop: 56 },
  h1: { color: '#fff', fontSize: 26, fontWeight: '800' },
  note: { color: '#c8c8d4', fontSize: 14, marginTop: 6 },
  group: { marginTop: 20 },
  h2: { color: '#fff', fontSize: 17, fontWeight: '700', marginBottom: 8 },
  link: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: 8 },
  linkText: { color: '#fff', fontSize: 16 },
  back: {
    position: 'absolute',
    top: 54,
    right: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  backText: { color: '#fff', fontSize: 12 },
});
