import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type { MenuItem } from '@/data/menu';

export type RiceSize = 'small' | 'regular' | 'large';

/** ごはん量による価格差 */
export const RICE_DELTA: Record<RiceSize, number> = {
  small: -20,
  regular: 0,
  large: 20,
};

export const RICE_LABEL: Record<RiceSize, string> = {
  small: '小盛',
  regular: '並盛',
  large: '大盛',
};

export type CartLine = {
  /** 同一メニューでもごはん量違いは別行として扱うためのキー */
  key: string;
  item: MenuItem;
  qty: number;
  rice: RiceSize;
};

/** 1行あたりの単価 (ごはん量込み) */
export function linePrice(line: CartLine): number {
  return line.item.price + (line.item.riceOption ? RICE_DELTA[line.rice] : 0);
}

type CartState = {
  lines: CartLine[];
  pickupTime: string;
  addItem: (item: MenuItem, opts?: { rice?: RiceSize; qty?: number }) => void;
  setQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  clear: () => void;
  setPickupTime: (time: string) => void;
  subtotal: number;
  /** 学割10% */
  studentDiscount: number;
  /** 食事プラン利用による割引 */
  mealPlanDiscount: number;
  total: number;
  count: number;
};

const MEAL_PLAN_DISCOUNT = 300;

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [pickupTime, setPickupTime] = useState<string>('12:00');

  const addItem = useCallback<CartState['addItem']>((item, opts) => {
    const rice = opts?.rice ?? 'regular';
    const qty = opts?.qty ?? 1;
    const key = `${item.id}__${rice}`;
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) {
        return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { key, item, qty, rice }];
    });
  }, []);

  const setQty = useCallback<CartState['setQty']>((key, qty) => {
    setLines((prev) =>
      prev.flatMap((l) => {
        if (l.key !== key) return [l];
        if (qty <= 0) return [];
        return [{ ...l, qty }];
      }),
    );
  }, []);

  const removeLine = useCallback<CartState['removeLine']>((key) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartState>(() => {
    const subtotal = lines.reduce((sum, l) => sum + linePrice(l) * l.qty, 0);
    const studentDiscount = Math.round(subtotal * 0.1);
    const mealPlanDiscount = subtotal > 0 ? Math.min(MEAL_PLAN_DISCOUNT, subtotal - studentDiscount) : 0;
    const total = Math.max(0, subtotal - studentDiscount - mealPlanDiscount);
    const count = lines.reduce((sum, l) => sum + l.qty, 0);
    return {
      lines,
      pickupTime,
      addItem,
      setQty,
      removeLine,
      clear,
      setPickupTime,
      subtotal,
      studentDiscount,
      mealPlanDiscount,
      total,
      count,
    };
  }, [lines, pickupTime, addItem, setQty, removeLine, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
