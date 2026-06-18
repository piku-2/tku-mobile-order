import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader, HeaderCartButton } from '@/components/brand/ui';
import { Brand, Gap, Radius } from '@/constants/brand';
import { useCart } from '@/context/cart';
import { yen } from '@/data/menu';

type PastOrder = {
  id: string;
  date: string;
  items: string;
  total: number;
  emoji: string;
  status: '受け取り済み' | 'キャンセル';
};

const PAST_ORDERS: PastOrder[] = [
  { id: 'A-0231', date: '6/17 (火) 12:10', items: '醤油ラーメン ほか1点', total: 640, emoji: '🍜', status: '受け取り済み' },
  { id: 'A-0198', date: '6/16 (月) 12:35', items: 'ビーフカレー', total: 531, emoji: '🍛', status: '受け取り済み' },
  { id: 'A-0150', date: '6/13 (金) 13:05', items: '油淋鶏定食', total: 612, emoji: '🍗', status: '受け取り済み' },
  { id: 'A-0102', date: '6/11 (水) 11:50', items: '焼きおにぎりセット', total: 252, emoji: '🍙', status: 'キャンセル' },
];

export default function HistoryScreen() {
  const router = useRouter();
  const { count } = useCart();

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.headerWrap}>
        <AppHeader title="注文履歴" right={<HeaderCartButton count={count} />} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>28</Text>
            <Text style={styles.summaryLabel}>今月の注文</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{yen(15280)}</Text>
            <Text style={styles.summaryLabel}>今月の利用額</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{yen(1730)}</Text>
            <Text style={styles.summaryLabel}>割引で節約</Text>
          </View>
        </View>

        {PAST_ORDERS.map((o) => (
          <View key={o.id} style={styles.card}>
            <View style={styles.thumb}>
              <Text style={styles.emoji}>{o.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.rowBetween}>
                <Text style={styles.orderId}>{o.id}</Text>
                <Text
                  style={[
                    styles.badge,
                    o.status === 'キャンセル' ? styles.badgeCancel : styles.badgeDone,
                  ]}>
                  {o.status}
                </Text>
              </View>
              <Text style={styles.items}>{o.items}</Text>
              <View style={styles.rowBetween}>
                <Text style={styles.date}>{o.date}</Text>
                <Text style={styles.total}>{yen(o.total)}</Text>
              </View>
            </View>
          </View>
        ))}

        <Text style={styles.reorderHint} onPress={() => router.push('/menu')}>
          もう一度同じものを注文する ›
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  headerWrap: { backgroundColor: Brand.crimson },
  content: { padding: Gap.lg, paddingBottom: Gap.xxl, gap: Gap.md },

  summary: {
    flexDirection: 'row',
    backgroundColor: Brand.lightBeige,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: Radius.lg,
    paddingVertical: Gap.lg,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1, backgroundColor: Brand.border },
  summaryValue: { color: Brand.crimson, fontSize: 18, fontWeight: '900' },
  summaryLabel: { color: Brand.muted, fontSize: 11, marginTop: 4 },

  card: {
    flexDirection: 'row',
    gap: Gap.md,
    backgroundColor: Brand.white,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: Radius.lg,
    padding: Gap.md,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    backgroundColor: '#EAD9C4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 30 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { color: Brand.text, fontSize: 14, fontWeight: '900' },
  items: { color: Brand.text, fontSize: 13, marginVertical: 4 },
  date: { color: Brand.muted, fontSize: 12 },
  total: { color: Brand.text, fontSize: 14, fontWeight: '800' },
  badge: {
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  badgeDone: { color: '#2E7D32', backgroundColor: '#E6F4E6' },
  badgeCancel: { color: Brand.muted, backgroundColor: '#EFEFEF' },

  reorderHint: {
    color: Brand.crimson,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: Gap.sm,
  },
});
