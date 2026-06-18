import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader, HeaderCartButton } from '@/components/brand/ui';
import { Brand, Gap, Radius } from '@/constants/brand';
import { useCart } from '@/context/cart';
import { CATEGORIES, MENU, yen, type MenuCategory } from '@/data/menu';

type Filter = MenuCategory | 'すべて';
const FILTERS: Filter[] = ['すべて', ...CATEGORIES.map((c) => c.label)];

export default function MenuScreen() {
  const router = useRouter();
  const { count, addItem } = useCart();
  const [filter, setFilter] = useState<Filter>('すべて');

  const items = useMemo(
    () => (filter === 'すべて' ? MENU : MENU.filter((m) => m.category === filter)),
    [filter],
  );

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.headerWrap}>
        <AppHeader title="メニュー" right={<HeaderCartButton count={count} />} />
      </SafeAreaView>

      {/* カテゴリフィルタ */}
      <View style={styles.filterWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}>
          {FILTERS.map((f) => {
            const active = f === filter;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={[styles.filterChip, active && styles.filterChipActive]}>
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{f}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {items.map((m) => (
          <Pressable
            key={m.id}
            onPress={() => router.push(`/menu/${m.id}`)}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
            <View style={styles.thumb}>
              <Text style={styles.emoji}>{m.emoji}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.name}>{m.name}</Text>
              <Text style={styles.desc} numberOfLines={2}>
                {m.description}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.price}>{yen(m.price)}</Text>
                <Pressable
                  hitSlop={8}
                  onPress={() => addItem(m)}
                  style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}>
                  <Text style={styles.addBtnText}>＋ 追加</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  headerWrap: { backgroundColor: Brand.crimson },
  pressed: { opacity: 0.85 },

  filterWrap: {
    backgroundColor: Brand.bg,
    borderBottomWidth: 1,
    borderBottomColor: Brand.border,
  },
  filterRow: { paddingHorizontal: Gap.lg, paddingVertical: Gap.md, gap: Gap.sm },
  filterChip: {
    paddingHorizontal: Gap.lg,
    height: 36,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: { backgroundColor: Brand.crimson, borderColor: Brand.crimson },
  filterText: { color: Brand.text, fontSize: 13, fontWeight: '700' },
  filterTextActive: { color: Brand.white },

  content: { padding: Gap.lg, paddingBottom: Gap.xxl, gap: Gap.md },
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
    width: 72,
    height: 72,
    borderRadius: Radius.md,
    backgroundColor: '#EAD9C4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 38 },
  cardBody: { flex: 1, justifyContent: 'space-between' },
  name: { color: Brand.text, fontSize: 15, fontWeight: '800' },
  desc: { color: Brand.muted, fontSize: 12, lineHeight: 17, marginTop: 2 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Gap.sm,
  },
  price: { color: Brand.crimson, fontSize: 16, fontWeight: '900' },
  addBtn: {
    paddingHorizontal: Gap.md,
    height: 32,
    borderRadius: Radius.pill,
    backgroundColor: Brand.lightBeige,
    borderWidth: 1,
    borderColor: Brand.crimson,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: Brand.crimson, fontSize: 12, fontWeight: '800' },
});
