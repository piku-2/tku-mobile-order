import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { StyleSheet, Text, View } from 'react-native';

import { Brand, Gap, Radius } from '@/constants/brand';

/**
 * カート追加時に画面下部からスッと現れるトースト。
 * 親 (CartProvider) 側で key を更新して再マウントすることで毎回アニメさせる。
 * pointerEvents="none" の全画面オーバーレイなので操作を妨げない。
 */
export function CartToast({ text }: { text: string }) {
  return (
    <View pointerEvents="none" style={styles.overlay}>
      <Animated.View
        entering={FadeInDown.springify().damping(16)}
        exiting={FadeOutDown.duration(180)}
        style={styles.toast}>
        <View style={styles.check}>
          <Text style={styles.checkMark}>✓</Text>
        </View>
        <Text style={styles.text} numberOfLines={1}>
          {text}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 96,
    paddingHorizontal: Gap.lg,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.sm,
    maxWidth: '100%',
    backgroundColor: Brand.darkCrimson,
    paddingVertical: Gap.md,
    paddingHorizontal: Gap.lg,
    borderRadius: Radius.pill,
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Brand.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: { color: Brand.darkCrimson, fontSize: 13, fontWeight: '900' },
  text: { flexShrink: 1, color: Brand.white, fontSize: 14, fontWeight: '800' },
});
