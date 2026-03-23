import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';
import type { CartComparisonProductDto } from '~/src/network/model';

interface MissingProductCardProps {
  product: CartComparisonProductDto;
  index: number;
  totalProducts: number;
  shopName?: string; // Optional shop name to display which shop is missing the product
}

export const MissingProductCard: React.FC<MissingProductCardProps> = ({
  product,
  index,
  totalProducts,
  shopName,
}) => {
  const { t } = useTranslation();
  const {
    detail: {
      name,
      brand,
      unit: { normalized_amount: amount, normalized_unit: unit } = {},
      category: { image_url, name: categoryName } = {},
    } = {},
    price = 0,
    quantity = 1,
  } = product ?? {};

  const borderClass = index < totalProducts - 1 ? 'border-b border-border' : '';

  return (
    <View className={`p-4 bg-destructive/10 ${borderClass}`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <View className="w-3 h-3 bg-destructive rounded-full mr-2" />
            <Text className="text-base font-expose text-muted-foreground line-through">
              {name}
            </Text>
          </View>

          <Text className="text-sm font-expose text-muted-foreground ml-5">
            {amount} {unit}
          </Text>

          {categoryName && (
            <View className="flex-row items-center mt-2 ml-5">
              {!!image_url && (
                <Image
                  source={{ uri: image_url }}
                  resizeMode="contain"
                  className="w-6 h-6 mr-2"
                />
              )}
              <Text className="text-sm font-expose text-primary">
                {t('shop_comparison.product_category', { categoryName })}
              </Text>
            </View>
          )}

          {shopName && (
            <Text className="text-xs font-expose text-destructive mt-1 ml-5">
              {t('shop_comparison.not_available_at', { shopName })}
            </Text>
          )}
        </View>

        <View className="items-end ml-4">
          <View className="bg-destructive/20 px-2 py-1 rounded">
            <Text className="text-sm font-expose-bold text-destructive">
              {t('shop_comparison.not_available')}
            </Text>
          </View>

          <Text className="text-sm font-expose text-muted-foreground line-through mt-1">
            {(price * quantity).toFixed(2)} €
          </Text>

          {quantity > 1 && (
            <Text className="text-xs font-expose text-muted-foreground line-through">
              {quantity} x {price.toFixed(2)} €
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};
