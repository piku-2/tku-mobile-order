import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FoodImage } from '@/components/brand/food-image';
import { AppHeader, Card, HeaderCartButton, SectionTitle } from '@/components/brand/ui';
import { Brand, Gap, Radius } from '@/constants/brand';
import { useCart } from '@/context/cart';
import { CATEGORIES, MENU, PICKUP_TIMES, yen } from '@/data/menu';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 11) return 'おはようございます';
  if (h < 17) return 'こんにちは';
  return 'こんばんは';
}

export default function HomeScreen() {
  const router = useRouter();
  const { count, pickupTime, setPickupTime } = useCart();
  const recommended = MENU.find((m) => m.recommended) ?? MENU[0];

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.headerWrap}>
        <AppHeader title="ホーム" right={<HeaderCartButton count={count} />} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>{greeting()}、経大 太郎さん！</Text>

        <SectionTitle>今日のおすすめ</SectionTitle>
        <Pressable
          onPress={() => router.push(`/menu/${recommended.id}`)}
          style={({ pressed }) => [styles.hero, pressed && styles.pressed]}>
          <FoodImage item={recommended} style={styles.heroImage} />
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>本日のおすすめ</Text>
          </View>
          <View style={styles.heroFooter}>
            <Text style={styles.heroName}>{recommended.name}</Text>
            <Text style={styles.heroPrice}>{yen(recommended.price)}</Text>
          </View>
        </Pressable>

        {/* カテゴリ */}
        <View style={styles.categoryRow}>
          {CATEGORIES.map((c) => (
            <Pressable
              key={c.label}
              onPress={() => router.push('/menu')}
              style={({ pressed }) => [styles.category, pressed && styles.pressed]}>
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryEmoji}>{c.icon}</Text>
              </View>
              <Text style={styles.categoryText}>{c.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* 混雑状況 */}
        <Card style={styles.gap}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardLabel}>学食の混雑状況</Text>
            <Text style={styles.info}>ⓘ</Text>
          </View>
          <Text style={styles.muted}>いまの混雑度</Text>
          <Text style={styles.congestion}>やや混雑</Text>
          <View style={styles.gauge}>
            {[0, 1, 2, 3, 4].map((i) => (
              <View
                key={i}
                style={[styles.gaugeDot, i < 3 ? styles.gaugeOn : styles.gaugeOff]}
              />
            ))}
          </View>
          <Text style={styles.muted}>ピーク 12:00 - 13:00</Text>
        </Card>

        {/* 受け取り時間 */}
        <Text style={styles.subTitle}>受け取り時間を選ぶ</Text>
        <View style={styles.timeRow}>
          {PICKUP_TIMES.map((t) => {
            const active = t === pickupTime;
            return (
              <Pressable
                key={t}
                onPress={() => setPickupTime(t)}
                style={[styles.timeChip, active && styles.timeChipActive]}>
                <Text style={[styles.timeText, active && styles.timeTextActive]}>{t}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* メニューへの導線 */}
        <Text style={styles.subTitle}>人気メニュー</Text>
        {MENU.slice(0, 4).map((m) => (
          <Pressable
            key={m.id}
            onPress={() => router.push(`/menu/${m.id}`)}
            style={({ pressed }) => [styles.menuRow, pressed && styles.pressed]}>
            <View style={styles.menuThumb}>
              <FoodImage item={m} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuName}>{m.name}</Text>
              <Text style={styles.menuCat}>{m.category}</Text>
            </View>
            <Text style={styles.menuPrice}>{yen(m.price)}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  headerWrap: { backgroundColor: Brand.crimson },
  content: { padding: Gap.lg, paddingBottom: Gap.xxl, gap: Gap.md },
  pressed: { opacity: 0.85 },
  gap: { marginTop: Gap.xs },
  greeting: { color: Brand.text, fontSize: 14, fontWeight: '600' },
  subTitle: { color: Brand.text, fontSize: 15, fontWeight: '800', marginTop: Gap.sm },

  hero: {
    height: 168,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: '#C79C64',
  },
  heroImage: { width: '100%', height: '100%' },
  heroBadge: {
    position: 'absolute',
    left: Gap.md,
    top: Gap.md,
    backgroundColor: Brand.crimson,
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  heroBadgeText: { color: Brand.white, fontSize: 11, fontWeight: '800' },
  heroFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: Gap.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  heroName: { color: Brand.white, fontSize: 18, fontWeight: '900' },
  heroPrice: { color: Brand.white, fontSize: 16, fontWeight: '900' },

  categoryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  category: { alignItems: 'center', gap: 4 },
  categoryIcon: {
    width: 54,
    height: 54,
    borderRadius: Radius.pill,
    backgroundColor: Brand.lightBeige,
    borderWidth: 1,
    borderColor: Brand.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryEmoji: { fontSize: 24 },
  categoryText: { color: Brand.text, fontSize: 11, fontWeight: '700' },

  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { color: Brand.text, fontSize: 13, fontWeight: '800' },
  info: { color: Brand.muted, fontSize: 14 },
  muted: { color: Brand.muted, fontSize: 12, marginTop: 4 },
  congestion: { color: Brand.text, fontSize: 22, fontWeight: '900', marginTop: 4 },
  gauge: { flexDirection: 'row', gap: 6, marginTop: 8 },
  gaugeDot: { flex: 1, height: 8, borderRadius: 4 },
  gaugeOn: { backgroundColor: Brand.gaugeActive },
  gaugeOff: { backgroundColor: Brand.gaugeMuted },

  timeRow: { flexDirection: 'row', gap: 8 },
  timeChip: {
    flex: 1,
    height: 38,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeChipActive: { backgroundColor: Brand.crimson, borderColor: Brand.crimson },
  timeText: { color: Brand.text, fontSize: 12, fontWeight: '700' },
  timeTextActive: { color: Brand.white },

  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.md,
    backgroundColor: Brand.white,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: Radius.md,
    padding: Gap.sm,
  },
  menuThumb: {
    width: 52,
    height: 52,
    borderRadius: Radius.sm,
    backgroundColor: '#EAD9C4',
    overflow: 'hidden',
  },
  menuName: { color: Brand.text, fontSize: 14, fontWeight: '800' },
  menuCat: { color: Brand.muted, fontSize: 11, marginTop: 2 },
  menuPrice: { color: Brand.crimson, fontSize: 15, fontWeight: '900' },
});
