import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { Brand, Gap, Radius } from '@/constants/brand';

/** 画面上部のクリムゾンバー。back 指定で戻る矢印を表示。 */
export function AppHeader({
  title,
  back = false,
  right,
}: {
  title: string;
  back?: boolean;
  right?: ReactNode;
}) {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <View style={styles.headerSide}>
        {back ? (
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="戻る">
            <Text style={styles.headerIcon}>‹</Text>
          </Pressable>
        ) : (
          <Text style={styles.headerIcon}>☰</Text>
        )}
      </View>
      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles.headerSide, styles.headerSideRight]}>{right}</View>
    </View>
  );
}

/** ヘッダー右側に置くカートアイコン + 個数バッジ。 */
export function HeaderCartButton({ count }: { count: number }) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push('/cart')}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={`カート ${count}点`}>
      <Text style={styles.headerIcon}>🛒</Text>
      {count > 0 && (
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>{count > 9 ? '9+' : count}</Text>
        </View>
      )}
    </Pressable>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  style,
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.primaryBtn,
        (disabled || loading) && styles.btnDisabled,
        pressed && !disabled && styles.btnPressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={Brand.white} />
      ) : (
        <Text style={styles.primaryBtnText}>{label}</Text>
      )}
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
  style,
}: {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed, style]}>
      <Text style={styles.secondaryBtnText}>{label}</Text>
    </Pressable>
  );
}

export function Card({
  children,
  style,
  tone = 'beige',
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: 'beige' | 'plain';
}) {
  return (
    <View
      style={[
        styles.card,
        tone === 'beige' ? styles.cardBeige : styles.cardPlain,
        style,
      ]}>
      {children}
    </View>
  );
}

export function SectionTitle({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.sectionTitle, style]}>{children}</Text>;
}

export function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: Brand.crimson,
    paddingHorizontal: Gap.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSide: {
    width: 40,
    justifyContent: 'center',
  },
  headerSideRight: {
    alignItems: 'flex-end',
  },
  headerIcon: {
    color: Brand.white,
    fontSize: 24,
    fontWeight: '900',
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: Brand.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: Brand.darkCrimson,
    fontSize: 11,
    fontWeight: '900',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: Brand.white,
    fontSize: 17,
    fontWeight: '800',
  },
  primaryBtn: {
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: Brand.crimson,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: Brand.white,
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryBtn: {
    height: 50,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Brand.text,
    backgroundColor: Brand.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: Brand.text,
    fontSize: 15,
    fontWeight: '700',
  },
  btnDisabled: {
    opacity: 0.45,
  },
  btnPressed: {
    opacity: 0.82,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Gap.lg,
  },
  cardBeige: {
    backgroundColor: Brand.lightBeige,
    borderColor: Brand.border,
  },
  cardPlain: {
    backgroundColor: Brand.white,
    borderColor: Brand.border,
  },
  sectionTitle: {
    color: Brand.text,
    fontSize: 18,
    fontWeight: '900',
  },
  divider: {
    height: 1,
    backgroundColor: Brand.border,
    marginVertical: Gap.sm,
  },
});
