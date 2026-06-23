import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FoodImage } from '@/components/brand/food-image';
import { AppHeader, Card, Divider, PrimaryButton, SecondaryButton } from '@/components/brand/ui';
import { Brand, Gap, Radius } from '@/constants/brand';
import { linePrice, RICE_LABEL, useCart } from '@/context/cart';
import { PICKUP_TIMES, yen } from '@/data/menu';

const PAYMENTS = [
  { id: 'paypay', label: 'PayPay', mark: 'P' },
  { id: 'card', label: 'クレジットカード', mark: '▣' },
  { id: 'coop', label: '大学生協マネー（残高 ¥1,250）', mark: '生' },
] as const;

export default function CartScreen() {
  const router = useRouter();
  const {
    lines,
    setQty,
    removeLine,
    pickupTime,
    setPickupTime,
    subtotal,
    studentDiscount,
    mealPlanDiscount,
    total,
    placeOrder,
  } = useCart();

  const [payment, setPayment] = useState<string>('paypay');
  const [processing, setProcessing] = useState(false);

  if (lines.length === 0) {
    return (
      <View style={styles.screen}>
        <SafeAreaView edges={['top']} style={styles.headerWrap}>
          <AppHeader title="カート" back />
        </SafeAreaView>
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🍽</Text>
          <Text style={styles.emptyTitle}>カートは空です</Text>
          <Text style={styles.emptyText}>お好きなメニューを追加してください。</Text>
          <PrimaryButton
            label="メニューを見る"
            style={styles.emptyBtn}
            onPress={() => router.replace('/menu')}
          />
        </View>
      </View>
    );
  }

  const onConfirm = () => {
    if (processing) return;
    setProcessing(true);
    // 決済処理中の体験を再現してから完了画面へ
    setTimeout(() => {
      placeOrder();
      router.replace('/complete');
    }, 950);
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.headerWrap}>
        <AppHeader title="カート" back />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.pickupBar}>
          <Text style={styles.pickupText}>受け取り時間：{pickupTime} 頃</Text>
        </View>

        {/* カート明細 */}
        {lines.map((l) => (
          <View key={l.key} style={styles.item}>
            <View style={styles.thumb}>
              <FoodImage item={l.item} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{l.item.name}</Text>
              {l.item.riceOption && <Text style={styles.itemOpt}>ごはん：{RICE_LABEL[l.rice]}</Text>}
              <Text style={styles.itemPrice}>{yen(linePrice(l))}</Text>
            </View>
            <View style={styles.itemRight}>
              <View style={styles.qtyBox}>
                <Pressable hitSlop={8} onPress={() => setQty(l.key, l.qty - 1)}>
                  <Text style={styles.qtyBtn}>−</Text>
                </Pressable>
                <Text style={styles.qtyValue}>{l.qty}</Text>
                <Pressable hitSlop={8} onPress={() => setQty(l.key, l.qty + 1)}>
                  <Text style={styles.qtyBtn}>＋</Text>
                </Pressable>
              </View>
              <Pressable hitSlop={8} onPress={() => removeLine(l.key)}>
                <Text style={styles.remove}>削除</Text>
              </Pressable>
            </View>
          </View>
        ))}

        {/* 受け取り時間の変更 */}
        <Text style={styles.sectionTitle}>受け取り時間</Text>
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

        {/* 金額サマリ */}
        <Card style={styles.summary}>
          <View style={styles.rowBetween}>
            <Text style={styles.sumLabel}>小計</Text>
            <Text style={styles.sumValue}>{yen(subtotal)}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.sumLabel}>学生割引（学割10%）</Text>
            <Text style={styles.discount}>- {yen(studentDiscount)}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.sumLabel}>食事プラン（残り12回）</Text>
            <Text style={styles.discount}>- {yen(mealPlanDiscount)}</Text>
          </View>
          <Divider />
          <View style={styles.rowBetween}>
            <Text style={styles.totalLabel}>合計</Text>
            <Text style={styles.totalValue}>{yen(total)}</Text>
          </View>
        </Card>

        {/* 支払い方法 */}
        <Text style={styles.sectionTitle}>お支払い方法（キャッシュレス）</Text>
        <View style={styles.paymentList}>
          {PAYMENTS.map((p, i) => {
            const active = p.id === payment;
            return (
              <Pressable
                key={p.id}
                onPress={() => setPayment(p.id)}
                style={[styles.payRow, i < PAYMENTS.length - 1 && styles.payRowBorder]}>
                <View style={styles.payMark}>
                  <Text style={styles.payMarkText}>{p.mark}</Text>
                </View>
                <Text style={styles.payLabel}>{p.label}</Text>
                <View style={[styles.radio, active && styles.radioOn]}>
                  {active && <View style={styles.radioDot} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        <SecondaryButton label="メニューを追加する" onPress={() => router.replace('/menu')} />
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <PrimaryButton
          label={`注文を確定する　${yen(total)}`}
          onPress={onConfirm}
          loading={processing}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  headerWrap: { backgroundColor: Brand.crimson },
  content: { padding: Gap.lg, paddingBottom: Gap.xl, gap: Gap.md },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Gap.xl, gap: Gap.sm },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: { color: Brand.text, fontSize: 18, fontWeight: '900' },
  emptyText: { color: Brand.muted, fontSize: 14, textAlign: 'center' },
  emptyBtn: { marginTop: Gap.lg, alignSelf: 'stretch' },

  pickupBar: {
    backgroundColor: Brand.lightBeige,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: Radius.md,
    padding: Gap.md,
  },
  pickupText: { color: Brand.text, fontSize: 14, fontWeight: '700' },

  item: {
    flexDirection: 'row',
    gap: Gap.md,
    backgroundColor: Brand.white,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: Radius.md,
    padding: Gap.md,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: Radius.sm,
    backgroundColor: '#EAD9C4',
    overflow: 'hidden',
  },
  itemName: { color: Brand.text, fontSize: 14, fontWeight: '800' },
  itemOpt: { color: Brand.muted, fontSize: 12, marginTop: 2 },
  itemPrice: { color: Brand.text, fontSize: 14, fontWeight: '700', marginTop: 4 },
  itemRight: { alignItems: 'flex-end', justifyContent: 'space-between' },

  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.md,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: Radius.pill,
    paddingHorizontal: Gap.md,
    height: 34,
  },
  qtyBtn: { color: Brand.crimson, fontSize: 18, fontWeight: '900' },
  qtyValue: { color: Brand.text, fontSize: 15, fontWeight: '900', minWidth: 16, textAlign: 'center' },
  remove: { color: Brand.muted, fontSize: 12, fontWeight: '700', marginTop: 6 },

  sectionTitle: { color: Brand.text, fontSize: 15, fontWeight: '900', marginTop: Gap.sm },
  timeRow: { flexDirection: 'row', gap: Gap.sm, flexWrap: 'wrap' },
  timeChip: {
    minWidth: 60,
    flexGrow: 1,
    height: 38,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeChipActive: { backgroundColor: Brand.crimson, borderColor: Brand.crimson },
  timeText: { color: Brand.text, fontSize: 13, fontWeight: '700' },
  timeTextActive: { color: Brand.white },

  summary: { gap: Gap.sm },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sumLabel: { color: Brand.text, fontSize: 13 },
  sumValue: { color: Brand.text, fontSize: 13, fontWeight: '800' },
  discount: { color: Brand.crimson, fontSize: 13, fontWeight: '800' },
  totalLabel: { color: Brand.text, fontSize: 15, fontWeight: '900' },
  totalValue: { color: Brand.crimson, fontSize: 24, fontWeight: '900' },

  paymentList: {
    backgroundColor: Brand.white,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  payRow: { flexDirection: 'row', alignItems: 'center', gap: Gap.md, padding: Gap.md },
  payRowBorder: { borderBottomWidth: 1, borderBottomColor: Brand.hairline },
  payMark: {
    width: 30,
    height: 30,
    borderRadius: Radius.sm,
    backgroundColor: Brand.lightBeige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payMarkText: { color: Brand.crimson, fontSize: 14, fontWeight: '900' },
  payLabel: { flex: 1, color: Brand.text, fontSize: 14, fontWeight: '700' },
  radio: {
    width: 22,
    height: 22,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    borderColor: '#BBBBBB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { borderColor: Brand.crimson },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Brand.crimson },

  bottomBar: {
    paddingHorizontal: Gap.lg,
    paddingTop: Gap.md,
    backgroundColor: Brand.white,
    borderTopWidth: 1,
    borderTopColor: Brand.hairline,
  },
});
