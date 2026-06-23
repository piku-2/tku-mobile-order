import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader, Card, PrimaryButton } from '@/components/brand/ui';
import { Brand, Gap, Radius } from '@/constants/brand';
import { useCart } from '@/context/cart';
import { yen } from '@/data/menu';

// QRコード風の見た目だけのモック (実際はサーバー発行のコードを表示する想定)
const QR = [
  1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0,
  0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1,
  1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0,
];

/** 受け取り予定時刻を算出。「すぐに」は現在 + 8分、時刻指定はその時刻。 */
function computeReadyAt(pickupTime: string | undefined): Date {
  const now = new Date();
  if (!pickupTime || pickupTime === 'すぐに') {
    return new Date(now.getTime() + 8 * 60_000);
  }
  const m = /^(\d{1,2}):(\d{2})$/.exec(pickupTime);
  if (!m) return new Date(now.getTime() + 8 * 60_000);
  const target = new Date(now);
  target.setHours(Number(m[1]), Number(m[2]), 0, 0);
  // 既に過ぎていれば現在 + 8分にフォールバック
  if (target.getTime() <= now.getTime()) {
    return new Date(now.getTime() + 8 * 60_000);
  }
  return target;
}

const hhmm = (d: Date) =>
  `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

export default function CompleteScreen() {
  const router = useRouter();
  const { lastOrder } = useCart();

  const orderNumber = lastOrder?.number ?? 'A-0237';
  const total = lastOrder?.total ?? 0;
  const count = lastOrder?.count ?? 0;

  const summary = useMemo(() => {
    if (!lastOrder || lastOrder.lines.length === 0) return '';
    const [first, ...rest] = lastOrder.lines;
    const head = `${first.item.name}${first.qty > 1 ? ` ×${first.qty}` : ''}`;
    return rest.length > 0 ? `${head} ほか${rest.length}点` : head;
  }, [lastOrder]);

  const readyAt = useMemo(() => computeReadyAt(lastOrder?.pickupTime), [lastOrder]);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(id);
  }, []);
  const minutesLeft = Math.max(1, Math.ceil((readyAt.getTime() - now) / 60_000));

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.headerWrap}>
        <AppHeader title="注文完了" />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.check}>
          <Text style={styles.checkMark}>✓</Text>
        </View>
        <Text style={styles.thanks}>ご注文ありがとうございます！</Text>
        {summary !== '' && (
          <Text style={styles.summary}>
            {summary}（{count}点）・ {yen(total)}
          </Text>
        )}

        <Text style={styles.label}>注文番号</Text>
        <Text style={styles.orderNumber}>{orderNumber}</Text>

        <Text style={styles.label}>受け取りカウンター</Text>
        <Text style={styles.counter}>A カウンター</Text>

        {/* QR */}
        <View style={styles.qr}>
          {QR.map((b, i) => (
            <View key={i} style={[styles.qrBlock, b ? styles.qrDark : styles.qrLight]} />
          ))}
        </View>
        <Text style={styles.qrHelp}>この画面をスタッフにご提示ください</Text>

        <Card style={styles.ready}>
          <Text style={styles.readyLabel}>受け取り予定時間</Text>
          <Text style={styles.readyTime}>{hhmm(readyAt)} 頃</Text>
          <Text style={styles.readySub}>あと約 {minutesLeft} 分</Text>
        </Card>

        <Text style={styles.note}>※ 調理状況により前後する場合があります</Text>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <PrimaryButton label="注文状況を確認する" onPress={() => router.replace('/status')} />
        <Text style={styles.homeLink} onPress={() => router.replace('/home')}>
          ホームに戻る
        </Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  headerWrap: { backgroundColor: Brand.crimson },
  content: { padding: Gap.xl, alignItems: 'center', paddingBottom: Gap.xl },

  check: {
    width: 64,
    height: 64,
    borderRadius: Radius.pill,
    backgroundColor: Brand.crimson,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Gap.sm,
  },
  checkMark: { color: Brand.white, fontSize: 34, fontWeight: '900' },
  thanks: { color: Brand.text, fontSize: 18, fontWeight: '900', marginTop: Gap.md },
  summary: { color: Brand.muted, fontSize: 13, marginTop: 6, textAlign: 'center' },

  label: { color: Brand.muted, fontSize: 12, marginTop: Gap.md },
  orderNumber: { color: Brand.text, fontSize: 36, fontWeight: '900', letterSpacing: 1, marginTop: 4 },
  counter: { color: Brand.text, fontSize: 22, fontWeight: '900', marginTop: 4 },

  qr: {
    width: 200,
    height: 200,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Gap.xl,
    padding: 8,
    borderRadius: Radius.md,
    backgroundColor: Brand.white,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  qrBlock: { width: 20, height: 20, margin: 1 },
  qrDark: { backgroundColor: '#111111' },
  qrLight: { backgroundColor: Brand.white },
  qrHelp: { marginTop: Gap.md, color: Brand.muted, fontSize: 12 },

  ready: {
    width: '100%',
    marginTop: Gap.xl,
    borderColor: '#E3C292',
    alignItems: 'center',
  },
  readyLabel: { color: Brand.text, fontSize: 13, fontWeight: '800' },
  readyTime: { color: Brand.crimson, fontSize: 32, fontWeight: '900', marginTop: 8 },
  readySub: { color: Brand.text, fontSize: 13, marginTop: 2 },
  note: { color: Brand.muted, fontSize: 11, marginTop: Gap.lg },

  bottomBar: {
    paddingHorizontal: Gap.lg,
    paddingTop: Gap.md,
    backgroundColor: Brand.white,
    borderTopWidth: 1,
    borderTopColor: Brand.hairline,
    gap: Gap.md,
  },
  homeLink: { color: Brand.muted, fontSize: 14, fontWeight: '700', textAlign: 'center', marginBottom: Gap.sm },
});
