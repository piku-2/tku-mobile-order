import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader, Card, PrimaryButton } from '@/components/brand/ui';
import { Brand, Gap, Radius } from '@/constants/brand';
import { RICE_DELTA, RICE_LABEL, useCart, type RiceSize } from '@/context/cart';
import { getMenuItem, yen } from '@/data/menu';

const RICE_ORDER: RiceSize[] = ['small', 'regular', 'large'];

export default function MenuDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCart();
  const item = getMenuItem(id);

  const [rice, setRice] = useState<RiceSize>('regular');
  const [qty, setQty] = useState(1);

  if (!item) {
    return (
      <View style={styles.screen}>
        <SafeAreaView edges={['top']} style={styles.headerWrap}>
          <AppHeader title="メニュー詳細" back />
        </SafeAreaView>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>メニューが見つかりませんでした。</Text>
        </View>
      </View>
    );
  }

  const unit = item.price + (item.riceOption ? RICE_DELTA[rice] : 0);
  const totalPrice = unit * qty;

  const onAdd = () => {
    addItem(item, { rice, qty });
    router.push('/cart');
  };

  const nutrition = [
    { label: 'エネルギー', value: item.nutrition.energy },
    { label: 'たんぱく質', value: item.nutrition.protein },
    { label: '脂質', value: item.nutrition.fat },
    { label: '炭水化物', value: item.nutrition.carbs },
    { label: '食塩相当量', value: item.nutrition.salt },
  ];

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.headerWrap}>
        <AppHeader title="メニュー詳細" back />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.photo}>
          <Text style={styles.photoEmoji}>{item.emoji}</Text>
          {item.recommended && (
            <View style={styles.recBadge}>
              <Text style={styles.recBadgeText}>本日のおすすめ</Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{yen(item.price)}</Text>
          </View>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.desc}>{item.description}</Text>

          {/* アレルゲン */}
          <View style={styles.rowBetween}>
            <Text style={styles.sectionLabel}>アレルゲン情報</Text>
            <Text style={styles.link}>詳細を見る ›</Text>
          </View>
          {item.allergens.length > 0 ? (
            <View style={styles.allergyRow}>
              {item.allergens.map((a) => (
                <View key={a} style={styles.allergyItem}>
                  <Text style={styles.allergyIcon}>⚠</Text>
                  <Text style={styles.allergyText}>{a}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.muted}>特定原材料の使用はありません。</Text>
          )}

          {/* 栄養成分 */}
          <Text style={[styles.sectionLabel, styles.gapTop]}>栄養成分（1食あたり）</Text>
          <View style={styles.nutritionGrid}>
            {nutrition.map((n) => (
              <View key={n.label} style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>{n.label}</Text>
                <Text style={styles.nutritionValue}>{n.value}</Text>
              </View>
            ))}
          </View>

          {/* ごはん量 */}
          {item.riceOption && (
            <Card tone="plain" style={[styles.riceBox, styles.gapTop]}>
              <Text style={styles.sectionLabel}>ごはんの量を選べます</Text>
              <View style={styles.riceRow}>
                {RICE_ORDER.map((r) => {
                  const active = r === rice;
                  const delta = RICE_DELTA[r];
                  return (
                    <Pressable
                      key={r}
                      onPress={() => setRice(r)}
                      style={[styles.riceOption, active && styles.riceSelected]}>
                      <Text style={[styles.riceLabel, active && styles.riceLabelActive]}>
                        {RICE_LABEL[r]}
                      </Text>
                      {delta !== 0 && (
                        <Text style={[styles.riceDelta, active && styles.riceLabelActive]}>
                          {delta > 0 ? `+${yen(delta)}` : `-${yen(Math.abs(delta))}`}
                        </Text>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </Card>
          )}

          {/* 数量 */}
          <View style={[styles.rowBetween, styles.gapTop]}>
            <Text style={styles.sectionLabel}>数量</Text>
            <View style={styles.qtyBox}>
              <Pressable hitSlop={8} onPress={() => setQty((q) => Math.max(1, q - 1))}>
                <Text style={styles.qtyBtn}>−</Text>
              </Pressable>
              <Text style={styles.qtyValue}>{qty}</Text>
              <Pressable hitSlop={8} onPress={() => setQty((q) => Math.min(9, q + 1))}>
                <Text style={styles.qtyBtn}>＋</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <PrimaryButton label={`カートに追加　${yen(totalPrice)}`} onPress={onAdd} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  headerWrap: { backgroundColor: Brand.crimson },
  content: { paddingBottom: Gap.xl },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { color: Brand.muted, fontSize: 14 },

  photo: {
    height: 220,
    backgroundColor: '#C89458',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoEmoji: { fontSize: 96 },
  recBadge: {
    position: 'absolute',
    left: Gap.lg,
    top: Gap.lg,
    backgroundColor: Brand.crimson,
    borderRadius: Radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  recBadgeText: { color: Brand.white, fontSize: 12, fontWeight: '800' },

  body: { padding: Gap.lg, gap: Gap.sm },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Gap.md },
  name: { flex: 1, color: Brand.text, fontSize: 20, fontWeight: '900', lineHeight: 26 },
  price: { color: Brand.crimson, fontSize: 20, fontWeight: '900' },
  category: { color: Brand.muted, fontSize: 13 },
  desc: { color: Brand.text, fontSize: 14, lineHeight: 21, marginTop: 4, marginBottom: Gap.sm },

  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionLabel: { color: Brand.text, fontSize: 14, fontWeight: '800' },
  gapTop: { marginTop: Gap.md },
  link: { color: Brand.crimson, fontSize: 12, fontWeight: '800' },
  muted: { color: Brand.muted, fontSize: 13, marginTop: 4 },

  allergyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Gap.lg, marginTop: Gap.sm },
  allergyItem: { alignItems: 'center', gap: 2 },
  allergyIcon: { color: Brand.warn, fontSize: 18 },
  allergyText: { color: Brand.text, fontSize: 12, fontWeight: '600' },

  nutritionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Gap.sm, marginTop: Gap.sm },
  nutritionItem: {
    width: '31.5%',
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.white,
    padding: Gap.sm,
  },
  nutritionLabel: { color: Brand.muted, fontSize: 11 },
  nutritionValue: { color: Brand.text, fontSize: 15, fontWeight: '900', marginTop: 4 },

  riceBox: { backgroundColor: '#FFF8F8', borderColor: '#E5C8C8' },
  riceRow: { flexDirection: 'row', gap: Gap.sm, marginTop: Gap.md },
  riceOption: {
    flex: 1,
    height: 56,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  riceSelected: { borderColor: Brand.crimson, backgroundColor: '#FFF1F1' },
  riceLabel: { color: Brand.text, fontSize: 14, fontWeight: '800' },
  riceLabelActive: { color: Brand.crimson },
  riceDelta: { color: Brand.muted, fontSize: 11, fontWeight: '700' },

  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.lg,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: Radius.pill,
    paddingHorizontal: Gap.lg,
    height: 40,
  },
  qtyBtn: { color: Brand.crimson, fontSize: 20, fontWeight: '900' },
  qtyValue: { color: Brand.text, fontSize: 16, fontWeight: '900', minWidth: 20, textAlign: 'center' },

  bottomBar: {
    paddingHorizontal: Gap.lg,
    paddingTop: Gap.md,
    backgroundColor: Brand.white,
    borderTopWidth: 1,
    borderTopColor: Brand.hairline,
  },
});
