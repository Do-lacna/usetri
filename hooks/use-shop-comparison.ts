import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  displayErrorToastMessage,
  displaySuccessToastMessage,
} from '~/utils/toast-utils';

import {
  getGetArchivedCartQueryKey,
  useCreateArchivedCart,
} from '~/network/customer/customer';
import {
  getGetHybridCartQueryKey,
  useDeleteHybridCart,
  useGetHybridCartComparison,
} from '~/network/hybrid-cart/hybrid-cart';

export const useShopComparison = () => {
  const queryClient = useQueryClient();
  const [currentCartIndex, setCurrentCartIndex] = useState<number>(0);
  const [flippedItems, setFlippedItems] = useState<Set<string>>(new Set());

  const {
    data: { carts = [] } = {},
    isLoading,
  } = useGetHybridCartComparison();

  const { mutate: sendCreateArchivedCart, isIdle } = useCreateArchivedCart({
    mutation: {
      onError: () => {
        displayErrorToastMessage('Nepodarilo sa uložiť košík');
      },
      onSuccess: () => {
        displaySuccessToastMessage(
          'Váš košík bol úspešne uložený vo vašom profile',
        );
        queryClient.invalidateQueries({
          queryKey: getGetHybridCartQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getGetArchivedCartQueryKey(),
        });
        router.back();
      },
    },
  });

  const { mutate: sendDiscardCart } = useDeleteHybridCart({
    mutation: {
      onError: () => {
        displayErrorToastMessage('Nepodarilo sa zahodiť košík');
      },
      onSuccess: () => {
        displaySuccessToastMessage('Váš košík bol úspešne vymazaný');
        queryClient.invalidateQueries({
          queryKey: getGetHybridCartQueryKey(),
        });
        router.back();
      },
    },
  });

  const resetFlippedItems = () => setFlippedItems(new Set());

  const nextShop = (): void => {
    setCurrentCartIndex(prev => (prev + 1) % (carts?.length ?? 0));
    resetFlippedItems();
  };

  const prevShop = (): void => {
    setCurrentCartIndex(
      prev => (prev - 1 + (carts?.length ?? 0)) % (carts?.length ?? 0),
    );
    resetFlippedItems();
  };

  const goToShop = (index: number): void => {
    setCurrentCartIndex(index);
    resetFlippedItems();
  };

  const handleFlipItem = (barcode: string): void => {
    setFlippedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(barcode)) {
        newSet.delete(barcode);
      } else {
        newSet.add(barcode);
      }
      return newSet;
    });
  };

  const handleSaveCart = (): void => {
    const selectedCart = carts?.[currentCartIndex];
    sendCreateArchivedCart({
      data: { selected_shop_id: selectedCart?.shop?.id },
    });
  };

  const handleDiscardCart = (): void => {
    sendDiscardCart();
  };

  // Computed values
  const selectedCart = carts?.[currentCartIndex];
  const currentShop = selectedCart?.shop;

  // Properly calculate cheapest and most expensive totals
  const validTotals = carts?.map(cart => cart.total_price).filter(price => price != null) ?? [];
  const cheapestTotal = validTotals.length > 0 ? Math.min(...validTotals) : 0;
  const mostExpensiveTotal = validTotals.length > 0 ? Math.max(...validTotals) : 0;

  const currentTotal = selectedCart?.total_price ?? 0;
  const areMoreCartsAvailable = carts.length > 1;

  const isCurrentCheapest = currentTotal === cheapestTotal && currentTotal > 0;
  const isCurrentMostExpensive = currentTotal === mostExpensiveTotal && currentTotal > 0;
  const savingsVsCheapest = currentTotal - cheapestTotal;
  const savingsVsMostExpensive = mostExpensiveTotal - currentTotal;

  return {
    // State
    currentCartIndex,
    flippedItems,
    carts,
    isLoading,
    isIdle,

    // Computed values
    selectedCart,
    currentShop,
    areMoreCartsAvailable,
    isCurrentCheapest,
    isCurrentMostExpensive,
    savingsVsCheapest,
    savingsVsMostExpensive,

    // Actions
    nextShop,
    prevShop,
    goToShop,
    handleFlipItem,
    handleSaveCart,
    handleDiscardCart,
  };
};
