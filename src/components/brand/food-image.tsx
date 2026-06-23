import { Image, type ImageContentFit } from 'expo-image';
import { StyleSheet, type ImageStyle, type StyleProp } from 'react-native';

import type { MenuItem } from '@/data/menu';

/** 画像読み込み中に表示する暖色系のぼかしプレースホルダ。 */
const BLURHASH = 'L6Pj0^jE.AyE_3t7t7R**0o#DgR4';

/**
 * メニュー写真を表示する共通コンポーネント。
 * expo-image による blurhash プレースホルダ + フェードイン + ディスクキャッシュで、
 * オフライン時でも破綻せず、再表示は即時になる。
 */
export function FoodImage({
  item,
  style,
  contentFit = 'cover',
}: {
  item: MenuItem;
  style?: StyleProp<ImageStyle>;
  contentFit?: ImageContentFit;
}) {
  return (
    <Image
      source={item.image}
      placeholder={{ blurhash: BLURHASH }}
      contentFit={contentFit}
      transition={280}
      cachePolicy="memory-disk"
      recyclingKey={item.id}
      style={[styles.fill, style]}
    />
  );
}

const styles = StyleSheet.create({
  fill: { width: '100%', height: '100%' },
});
