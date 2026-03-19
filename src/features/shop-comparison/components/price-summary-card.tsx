import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import type { CartComparisonDto } from '~/src/network/model';
import { ShopInfoBlock } from './shop-info-block';

interface PriceSummaryCardProps {
  selectedCart?: CartComparisonDto;
  savingsVsCheapest: number;
  currentCartIndex?: number;
  totalCarts?: number;
  allCarts?: CartComparisonDto[];
}

export const PriceSummaryCard: React.FC<PriceSummaryCardProps> = ({
  selectedCart,
  savingsVsCheapest,
  currentCartIndex = 0,
  totalCarts = 1,
  allCarts = [],
}) => {
  const { t } = useTranslation('common');

  const missingProductsCount = selectedCart?.missing_products?.length ?? 0;
  const missingCategoriesCount = selectedCart?.missing_categories?.length ?? 0;
  const totalMissingItems = missingProductsCount + missingCategoriesCount;
  const hasAllItems = totalMissingItems === 0;

  const percentageMore = () => {
    if (!selectedCart?.total_price || savingsVsCheapest <= 0) {
      return 0;
    }

    const cheapestPrice = selectedCart.total_price - savingsVsCheapest;

    if (cheapestPrice <= 0) {
      return 0;
    }

    return (savingsVsCheapest / cheapestPrice) * 100;
  };

  const rankPosition = currentCartIndex + 1;

  const shopsWithAllItems =
    allCarts?.filter(cart => {
      const missingProducts = cart?.missing_products?.length ?? 0;
      const missingCategories = cart?.missing_categories?.length ?? 0;
      return missingProducts + missingCategories === 0;
    }) ?? [];

  const currentShopIndexInComplete = hasAllItems
    ? shopsWithAllItems.findIndex(
        cart => cart?.shop?.id === selectedCart?.shop?.id,
      )
    : -1;

  const totalCompleteShops = shopsWithAllItems.length;

  const getShopInfoType = () => {
    if (!hasAllItems) {
      return 'missing_items' as const;
    }

    if (totalCompleteShops === 1) {
      return 'cheapest' as const;
    }

    if (totalCompleteShops === 2) {
      if (currentShopIndexInComplete === 0) {
        return 'cheapest' as const;
      }
      if (currentShopIndexInComplete === 1) {
        return 'most_expensive' as const;
      }
    }

    if (totalCompleteShops > 2) {
      if (currentShopIndexInComplete === 0) {
        return 'cheapest' as const;
      }
      if (currentShopIndexInComplete === totalCompleteShops - 1) {
        return 'most_expensive' as const;
      }
      return 'more_expensive' as const;
    }

    return null;
  };

  const infoType = getShopInfoType();

  return (
    <View className="bg-card rounded-xl p-4 border border-border">
      <View className="mb-3">
        {infoType && (
          <ShopInfoBlock
            type={infoType}
            missingItemsCount={totalMissingItems}
            percentageMore={percentageMore()}
            totalShops={totalCompleteShops}
          />
        )}
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-sm font-expose text-muted-foreground mb-1">
            {hasAllItems ? t('total_sum') : t('partial_sum')}
          </Text>
          <Text className="text-3xl font-expose-bold text-foreground">
            {selectedCart?.total_price?.toFixed(2)} €
          </Text>
          {!hasAllItems && (
            <Text className="text-xs font-expose text-muted-foreground mt-1">
              {t('price_for_available_items')}
            </Text>
          )}
        </View>

        {totalCarts > 1 && (
          <View className="items-center ml-4">
            <View className="bg-secondary rounded-full px-3 py-1">
              <Text className="text-sm font-expose-bold text-foreground">
                {rankPosition}/{totalCarts}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
