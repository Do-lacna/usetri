import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, TouchableOpacity, View } from 'react-native';
import { getShopById } from '~/src/lib/utils';
import { useGetShops } from '~/src/network/query/query';
import ShopLogoBadge from '../shop-logo-badge/shop-logo-badge';
import { Text } from '../ui/text';

interface CategoryPrice {
  shop_id: number | null | undefined;
  price: number;
  originalPrice?: number;
  discountPrice?: number | null;
  product_id?: number;
}

interface CategoryPricesGridProps {
  categoryPrices?: CategoryPrice[];
  title?: string;
  showTitle?: boolean;
  className?: string;
  categoryAmount?: number | null;
  categoryUnit?: string | null;
  onPricePress?: (shopId: number, productId?: number) => void;
}

export const CategoryPricesGrid: React.FC<CategoryPricesGridProps> = ({
  categoryPrices,
  title,
  showTitle = true,
  className,
  categoryAmount,
  categoryUnit,
  onPricePress,
}) => {
  const { t } = useTranslation();
  const {
    data: { shops = [] } = {},
  } = useGetShops();

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
          {categoryPrices?.map(
            ({ shop_id, price, originalPrice, discountPrice, product_id }) => {
              const hasDiscount =
                discountPrice &&
                discountPrice > 0 &&
                discountPrice < (originalPrice ?? price);

              const shop = getShopById(shop_id ?? null, shops);
              const shopName = shop?.name || '';

              return shop_id ? (
                <TouchableOpacity
                  key={shop_id}
                  onPress={() => {
                    if (onPricePress) {
                      onPricePress(shop_id, product_id);
                    } else {
                      Alert.alert(
                        shopName,
                        `Tento obchod nemá tento konkrétny produkt, ale priemerná cena v kategórii je ${price.toFixed(
                          2,
                        )}€`,
                      );
                    }
                  }}
                  className="flex-row items-center bg-background rounded-lg px-2 py-2 border border-border"
                >
                  <ShopLogoBadge shopId={shop_id} size={20} />
                  {hasDiscount ? (
                    <View className="ml-2">
                      <Text className="text-xs text-muted-foreground line-through">
                        {originalPrice?.toFixed(2)}€
                      </Text>
                      <Text className="text-sm font-bold text-discount">
                        {discountPrice?.toFixed(2)}€
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-sm font-medium text-foreground ml-2">
                      {price.toFixed(2)}€
                    </Text>
                  )}
                </TouchableOpacity>
              ) : null;
            },
          )}
        </View>
      </View>
    </View>
  );
};
