import type React from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { HybridCartComparisonDto } from '~/network/model';
import { ShopInfoBlock } from './shop-info-block';

interface PriceSummaryCardProps {
  selectedCart?: HybridCartComparisonDto;
  isCurrentCheapest: boolean;
  isCurrentMostExpensive: boolean;
  areMoreCartsAvailable: boolean;
  savingsVsCheapest: number;
  currentCartIndex?: number;
  totalCarts?: number;
}

export const PriceSummaryCard: React.FC<PriceSummaryCardProps> = ({
  selectedCart,
  isCurrentCheapest,
  isCurrentMostExpensive,
  areMoreCartsAvailable,
  savingsVsCheapest,
  currentCartIndex = 0,
  totalCarts = 1,
}) => {
  const { t } = useTranslation('common');

  // Check if the shop has all items or is missing some
  const missingProductsCount = selectedCart?.missing_products?.length ?? 0;
  const missingCategoriesCount = selectedCart?.missing_categories?.length ?? 0;
  const totalMissingItems = missingProductsCount + missingCategoriesCount;
  const hasAllItems = totalMissingItems === 0;

  // Calculate percentage more expensive than cheapest
  const percentageMore =
    selectedCart?.total_price && savingsVsCheapest > 0
      ? (savingsVsCheapest / (selectedCart.total_price - savingsVsCheapest)) * 100
      : 0;

  const rankPosition = currentCartIndex + 1;

  // Determine which info block to show
  const getShopInfoType = () => {
    if (!hasAllItems) {
      return 'missing_items' as const;
    }

    if (!areMoreCartsAvailable) {
      return null; // Don't show any info if there's only one shop
    }

    if (isCurrentCheapest) {
      return 'cheapest' as const;
    }

    if (isCurrentMostExpensive) {
      return 'most_expensive' as const;
    }

    return 'more_expensive' as const;
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
            percentageMore={percentageMore}
            totalShops={totalCarts}
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
            <Text className="text-xs text-muted-foreground mb-1">
              {t('position')}
            </Text>
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
