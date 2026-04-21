import { storage } from '~/src/persistence/MMKV';

const getKey = (cartId: number) => `ARCHIVED_CART_CHECKED_ITEMS:${cartId}`;

export const getCheckedItems = (cartId: number): number[] => {
  const raw = storage.getString(getKey(cartId));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter(n => typeof n === 'number')
      : [];
  } catch {
    return [];
  }
};

export const setCheckedItems = (cartId: number, productIds: number[]) => {
  storage.set(getKey(cartId), JSON.stringify(productIds));
};
