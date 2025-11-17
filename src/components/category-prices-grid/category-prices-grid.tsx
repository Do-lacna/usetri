import type React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import ShopLogoBadge from '../shop-logo-badge/shop-logo-badge';
import { Text } from '../ui/text';

interface CategoryPrice {
  shop_id: number | null | undefined;
  price: number;
}

interface CategoryPricesGridProps {
  categoryPrices?: CategoryPrice[];
  title?: string;
  showTitle?: boolean;
  className?: string;
  categoryAmount?: number | null;
  categoryUnit?: string | null;
}

export const CategoryPricesGrid: React.FC<CategoryPricesGridProps> = ({
  categoryPrices,
  title,
  showTitle = true,
  className,
  categoryAmount,
  categoryUnit,
}) => {
  const { t } = useTranslation();

  if (!categoryPrices || categoryPrices.length === 0) {
    return null;
  }

  return (
    <View className={className}>
      {showTitle && (
        <Text className="text-sm font-semibold text-foreground mb-3">
          {title ?? t('cart_drawer.estimated_prices')}
        </Text>
      )}
      {categoryAmount && categoryUnit && (
        <Text className="text-xs text-muted-foreground mb-2">
          {t('cart_drawer.price_for_amount', {
            amount: categoryAmount,
            unit: categoryUnit,
          })}
        </Text>
      )}
      <View className="bg-muted rounded-xl py-4 px-2 border border-border">
        <View className="flex-row flex-wrap gap-3">
          {categoryPrices?.map(({ shop_id, price }) =>
            shop_id ? (
              <View
                key={shop_id}
                className="flex-row items-center bg-background rounded-lg px-2 py-2 border border-border"
              >
                <ShopLogoBadge shopId={shop_id} size={20} />
                <Text className="text-sm font-medium text-foreground ml-2">
                  {price.toFixed(2)}€
                </Text>
              </View>
            ) : null,
          )}
        </View>
      </View>
    </View>
  );
};
