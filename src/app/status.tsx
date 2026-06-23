import { useRouter } from 'expo-router';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader, Card } from '@/components/brand/ui';
import { Brand, Gap, Radius } from '@/constants/brand';
import { useCart } from '@/context/cart';

type Step = {
  title: string;
  time: string;
  desc: string;
  state: 'done' | 'active' | 'todo';
};

const STEPS: Step[] = [
  { title: '受付完了', time: '11:55', desc: 'ご注文を受け付けました', state: 'done' },
  { title: '調理中', time: '11:57', desc: 'ただいま調理中です', state: 'done' },
  { title: 'まもなく完成', time: '12:02 頃', desc: 'もうすぐ出来上がります', state: 'active' },
  { title: '受け取り可', time: '12:03 頃', desc: 'カウンターでお受け取りください', state: 'todo' },
];

export default function StatusScreen() {
  const router = useRouter();
  const { lastOrder } = useCart();
  const orderNumber = lastOrder?.number ?? 'A-0237';

  const onCancel = () => {
    const back = () => router.replace('/home');
    if (Platform.OS === 'web') {
      back();
      return;
    }
    Alert.alert('注文をキャンセルしますか？', '調理開始後はキャンセルできない場合があります。', [
      { text: 'やめる', style: 'cancel' },
      { text: 'キャンセルする', style: 'destructive', onPress: back },
    ]);
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.headerWrap}>
        <AppHeader title="注文状況" back />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>注文番号</Text>
        <Text style={styles.orderNumber}>{orderNumber}</Text>

        <View style={styles.timeline}>
          {STEPS.map((s, i) => {
            const isLast = i === STEPS.length - 1;
            const reached = s.state !== 'todo';
            return (
              <View key={s.title} style={styles.row}>
                <View style={styles.left}>
                  <View
                    style={[
                      styles.dot,
                      s.state === 'done' && styles.dotDone,
                      s.state === 'active' && styles.dotActive,
                    ]}>
                    {reached && <Text style={styles.dotCheck}>{s.state === 'done' ? '✓' : '●'}</Text>}
                  </View>
                  {!isLast && <View style={[styles.line, reached && styles.lineDone]} />}
                </View>
                <View style={styles.rowBody}>
                  <View style={styles.rowBetween}>
                    <Text style={[styles.stepTitle, s.state === 'active' && styles.activeText]}>
                      {s.title}
                    </Text>
                    <Text style={styles.stepTime}>{s.time}</Text>
                  </View>
                  <Text style={styles.stepDesc}>{s.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <Card style={styles.notice}>
          <Text style={styles.noticeIcon}>📍</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.noticeTitle}>カウンター A でお待ちしています</Text>
            <Text style={styles.noticeText}>
              混雑時は画面をご提示のうえ、番号でお呼び出しいたします。
            </Text>
          </View>
        </Card>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <Pressable
          onPress={onCancel}
          style={({ pressed }) => [styles.cancelBtn, pressed && { opacity: 0.85 }]}>
          <Text style={styles.cancelText}>注文をキャンセルする</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  headerWrap: { backgroundColor: Brand.crimson },
  content: { padding: Gap.xl, paddingBottom: Gap.xl },

  label: { color: Brand.muted, fontSize: 13, textAlign: 'center' },
  orderNumber: {
    color: Brand.text,
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: Gap.xl,
  },

  timeline: { marginTop: Gap.sm },
  row: { flexDirection: 'row', minHeight: 84 },
  left: { width: 36, alignItems: 'center' },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#C6C6C6',
    backgroundColor: Brand.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: { backgroundColor: Brand.crimson, borderColor: Brand.crimson },
  dotActive: { backgroundColor: Brand.crimson, borderColor: Brand.crimson },
  dotCheck: { color: Brand.white, fontSize: 13, fontWeight: '900' },
  line: { width: 2, flex: 1, backgroundColor: '#E6D0D0' },
  lineDone: { backgroundColor: Brand.crimson },
  rowBody: { flex: 1, paddingBottom: Gap.lg },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stepTitle: { color: Brand.text, fontSize: 15, fontWeight: '900' },
  activeText: { color: Brand.crimson },
  stepTime: { color: Brand.muted, fontSize: 12 },
  stepDesc: { color: Brand.muted, fontSize: 12, marginTop: 6 },

  notice: { flexDirection: 'row', gap: Gap.md, marginTop: Gap.sm },
  noticeIcon: { fontSize: 24 },
  noticeTitle: { color: Brand.text, fontSize: 14, fontWeight: '900' },
  noticeText: { color: Brand.muted, fontSize: 12, marginTop: 4, lineHeight: 18 },

  bottomBar: {
    paddingHorizontal: Gap.lg,
    paddingTop: Gap.md,
    backgroundColor: Brand.white,
    borderTopWidth: 1,
    borderTopColor: Brand.hairline,
  },
  cancelBtn: {
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: '#F5F1EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Gap.sm,
  },
  cancelText: { color: Brand.text, fontSize: 15, fontWeight: '800' },
});
