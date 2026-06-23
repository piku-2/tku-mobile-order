/**
 * 学食メニューのモックデータ。実運用では API から取得する想定。
 */

import type { ImageSourcePropType } from 'react-native';

export type Allergen = '卵' | '乳' | '小麦' | '牛肉' | '大豆' | 'ごま' | 'えび' | 'かに';

export type Nutrition = {
  energy: string;
  protein: string;
  fat: string;
  carbs: string;
  salt: string;
};

export type MenuCategory = '定食' | '麺類' | 'カレー' | '軽食' | 'ドリンク';

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  emoji: string;
  /** メニュー写真 (リモートURL or バンドル画像) */
  image: ImageSourcePropType;
  category: MenuCategory;
  description: string;
  allergens: Allergen[];
  nutrition: Nutrition;
  /** ごはん量の調整に対応するか */
  riceOption: boolean;
  recommended?: boolean;
};

export const CATEGORIES: { label: MenuCategory; icon: string }[] = [
  { label: '定食', icon: '🍱' },
  { label: '麺類', icon: '🍜' },
  { label: 'カレー', icon: '🍛' },
  { label: '軽食', icon: '🍙' },
  { label: 'ドリンク', icon: '🥤' },
];

export const MENU: MenuItem[] = [
  {
    id: 'yurinchi',
    name: '油淋鶏定食',
    price: 680,
    emoji: '🍗',
    image: require('@/assets/images/food-yurinchi-hero.png'),
    category: '定食',
    description: 'カリッと揚げた鶏もも肉に、特製ねぎ醤油だれをたっぷり。ごはん・味噌汁・小鉢付き。',
    allergens: ['卵', '小麦', '大豆', 'ごま'],
    nutrition: { energy: '780 kcal', protein: '36.0 g', fat: '30.4 g', carbs: '90.2 g', salt: '2.9 g' },
    riceOption: true,
    recommended: true,
  },
  {
    id: 'hamburg',
    name: 'デミグラスハンバーグ定食',
    price: 720,
    emoji: '🍛',
    image: { uri: 'https://images.unsplash.com/photo-1580554530778-ca36943938b2?w=600&q=80' },
    category: '定食',
    description: 'ジューシーな国産合いびきハンバーグに、煮込みデミグラスソース。ごはん・スープ付き。',
    allergens: ['卵', '乳', '小麦', '牛肉', '大豆', 'ごま'],
    nutrition: { energy: '812 kcal', protein: '34.2 g', fat: '28.1 g', carbs: '98.6 g', salt: '3.1 g' },
    riceOption: true,
  },
  {
    id: 'shoyu-ramen',
    name: '醤油ラーメン',
    price: 520,
    emoji: '🍜',
    image: { uri: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80' },
    category: '麺類',
    description: '鶏ガラと魚介の合わせだし、すっきり醤油スープ。チャーシュー・メンマ・のり付き。',
    allergens: ['小麦', '大豆', 'ごま'],
    nutrition: { energy: '560 kcal', protein: '22.0 g', fat: '14.8 g', carbs: '82.0 g', salt: '5.2 g' },
    riceOption: false,
  },
  {
    id: 'curry',
    name: 'ビーフカレー',
    price: 590,
    emoji: '🍛',
    image: { uri: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=600&q=80' },
    category: 'カレー',
    description: 'じっくり煮込んだ牛すじとスパイス香るルー。福神漬け付き。辛さは中辛。',
    allergens: ['乳', '小麦', '牛肉', '大豆'],
    nutrition: { energy: '720 kcal', protein: '20.5 g', fat: '22.3 g', carbs: '108.0 g', salt: '2.6 g' },
    riceOption: true,
  },
  {
    id: 'onigiri',
    name: '焼きおにぎりセット',
    price: 280,
    emoji: '🍙',
    image: require('@/assets/images/food-onigiri.jpg'),
    category: '軽食',
    description: '香ばしく焼き上げた醤油おにぎり2個と即席味噌汁。小腹がすいたときに。',
    allergens: ['小麦', '大豆', 'ごま'],
    nutrition: { energy: '340 kcal', protein: '7.2 g', fat: '3.1 g', carbs: '70.4 g', salt: '2.0 g' },
    riceOption: false,
  },
  {
    id: 'salad',
    name: 'ミニサラダ',
    price: 120,
    emoji: '🥗',
    image: { uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80' },
    category: '軽食',
    description: '彩り野菜のサラダ。和風ドレッシング付き。定食のお供に。',
    allergens: ['大豆'],
    nutrition: { energy: '60 kcal', protein: '2.1 g', fat: '3.4 g', carbs: '6.0 g', salt: '0.6 g' },
    riceOption: false,
  },
  {
    id: 'iced-tea',
    name: 'アイスティー',
    price: 150,
    emoji: '🥤',
    image: { uri: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=600&q=80' },
    category: 'ドリンク',
    description: 'すっきり茶葉のアイスティー。Lサイズ。',
    allergens: [],
    nutrition: { energy: '30 kcal', protein: '0.0 g', fat: '0.0 g', carbs: '7.5 g', salt: '0.0 g' },
    riceOption: false,
  },
];

export function getMenuItem(id: string | undefined): MenuItem | undefined {
  return MENU.find((m) => m.id === id);
}

/** 受け取り時間の候補 */
export const PICKUP_TIMES = ['すぐに', '11:30', '12:00', '12:30', '13:00'] as const;

export const yen = (n: number) => `¥${n.toLocaleString('ja-JP')}`;
