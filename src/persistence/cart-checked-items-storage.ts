import { storage } from '~/src/persistence/MMKV';

const KEY_PREFIX = 'ARCHIVED_CART_CHECKED_ITEMS:';
const getKey = (cartId: number) => `${KEY_PREFIX}${cartId}`;

export const clearAllCheckedItems = () => {
  for (const key of storage.getAllKeys()) {
    if (key.startsWith(KEY_PREFIX)) {
      storage.delete(key);
    }
  }
};

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
