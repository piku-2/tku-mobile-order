import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, type ColorValue } from 'react-native';

import { Brand } from '@/constants/brand';

function TabIcon({ glyph, color }: { glyph: string; color: ColorValue }) {
  return <Text style={[styles.icon, { color }]}>{glyph}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Brand.crimson,
        tabBarInactiveTintColor: '#9A9A9A',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'ホーム',
          tabBarIcon: ({ color }) => <TabIcon glyph="⌂" color={color} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'メニュー',
          tabBarIcon: ({ color }) => <TabIcon glyph="🍴" color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: '注文履歴',
          tabBarIcon: ({ color }) => <TabIcon glyph="🧾" color={color} />,
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: 'マイページ',
          tabBarIcon: ({ color }) => <TabIcon glyph="◍" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Brand.white,
    borderTopColor: Brand.border,
    height: Platform.select({ ios: 86, default: 64 }),
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  icon: {
    fontSize: 20,
    lineHeight: 24,
  },
});
