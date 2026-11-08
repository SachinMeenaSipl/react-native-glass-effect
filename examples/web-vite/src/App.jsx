import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MINIMAL } from '../../shared/minimal';
import { SCENES, findScene } from '../../shared/scenes';

// #/<scene-id> opens a scene, #/minimal/<page-id> a copy-paste example from the docs.
// ?embed=1 hides the gallery chrome (used by the docs site).
const embedded = new URLSearchParams(window.location.search).has('embed');
const readId = () => window.location.hash.replace(/^#\/?/, '');

export default function App() {
  const [id, setId] = useState(readId);

  useEffect(() => {
    const onHash = () => setId(readId());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const Minimal = id.startsWith('minimal/') ? MINIMAL[id.slice('minimal/'.length)] : undefined;
  if (Minimal) {
    return (
      <View style={styles.fill}>
        <Minimal />
      </View>
    );
  }

  const scene = findScene(id);
  if (scene) {
    const { Component } = scene;
    return (
      <View style={styles.fill}>
        <Component />
        {!embedded && (
          <Pressable style={styles.back} onPress={() => (window.location.hash = '')}>
            <Text style={styles.backText}>← All examples</Text>
          </Pressable>
        )}
      </View>
    );
  }

  const groups = [...new Set(SCENES.map((s) => s.group))];
  return (
    <ScrollView style={styles.fill} contentContainerStyle={styles.index}>
      <Text style={styles.h1}>Liquid Glass · Web examples</Text>
      <Text style={styles.note}>
        Every example runs the real library through react-native-web. On the web, glass uses CSS
        backdrop-filter; refraction and touch lighting need Android or iOS.
      </Text>
      {groups.map((group) => (
        <View key={group} style={styles.group}>
          <Text style={styles.h2}>{group}</Text>
          {SCENES.filter((s) => s.group === group).map((s) => (
            <Pressable key={s.id} onPress={() => (window.location.hash = `/${s.id}`)} style={styles.link}>
              <Text style={styles.linkText}>{s.title}</Text>
            </Pressable>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, height: '100vh', backgroundColor: '#0b0b14' },
  index: { padding: 24, maxWidth: 720, width: '100%', alignSelf: 'center' },
  h1: { color: '#fff', fontSize: 28, fontWeight: '800' },
  note: { color: '#c8c8d4', fontSize: 15, marginTop: 8, lineHeight: 22 },
  group: { marginTop: 24 },
  h2: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  link: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: 8 },
  linkText: { color: '#fff', fontSize: 16 },
  back: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  backText: { color: '#fff', fontSize: 13 },
});
