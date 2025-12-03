import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import type { CartComparisonDto } from '~/src/network/model';
import { ShopInfoBlock } from './shop-info-block';

interface PriceSummaryCardProps {
  selectedCart?: CartComparisonDto;
  isCurrentCheapest: boolean;
  isCurrentMostExpensive: boolean;
  areMoreCartsAvailable: boolean;
  savingsVsCheapest: number;
  currentCartIndex?: number;
  totalCarts?: number;
  allCarts?: CartComparisonDto[]; // We need all carts to filter out missing products
}

export const PriceSummaryCard: React.FC<PriceSummaryCardProps> = ({
  selectedCart,
  isCurrentCheapest,
  isCurrentMostExpensive,
  areMoreCartsAvailable,
  savingsVsCheapest,
  currentCartIndex = 0,
  totalCarts = 1,
  allCarts = [], // We need all carts to filter out missing products
}) => {
  const { t } = useTranslation('common');

  // Check if the shop has all items or is missing some
  const missingProductsCount = selectedCart?.missing_products?.length ?? 0;
  const missingCategoriesCount = selectedCart?.missing_categories?.length ?? 0;
  const totalMissingItems = missingProductsCount + missingCategoriesCount;
  const hasAllItems = totalMissingItems === 0;

  // Calculate percentage more expensive than cheapest
  const percentageMore = () => {
    if (!selectedCart?.total_price || savingsVsCheapest <= 0) {
      return 0;
    }

    // Find the cheapest price among shops with all items
    const cheapestPrice = selectedCart.total_price - savingsVsCheapest;

    if (cheapestPrice <= 0) {
      return 0;
    }

    // Calculate: (difference / cheapest_price) * 100
    return (savingsVsCheapest / cheapestPrice) * 100;
  };

  const rankPosition = currentCartIndex + 1;

  // Filter out shops with missing products for comparison
  const shopsWithAllItems =
    allCarts?.filter(cart => {
      const missingProducts = cart?.missing_products?.length ?? 0;
      const missingCategories = cart?.missing_categories?.length ?? 0;
      return missingProducts + missingCategories === 0;
    }) ?? [];

  // Find current shop's position among shops with all items
  const currentShopIndexInComplete = hasAllItems
    ? shopsWithAllItems.findIndex(
        cart => cart?.shop?.id === selectedCart?.shop?.id,
      )
    : -1;

  const totalCompleteShops = shopsWithAllItems.length;

  // Determine which info block to show
  const getShopInfoType = () => {
    if (!hasAllItems) {
      return 'missing_items' as const;
    }

    // Handle different scenarios based on number of complete shops
    if (totalCompleteShops === 1) {
      // Only one complete shop - show cheapest
      return 'cheapest' as const;
    }

    if (totalCompleteShops === 2) {
      // Two complete shops - show cheapest and most expensive only
      if (currentShopIndexInComplete === 0) {
        return 'cheapest' as const;
      }
      if (currentShopIndexInComplete === 1) {
        return 'most_expensive' as const;
      }
    }

    if (totalCompleteShops > 2) {
      // Three or more complete shops - show cheapest, middle (more expensive), and most expensive
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
      {/* Status Section */}
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

      {/* Price Section */}
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-sm text-muted-foreground mb-1">
            {hasAllItems ? t('total_sum') : t('partial_sum')}
          </Text>
          <Text className="text-3xl font-bold text-foreground">
            {selectedCart?.total_price?.toFixed(2)} €
          </Text>
          {!hasAllItems && (
            <Text className="text-xs text-muted-foreground mt-1">
              {t('price_for_available_items')}
            </Text>
          )}
        </View>

        {/* Quick comparison indicator */}
        {totalCarts > 1 && (
          <View className="items-center ml-4">
            <View className="bg-secondary rounded-full px-3 py-1">
              <Text className="text-sm font-semibold text-foreground">
                {rankPosition}/{totalCarts}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
