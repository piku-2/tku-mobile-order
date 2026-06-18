/**
 * 東京経済大学 学食モバイルオーダー のブランドカラー / 余白定義。
 * デザイン案 (もとは _layout.tsx に貼られていたモック) のパレットをそのまま採用。
 */

export const Brand = {
  crimson: '#8B0E1A',
  darkCrimson: '#6E0813',
  gold: '#D8B45D',
  beige: '#F6EAD8',
  lightBeige: '#FBF6EE',
  border: '#E8D8C5',
  text: '#222222',
  muted: '#777777',
  bg: '#FFFDF8',
  white: '#FFFFFF',
  hairline: '#EFEFEF',
  warn: '#D79A20',
  // 混雑度バーの色
  gaugeActive: '#E0A72E',
  gaugeMuted: '#D7D0C8',
} as const;

/** 余白スケール (8pxグリッド) */
export const Gap = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;
