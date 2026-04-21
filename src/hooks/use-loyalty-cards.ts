import { useCallback } from 'react';
import { useMMKVObject } from 'react-native-mmkv';
import {
  deleteLoyaltyCardImage,
  persistLoyaltyCardImage,
} from '~/src/features/loyalty-cards/image-storage';
import type { LoyaltyCard } from '~/src/features/loyalty-cards/types';
import { LOYALTY_CARDS_KEY } from '~/src/persistence/loyalty-cards-storage';
import { storage } from '~/src/persistence/MMKV';

export const useLoyaltyCards = () => {
  const [cards = [], setCards] = useMMKVObject<LoyaltyCard[]>(
    LOYALTY_CARDS_KEY,
    storage,
  );

  const getCardForShop = useCallback(
    (shopId: number) => cards.find(c => c.shopId === shopId),
    [cards],
  );

  const saveCard = useCallback(
    async (shopId: number, sourceImageUri: string) => {
      const existing = cards.find(c => c.shopId === shopId);
      if (existing) {
        await deleteLoyaltyCardImage(existing.imageUri);
      }
      const persistedUri = await persistLoyaltyCardImage(
        shopId,
        sourceImageUri,
      );
      setCards(prev => {
        const rest = (prev ?? []).filter(c => c.shopId !== shopId);
        return [
          ...rest,
          {
            shopId,
            imageUri: persistedUri,
            createdAt: new Date().toISOString(),
          },
        ];
      });
    },
    [cards, setCards],
  );

  const deleteCard = useCallback(
    async (shopId: number) => {
      const existing = cards.find(c => c.shopId === shopId);
      if (existing) {
        await deleteLoyaltyCardImage(existing.imageUri);
      }
      setCards(prev => (prev ?? []).filter(c => c.shopId !== shopId));
    },
    [cards, setCards],
  );

  return {
    cards,
    getCardForShop,
    saveCard,
    deleteCard,
  };
};
