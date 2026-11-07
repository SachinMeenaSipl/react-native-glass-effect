import { StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassCard } from 'react-native-liquid-glass-native';
import { ART } from '../assets';
import { Background } from '../Background';
import { AppIcon, text } from '../ui';

const WEEK = [0.4, 0.65, 0.3, 0.85, 0.55, 0.95, 0.7];
const BILLS = [
  { name: 'Studio rent', when: 'Tomorrow', amount: '$1,200', art: ART[6] },
  { name: 'Music Unlimited', when: 'Nov 12', amount: '$10.99', art: ART[1] },
];

/** A wallet: a balance card with the defaults, and a roomier card with its own props. */
export default function CardScene() {
  return (
    <View style={styles.screen}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <Background topInset={40} />
      </GlassBackdrop>

      <View style={styles.stack} pointerEvents="box-none">
        {/* Default: padding 16, material "regular". */}
        <LiquidGlassCard>
          <Text style={text.caption}>Total balance</Text>
          <Text style={styles.balance}>$12,480.32</Text>
          <Text style={styles.up}>▲ 2.4% this month</Text>
          <View style={styles.chart}>
            {WEEK.map((h, i) => (
              <View key={i} style={[styles.bar, { height: 56 * h, opacity: i === 5 ? 1 : 0.55 }]} />
            ))}
          </View>
        </LiquidGlassCard>

        {/* Any LiquidGlassView prop works, plus `padding`. */}
        <LiquidGlassCard material="thick" padding={22} cornerRadius={30}>
          <Text style={text.title}>Upcoming</Text>
          {BILLS.map((bill) => (
            <View key={bill.name} style={styles.bill}>
              <AppIcon image={bill.art.image} size={38} />
              <View style={styles.flex}>
                <Text style={text.body}>{bill.name}</Text>
                <Text style={text.caption}>{bill.when}</Text>
              </View>
              <Text style={styles.amount}>{bill.amount}</Text>
            </View>
          ))}
        </LiquidGlassCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0c1150' },
  stack: { flex: 1, justifyContent: 'center', padding: 16, gap: 16 },
  balance: { color: '#fff', fontSize: 40, fontWeight: '700', letterSpacing: -1 },
  up: { color: '#7dffb3', fontSize: 14, fontWeight: '700' },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 60, marginTop: 14 },
  bar: { flex: 1, borderRadius: 6, backgroundColor: '#fff' },
  bill: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14 },
  flex: { flex: 1 },
  amount: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
