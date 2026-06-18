import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton, SecondaryButton } from '@/components/brand/ui';
import { Brand, Gap, Radius } from '@/constants/brand';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      {/* キャンパスのヒーロー */}
      <View style={styles.hero}>
        <SafeAreaView edges={['top']} style={styles.heroSafe}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>TKU</Text>
            <Text style={styles.logoSub}>since 1900</Text>
          </View>
          <Text style={styles.heroTitle}>{'TOKYO KEIZAI\nUNIVERSITY'}</Text>
          <Text style={styles.heroCopy}>
            {'東京経済大学の学食を\nもっと便利に、もっとおいしく。'}
          </Text>
        </SafeAreaView>
      </View>

      {/* ログイン操作 */}
      <SafeAreaView edges={['bottom']} style={styles.body}>
        <View style={styles.buttons}>
          <PrimaryButton label="学生ログイン" onPress={() => router.replace('/home')} />
          <SecondaryButton label="ゲストで利用する" onPress={() => router.replace('/home')} />
          <Text style={styles.smallLink}>アカウントをお持ちでない方へ</Text>
        </View>

        <View style={styles.guideBox}>
          <Text style={styles.guideIcon}>💡</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.guideTitle}>はじめての方へ</Text>
            <Text style={styles.guideText}>ご利用ガイドで使い方をチェック</Text>
          </View>
          <Text style={styles.guideArrow}>›</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Brand.bg,
  },
  hero: {
    flex: 1,
    backgroundColor: Brand.beige,
  },
  heroSafe: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Gap.lg,
    paddingHorizontal: Gap.xl,
  },
  logoBox: {
    width: 96,
    height: 112,
    backgroundColor: Brand.crimson,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Brand.gold,
  },
  logoText: {
    color: Brand.white,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 1,
  },
  logoSub: {
    color: '#F5D98C',
    fontSize: 10,
    marginTop: 4,
  },
  heroTitle: {
    color: Brand.crimson,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 28,
    letterSpacing: 1,
  },
  heroCopy: {
    color: Brand.text,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  body: {
    paddingHorizontal: Gap.xl,
    paddingTop: Gap.xl,
    gap: Gap.lg,
  },
  buttons: {
    gap: Gap.md,
  },
  smallLink: {
    color: Brand.muted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: Gap.xs,
  },
  guideBox: {
    marginBottom: Gap.lg,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.lightBeige,
    borderRadius: Radius.md,
    padding: Gap.lg,
    flexDirection: 'row',
    gap: Gap.md,
    alignItems: 'center',
  },
  guideIcon: {
    fontSize: 24,
  },
  guideTitle: {
    color: Brand.text,
    fontSize: 14,
    fontWeight: '800',
  },
  guideText: {
    color: Brand.muted,
    fontSize: 12,
    marginTop: 2,
  },
  guideArrow: {
    color: Brand.muted,
    fontSize: 22,
    fontWeight: '800',
  },
});
