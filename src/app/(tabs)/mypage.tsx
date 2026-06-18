import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader, Card, HeaderCartButton } from '@/components/brand/ui';
import { Brand, Gap, Radius } from '@/constants/brand';
import { useCart } from '@/context/cart';
import { yen } from '@/data/menu';

const MENU_ITEMS: { icon: string; label: string }[] = [
  { icon: '🔔', label: '通知設定' },
  { icon: '⚠️', label: 'アレルギー設定' },
  { icon: '💳', label: 'お支払い方法' },
  { icon: '🎫', label: 'クーポン・食事プラン' },
  { icon: '❓', label: 'ご利用ガイド' },
  { icon: '⚙️', label: 'アプリ設定' },
];

export default function MyPageScreen() {
  const router = useRouter();
  const { count } = useCart();

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.headerWrap}>
        <AppHeader title="マイページ" right={<HeaderCartButton count={count} />} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* プロフィール */}
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>経</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>経大 太郎</Text>
            <Text style={styles.sub}>経済学部 2年 ・ 学籍番号 24E0237</Text>
          </View>
          <Text style={styles.edit}>編集 ›</Text>
        </View>

        {/* 残高・プラン */}
        <View style={styles.balanceRow}>
          <Card style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>生協マネー残高</Text>
            <Text style={styles.balanceValue}>{yen(1250)}</Text>
            <Text style={styles.balanceAction}>チャージする ›</Text>
          </Card>
          <Card style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>食事プラン</Text>
            <Text style={styles.balanceValue}>残り12回</Text>
            <Text style={styles.balanceAction}>明細を見る ›</Text>
          </Card>
        </View>

        {/* メニューリスト */}
        <View style={styles.list}>
          {MENU_ITEMS.map((m, i) => (
            <Pressable
              key={m.label}
              style={({ pressed }) => [
                styles.listRow,
                i < MENU_ITEMS.length - 1 && styles.listRowBorder,
                pressed && styles.pressed,
              ]}>
              <Text style={styles.listIcon}>{m.icon}</Text>
              <Text style={styles.listLabel}>{m.label}</Text>
              <Text style={styles.chev}>›</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={() => router.replace('/')}
          style={({ pressed }) => [styles.logout, pressed && styles.pressed]}>
          <Text style={styles.logoutText}>ログアウト</Text>
        </Pressable>

        <Text style={styles.version}>TKU 学食モバイルオーダー v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  headerWrap: { backgroundColor: Brand.crimson },
  content: { padding: Gap.lg, paddingBottom: Gap.xxl, gap: Gap.lg },
  pressed: { opacity: 0.85 },

  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.md,
    backgroundColor: Brand.white,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: Radius.lg,
    padding: Gap.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: Radius.pill,
    backgroundColor: Brand.crimson,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: Brand.white, fontSize: 24, fontWeight: '900' },
  name: { color: Brand.text, fontSize: 17, fontWeight: '900' },
  sub: { color: Brand.muted, fontSize: 12, marginTop: 4 },
  edit: { color: Brand.crimson, fontSize: 13, fontWeight: '800' },

  balanceRow: { flexDirection: 'row', gap: Gap.md },
  balanceCard: { flex: 1, gap: 4 },
  balanceLabel: { color: Brand.muted, fontSize: 12 },
  balanceValue: { color: Brand.text, fontSize: 20, fontWeight: '900' },
  balanceAction: { color: Brand.crimson, fontSize: 12, fontWeight: '800', marginTop: 4 },

  list: {
    backgroundColor: Brand.white,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: Gap.md, padding: Gap.lg },
  listRowBorder: { borderBottomWidth: 1, borderBottomColor: Brand.hairline },
  listIcon: { fontSize: 18, width: 24, textAlign: 'center' },
  listLabel: { flex: 1, color: Brand.text, fontSize: 15, fontWeight: '600' },
  chev: { color: Brand.muted, fontSize: 20, fontWeight: '700' },

  logout: {
    height: 50,
    borderRadius: Radius.md,
    backgroundColor: '#F5F1EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: { color: Brand.text, fontSize: 15, fontWeight: '800' },
  version: { color: Brand.muted, fontSize: 11, textAlign: 'center' },
});
